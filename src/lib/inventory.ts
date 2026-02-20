/**
 * Google Sheets inventory integration.
 * Reads a sheet named "Inventory" with columns: A = scent name, B = available (TRUE/FALSE).
 * Graceful degradation: returns {} when env vars are missing or Sheets is unreachable.
 */

interface CacheEntry {
  data: Record<string, boolean>;
  timestamp: number;
}

let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 60_000; // 60 seconds

export async function getInventory(): Promise<Record<string, boolean>> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!apiKey || !sheetId) {
    return cache?.data ?? {};
  }

  // Serve from cache if fresh
  if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return cache.data;
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Inventory!A2:B?key=${apiKey}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.error(`Sheets API error: ${res.status} ${res.statusText}`);
      return cache?.data ?? {};
    }

    const json = await res.json();
    const rows: string[][] = json.values ?? [];

    const inventory: Record<string, boolean> = {};
    for (const row of rows) {
      const name = row[0]?.trim();
      const available = row[1]?.trim().toUpperCase();
      if (name) {
        inventory[name] = available === "TRUE";
      }
    }

    cache = { data: inventory, timestamp: Date.now() };
    return inventory;
  } catch (err) {
    console.error("Failed to fetch inventory from Google Sheets:", err);
    // Serve stale cache on error, or empty object if no cache
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
