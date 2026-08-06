import { useState, useEffect, useCallback } from "react";

// Initial starting count for Voidslate
const BASE_COUNT = 0;

// Environment check for separate development vs production key
const IS_DEV = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

// API Namespace and Key (Dev vs Prod)
const API_NAMESPACE = "voidslate_v1";
const API_KEY = IS_DEV ? "thoughts_purged_dev" : "thoughts_purged_prod";

const GET_URL = `https://api.countapi.xyz/get/${API_NAMESPACE}/${API_KEY}`;
const HIT_URL = `https://api.countapi.xyz/hit/${API_NAMESPACE}/${API_KEY}`;
const CREATE_URL = `https://api.countapi.xyz/create?namespace=${API_NAMESPACE}&key=${API_KEY}&value=${BASE_COUNT}`;

export function useGlobalCounter() {
  const [count, setCount] = useState<number>(BASE_COUNT);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch the latest count from the API
  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch(GET_URL);
      if (res.ok) {
        const data = await res.json();
        if (typeof data.value === "number") {
          setCount(data.value);
        }
      } else if (res.status === 404) {
        // Initialize the counter key if it doesn't exist yet
        const createRes = await fetch(CREATE_URL);
        if (createRes.ok) {
          const createData = await createRes.json();
          if (typeof createData.value === "number") {
            setCount(createData.value);
          }
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
        if (typeof data.value === "number") {
          setCount(data.value);
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
