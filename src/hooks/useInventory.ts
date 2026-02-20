import { useState, useEffect, useRef } from "react";

const POLL_INTERVAL_MS = 30_000; // 30 seconds

export function useInventory(): Record<string, boolean> {
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const prevRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;

    async function fetchInventory() {
      try {
        const res = await fetch("/api/inventory");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (active && json.availability) {
          prevRef.current = json.availability;
          setAvailability(json.availability);
        }
      } catch {
        // On error, keep previous state (no update)
      }
    }

    fetchInventory();
    const interval = setInterval(fetchInventory, POLL_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return availability;
}
