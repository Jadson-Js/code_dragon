import { useState, useEffect } from "react";

export function useCountdown(storageKey: string, durationSeconds = 60) {
  const [countdown, setCountdown] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return 0;

    const remaining = Math.ceil((parseInt(saved) - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  });

  useEffect(() => {
    if (countdown <= 0) {
      localStorage.removeItem(storageKey);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          localStorage.removeItem(storageKey);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, storageKey]);

  const start = () => {
    const expiresAt = Date.now() + durationSeconds * 1000;
    localStorage.setItem(storageKey, expiresAt.toString());
    setCountdown(durationSeconds);
  };

  return { countdown, start, isActive: countdown > 0 };
}
