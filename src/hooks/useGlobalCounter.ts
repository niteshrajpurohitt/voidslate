import { useState, useEffect, useCallback } from "react";

// Initial starting count for Voidslate
const BASE_COUNT = 0;

// Environment check for separate development vs production key
const IS_DEV = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

// Workspace and counter name (Dev vs Prod) — counterapi.dev v2
const WORKSPACE = "voidslate";
const COUNTER_NAME = IS_DEV ? "thoughts-dev" : "thoughts-prod";

// counterapi.dev v2 endpoints (auto-creates counter on first hit)
const BASE = `https://api.counterapi.dev/v2/${WORKSPACE}/${COUNTER_NAME}`;
const GET_URL = BASE;
const HIT_URL = `${BASE}/up`;

export function useGlobalCounter() {
  const [count, setCount] = useState<number>(BASE_COUNT);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch the latest count from the API
  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch(GET_URL);
      if (res.ok) {
        const data = await res.json();
        // counterapi.dev v2 returns { count: number }
        if (typeof data.count === "number") {
          setCount(data.count);
        }
      }
    } catch {
      // Fallback silently if offline or blocked
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On mount and polling every 12 seconds
  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 12000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  // Triggered when user presses EXECUTE
  const incrementCount = useCallback(async () => {
    // 1. Optimistic UI update immediately (+1)
    setCount((prev) => prev + 1);

    // 2. Background ping to API
    try {
      const res = await fetch(HIT_URL);
      if (res.ok) {
        const data = await res.json();
        // counterapi.dev v2 returns { count: number }
        if (typeof data.count === "number") {
          setCount(data.count);
        }
      }
    } catch {
      // Keep optimistic count if network fails
    }
  }, []);

  return {
    count,
    formattedCount: count.toLocaleString(),
    incrementCount,
    isLoading,
    isDev: IS_DEV,
  };
}
