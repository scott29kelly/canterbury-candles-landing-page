/**
 * Google Sheets inventory integration.
 * Reads a sheet with columns: A = scent name, B = 8oz quantity, C = 16oz quantity.
 * If only two columns exist (legacy), the single quantity applies to both sizes.
 * Supports:
 * - Service account (private sheet): set GOOGLE_APPLICATION_CREDENTIALS to JSON path, or
 *   GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL + GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in env.
 * - API key (public sheet): set GOOGLE_SHEETS_API_KEY (legacy).
 * Graceful degradation: returns {} when env vars are missing or Sheets is unreachable.
 */

import path from "path";
import { GoogleAuth } from "google-auth-library";
import { type SizeAvailability } from "@/data/products";

interface CacheEntry {
  data: Record<string, SizeAvailability>;
  timestamp: number;
}

let cache: CacheEntry | null = null;
export function clearInventoryCache(): void { cache = null; }
const CACHE_TTL_MS = 10_000; // 10 seconds — low-traffic site, Sheets API allows 300 req/min
const SHEETS_READONLY_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";

/** Sheets API returns quantity as number or string. Normalize to number (default 0). */
function parseQuantity(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Number(value.trim());
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

/** Parse a single row into per-size availability. */
function parseRow(row: unknown[]): SizeAvailability {
  const qty8 = parseQuantity(row[1]);
  // If column C is missing, fall back to column B for both sizes (backward compat)
  const qty16 = row.length > 2 ? parseQuantity(row[2]) : qty8;
  return { "8oz": qty8 > 0, "16oz": qty16 > 0 };
}

/** Convert raw Sheets rows to inventory map. */
function rowsToInventory(rows: unknown[][]): Record<string, SizeAvailability> {
  const inventory: Record<string, SizeAvailability> = {};
  for (const row of rows) {
    const name = typeof row[0] === "string" ? row[0].trim() : String(row[0] ?? "").trim();
    if (name) {
      inventory[name] = parseRow(row);
    }
  }
  return inventory;
}

function getSheetId(): string | undefined {
  return process.env.GOOGLE_SHEET_ID;
}

/** True when service account env is set (file path or client_email + private_key). */
function useServiceAccount(): boolean {
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  return !!(credPath || (email && key));
}

/** Fetch inventory from Sheets using a Bearer token (service account). */
async function fetchWithServiceAccount(sheetId: string): Promise<Record<string, SizeAvailability>> {
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  const authOpts: { scopes: string[]; keyFilename?: string; credentials?: { client_email: string; private_key: string } } = {
    scopes: [SHEETS_READONLY_SCOPE],
  };
  if (credPath) {
    // Resolve relative paths (e.g. ./google-service-account.json) against cwd
    authOpts.keyFilename = path.isAbsolute(credPath)
      ? credPath
      : path.resolve(process.cwd(), credPath);
  } else if (email && privateKey) {
    authOpts.credentials = {
      client_email: email,
      private_key: privateKey.replace(/\\n/g, "\n"),
    };
  } else {
    return cache?.data ?? {};
  }

  const auth = new GoogleAuth(authOpts);
  const accessToken = await auth.getAccessToken();
  if (!accessToken) {
    console.error("Google Auth: failed to get access token");
    return cache?.data ?? {};
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A2:C`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(5000),
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Sheets API error: ${res.status} ${res.statusText}`, body);
    return cache?.data ?? {};
  }

  const json = (await res.json()) as { values?: unknown[][] };
  return rowsToInventory(json.values ?? []);
}

/** Fetch inventory from Sheets using API key (public sheet). */
async function fetchWithApiKey(sheetId: string): Promise<Record<string, SizeAvailability>> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!apiKey) return cache?.data ?? {};

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A2:C?key=${apiKey}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    console.error(`Sheets API error: ${res.status} ${res.statusText}`);
    return cache?.data ?? {};
  }

  const json = (await res.json()) as { values?: unknown[][] };
  return rowsToInventory(json.values ?? []);
}

export async function getInventory(): Promise<Record<string, SizeAvailability>> {
  const sheetId = getSheetId();
  if (!sheetId) {
    return cache?.data ?? {};
  }

  // Prefer service account when configured; otherwise API key (public sheet)
  const useService = useServiceAccount();
  if (!useService && !process.env.GOOGLE_SHEETS_API_KEY) {
    return cache?.data ?? {};
  }

  // Serve from cache if fresh
  if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return cache.data;
  }

  try {
    const inventory = useService
      ? await fetchWithServiceAccount(sheetId)
      : await fetchWithApiKey(sheetId);
    cache = { data: inventory, timestamp: Date.now() };
    return inventory;
  } catch (err) {
    console.error("Failed to fetch inventory from Google Sheets:", err);
    return cache?.data ?? {};
  }
}

/** Returns true if any size of a scent is available. Missing from map = available. */
export function isScentAvailable(
  inventory: Record<string, SizeAvailability>,
  name: string
): boolean {
  if (!(name in inventory)) return true;
  const sizes = inventory[name];
  return sizes["8oz"] || sizes["16oz"];
}

/** Returns true if a specific size of a scent is available. Missing from map = available. */
export function isSizeAvailable(
  inventory: Record<string, SizeAvailability>,
  name: string,
  size: "8oz" | "16oz"
): boolean {
  if (!(name in inventory)) return true;
  return inventory[name][size];
}
