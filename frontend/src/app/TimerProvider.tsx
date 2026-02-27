import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

export interface TimerContextType {
  timer: number;
  startTimer: (seconds: number) => void;
}

export const TimerContext = createContext<TimerContextType>({
  timer: 0,
  startTimer: () => {},
});

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [timer, setTimer] = useState<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback((seconds: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setTimer(seconds);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <TimerContext.Provider value={{ timer, startTimer }}>
      {children}
    </TimerContext.Provider>
  );
}
