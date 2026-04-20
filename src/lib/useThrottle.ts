"use client";

import { useCallback, useRef } from "react";

export function useThrottle(callback: (...args: any[]) => void, delay: number) {
  const lastCall = useRef(0);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  return useCallback((...args: any[]) => {
    const now = Date.now();
    
    // Clear any pending trailing calls
    if (timeoutId.current) {
        clearTimeout(timeoutId.current);
    }

    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    } else {
      // Trailing edge (ensure the last call is always executed)
      timeoutId.current = setTimeout(() => {
        lastCall.current = Date.now();
        callback(...args);
      }, delay - (now - lastCall.current));
    }
  }, [callback, delay]);
}
