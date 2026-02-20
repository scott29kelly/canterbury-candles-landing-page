/**
 * Google Sheets inventory integration.
 * Reads a sheet named "Inventory" with columns: A = scent name, B = available (TRUE/FALSE or checkbox).
 * Supports:
 * - Service account (private sheet): set GOOGLE_APPLICATION_CREDENTIALS to JSON path, or
 *   GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL + GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in env.
 * - API key (public sheet): set GOOGLE_SHEETS_API_KEY (legacy).
 * Graceful degradation: returns {} when env vars are missing or Sheets is unreachable.
 */

import path from "path";
import { GoogleAuth } from "google-auth-library";

interface CacheEntry {
  data: Record<string, boolean>;
  timestamp: number;
}

let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 30_000; // 30 seconds — balance freshness vs API quota
const SHEETS_READONLY_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";

/** Sheets API returns checkbox as boolean; text cells as string. Normalize to boolean. */
function parseAvailable(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.trim().toUpperCase() === "TRUE";
  return false;
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
async function fetchWithServiceAccount(sheetId: string): Promise<Record<string, boolean>> {
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

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A2:B`;
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
  const rows = json.values ?? [];
  const inventory: Record<string, boolean> = {};
  for (const row of rows) {
    const name = typeof row[0] === "string" ? row[0].trim() : String(row[0] ?? "").trim();
    if (name) {
      inventory[name] = parseAvailable(row[1]);
    }
  }
  return inventory;
}

/** Fetch inventory from Sheets using API key (public sheet). */
async function fetchWithApiKey(sheetId: string): Promise<Record<string, boolean>> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!apiKey) return cache?.data ?? {};

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A2:B?key=${apiKey}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    console.error(`Sheets API error: ${res.status} ${res.statusText}`);
    return cache?.data ?? {};
  }

  const json = (await res.json()) as { values?: unknown[][] };
  const rows = json.values ?? [];
  const inventory: Record<string, boolean> = {};
  for (const row of rows) {
    const name = typeof row[0] === "string" ? row[0].trim() : String(row[0] ?? "").trim();
    if (name) {
      inventory[name] = parseAvailable(row[1]);
    }
  }
  return inventory;
}

export async function getInventory(): Promise<Record<string, boolean>> {
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

/** Returns true if a scent is available. Missing from map = available. */
export function isScentAvailable(
  inventory: Record<string, boolean>,
  name: string
): boolean {
  if (!(name in inventory)) return true;
  return inventory[name];
}
