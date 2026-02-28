/**
 * Shared Google Sheets read/write helper for admin operations.
 * Uses full spreadsheets scope (read+write), separate from the readonly scope
 * used by inventory.ts and promoCodes.ts.
 * Same auth pattern: supports GOOGLE_APPLICATION_CREDENTIALS file path OR
 * GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL + GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.
 */

import path from "path";
import { GoogleAuth } from "google-auth-library";

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets";

/** Cache for sheet GIDs (tab name → numeric GID). */
const gidCache = new Map<string, number>();

function getSheetId(): string {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) throw new Error("GOOGLE_SHEET_ID is not set");
  return id;
}

async function getAccessToken(): Promise<string> {
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  const authOpts: {
    scopes: string[];
    keyFilename?: string;
    credentials?: { client_email: string; private_key: string };
  } = { scopes: [SHEETS_SCOPE] };

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
    throw new Error(
      "Google Sheets credentials not configured. Set GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL + GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY."
    );
  }

  const auth = new GoogleAuth(authOpts);
  const token = await auth.getAccessToken();
  if (!token) throw new Error("Failed to obtain Google access token");
  return token;
}

/** Read a range and return the rows (2D array). */
export async function readRange(range: string): Promise<unknown[][]> {
  const sheetId = getSheetId();
  const token = await getAccessToken();

  const url = `${BASE_URL}/${sheetId}/values/${encodeURIComponent(range)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(10_000),
  });

  if (res.status === 403) {
    throw new Error(
      "Google Sheets returned 403 Forbidden. Ensure the service account has Editor access to the spreadsheet."
    );
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sheets API GET error: ${res.status} ${res.statusText} — ${body}`);
  }

  const json = (await res.json()) as { values?: unknown[][] };
  return json.values ?? [];
}

/** Overwrite a range with the given values. */
export async function updateRange(range: string, values: unknown[][]): Promise<void> {
  const sheetId = getSheetId();
  const token = await getAccessToken();

  const url = `${BASE_URL}/${sheetId}/values/${encodeURIComponent(range)}?valueInputOption=RAW`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ range, values }),
    signal: AbortSignal.timeout(10_000),
  });

  if (res.status === 403) {
    throw new Error(
      "Google Sheets returned 403 Forbidden. Ensure the service account has Editor access to the spreadsheet."
    );
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sheets API PUT error: ${res.status} ${res.statusText} — ${body}`);
  }
}

/** Append rows to the end of a range. */
export async function appendRows(range: string, values: unknown[][]): Promise<void> {
  const sheetId = getSheetId();
  const token = await getAccessToken();

  const url = `${BASE_URL}/${sheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values }),
    signal: AbortSignal.timeout(10_000),
  });

  if (res.status === 403) {
    throw new Error(
      "Google Sheets returned 403 Forbidden. Ensure the service account has Editor access to the spreadsheet."
    );
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sheets API APPEND error: ${res.status} ${res.statusText} — ${body}`);
  }
}

/** Get the numeric sheet GID for a tab by its title. Cached after first lookup. */
export async function getSheetGid(tabName: string): Promise<number> {
  const cached = gidCache.get(tabName);
  if (cached !== undefined) return cached;

  const sheetId = getSheetId();
  const token = await getAccessToken();

  const url = `${BASE_URL}/${sheetId}?fields=sheets.properties`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sheets API metadata error: ${res.status} ${res.statusText} — ${body}`);
  }

  const json = (await res.json()) as {
    sheets: { properties: { title: string; sheetId: number } }[];
  };

  for (const sheet of json.sheets) {
    gidCache.set(sheet.properties.title, sheet.properties.sheetId);
  }

  const gid = gidCache.get(tabName);
  if (gid === undefined) {
    throw new Error(`Sheet tab "${tabName}" not found in spreadsheet`);
  }
  return gid;
}

/** Delete a row by its 0-based index in a specific sheet tab. */
export async function deleteRow(tabName: string, rowIndex: number): Promise<void> {
  const sheetId = getSheetId();
  const token = await getAccessToken();
  const gid = await getSheetGid(tabName);

  const url = `${BASE_URL}/${sheetId}:batchUpdate`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: gid,
              dimension: "ROWS",
              startIndex: rowIndex,
              endIndex: rowIndex + 1,
            },
          },
        },
      ],
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (res.status === 403) {
    throw new Error(
      "Google Sheets returned 403 Forbidden. Ensure the service account has Editor access to the spreadsheet."
    );
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sheets API batchUpdate error: ${res.status} ${res.statusText} — ${body}`);
  }
}
