/**
 * Google Sheets promo code integration.
 * Reads "Promo Codes" tab columns I:N starting at row 10:
 *   I = Code, J = Type, K = Value, L = Active, M = Min Purchase, N = Expiry Date.
 * Mirrors auth pattern from inventory.ts (service account or API key).
 * Own cache (30s TTL, separate from inventory cache).
 */

import path from "path";
import { GoogleAuth } from "google-auth-library";

export interface PromoCode {
  code: string;
  type: "percent" | "flat";
  value: number;
  active: boolean;
  minPurchase: number;
  expiryDate: Date | null;
}

export interface PromoValidation {
  valid: true;
  code: string;
  type: "percent" | "flat";
  value: number;
  discountAmount: number;
}

export interface PromoError {
  valid: false;
  error: string;
}

interface CacheEntry {
  data: PromoCode[];
  timestamp: number;
}

let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 30_000; // 30 seconds
const SHEETS_READONLY_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";
const RANGE = "'Promo Codes'!I10:N";

function getSheetId(): string | undefined {
  return process.env.GOOGLE_SHEET_ID;
}

function useServiceAccount(): boolean {
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  return !!(credPath || (email && key));
}

/** Parse a date string like "3/31/2026" or "12/15/2026" into a Date (end of day). */
function parseDate(val: unknown): Date | null {
  if (typeof val !== "string" || !val.trim()) return null;
  const d = new Date(val.trim());
  if (isNaN(d.getTime())) return null;
  // Set to end of day so the code is valid through the full expiry date
  d.setHours(23, 59, 59, 999);
  return d;
}

function parseRows(rows: unknown[][]): PromoCode[] {
  const codes: PromoCode[] = [];
  for (const row of rows) {
    // I=Code, J=Type, K=Value, L=Active, M=Min Purchase, N=Expiry Date
    const code = typeof row[0] === "string" ? row[0].trim().toUpperCase() : "";
    const rawType = typeof row[1] === "string" ? row[1].trim().toLowerCase() : "";
    const type = rawType === "flat" ? "flat" : "percent";
    const rawValue = typeof row[2] === "string" ? Number(row[2]) : typeof row[2] === "number" ? row[2] : 0;
    const value = Number.isFinite(rawValue) && rawValue > 0 ? rawValue : 0;
    const active = typeof row[3] === "string" ? row[3].trim().toUpperCase() === "TRUE" : row[3] === true;
    const rawMin = typeof row[4] === "string" ? Number(row[4]) : typeof row[4] === "number" ? row[4] : 0;
    const minPurchase = Number.isFinite(rawMin) && rawMin > 0 ? rawMin : 0;
    const expiryDate = parseDate(row[5]);

    if (code && value > 0) {
      codes.push({ code, type, value, active, minPurchase, expiryDate });
    }
  }
  return codes;
}

async function fetchWithServiceAccount(sheetId: string): Promise<PromoCode[]> {
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  const authOpts: { scopes: string[]; keyFilename?: string; credentials?: { client_email: string; private_key: string } } = {
    scopes: [SHEETS_READONLY_SCOPE],
  };
  if (credPath) {
    authOpts.keyFilename = path.isAbsolute(credPath)
      ? credPath
      : path.resolve(process.cwd(), credPath);
  } else if (email && privateKey) {
    authOpts.credentials = {
      client_email: email,
      private_key: privateKey.replace(/\\n/g, "\n"),
    };
  } else {
    return cache?.data ?? [];
  }

  const auth = new GoogleAuth(authOpts);
  const accessToken = await auth.getAccessToken();
  if (!accessToken) {
    console.error("Google Auth: failed to get access token for promo codes");
    return cache?.data ?? [];
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(RANGE)}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(5000),
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Sheets API error (promo): ${res.status} ${res.statusText}`, body);
    return cache?.data ?? [];
  }

  const json = (await res.json()) as { values?: unknown[][] };
  return parseRows(json.values ?? []);
}

async function fetchWithApiKey(sheetId: string): Promise<PromoCode[]> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!apiKey) return cache?.data ?? [];

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(RANGE)}?key=${apiKey}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    console.error(`Sheets API error (promo): ${res.status} ${res.statusText}`);
    return cache?.data ?? [];
  }

  const json = (await res.json()) as { values?: unknown[][] };
  return parseRows(json.values ?? []);
}

export async function getPromoCodes(): Promise<PromoCode[]> {
  const sheetId = getSheetId();
  if (!sheetId) return cache?.data ?? [];

  const useService = useServiceAccount();
  if (!useService && !process.env.GOOGLE_SHEETS_API_KEY) {
    return cache?.data ?? [];
  }

  if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return cache.data;
  }

  try {
    const codes = useService
      ? await fetchWithServiceAccount(sheetId)
      : await fetchWithApiKey(sheetId);
    cache = { data: codes, timestamp: Date.now() };
    return codes;
  } catch (err) {
    console.error("Failed to fetch promo codes from Google Sheets:", err);
    return cache?.data ?? [];
  }
}

export async function validatePromoCode(code: string, subtotal: number): Promise<PromoValidation | PromoError> {
  if (!code || typeof code !== "string") {
    return { valid: false, error: "Please enter a promo code." };
  }

  const normalized = code.trim().toUpperCase();
  const codes = await getPromoCodes();
  const promo = codes.find((c) => c.code === normalized);

  if (!promo) {
    return { valid: false, error: "Invalid promo code." };
  }

  if (!promo.active) {
    return { valid: false, error: "This promo code is not currently active." };
  }

  if (promo.expiryDate && new Date() > promo.expiryDate) {
    return { valid: false, error: "This promo code has expired." };
  }

  if (promo.minPurchase > 0 && subtotal < promo.minPurchase) {
    return { valid: false, error: `Minimum purchase of $${promo.minPurchase} required for this code.` };
  }

  let discountAmount: number;
  if (promo.type === "percent") {
    discountAmount = Math.round(subtotal * promo.value / 100);
  } else {
    discountAmount = Math.min(promo.value, subtotal);
  }

  return {
    valid: true,
    code: promo.code,
    type: promo.type,
    value: promo.value,
    discountAmount,
  };
}
