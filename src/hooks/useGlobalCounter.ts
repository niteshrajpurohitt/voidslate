import { useState, useEffect, useCallback } from "react";

export function useGlobalCounter() {
  const [count, setCount] = useState<number>(() => {
    try {
      const cached = localStorage.getItem("voidslate_cached_count");
      return cached ? parseInt(cached, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch the latest count from our Vercel serverless API
  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch("/api/counter");
      if (res.ok) {
        const data = await res.json();
        if (typeof data.count === "number") {
          setCount(data.count);
          try {
            localStorage.setItem("voidslate_cached_count", String(data.count));
          } catch {}
        }
      }
    } catch {
      // Fallback silently if offline
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On mount and polling every 15 seconds
  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 15000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  // Triggered when user presses EXECUTE
  const incrementCount = useCallback(async () => {
    // 1. Optimistic UI update immediately (+1)
    setCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem("voidslate_cached_count", String(next));
      } catch {}
      return next;
    });

    // 2. POST to API — Redis INCR atomically
    try {
      const res = await fetch("/api/counter", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.count === "number") {
          setCount(data.count);
          try {
            localStorage.setItem("voidslate_cached_count", String(data.count));
          } catch {}
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
  };
}
