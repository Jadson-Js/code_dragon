import React, { createContext, useState } from "react";

export interface TimerContextType {
  timer: number;
  toggleTimer: (value: number) => void;
}

export const TimerContext = createContext<TimerContextType>({
  timer: 0,
  toggleTimer: () => {},
});

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [timer, setTimer] = useState<number>(0);

  const toggleTimer = (value: number) => {
    setTimer(value);
  };

  return <TimerContext value={{ timer, toggleTimer }}>{children}</TimerContext>;
}
