import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCountdown } from "../useCountdown";

const STORAGE_KEY = "test-countdown-key";

describe("useCountdown", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it("should start with countdown 0 when localStorage is empty", () => {
    const { result } = renderHook(() => useCountdown(STORAGE_KEY, 60));

    expect(result.current.countdown).toBe(0);
    expect(result.current.isActive).toBe(false);
  });

  it("should recover remaining time from localStorage on mount", () => {
    const remaining = 30;
    const expiresAt = Date.now() + remaining * 1000;
    localStorage.setItem(STORAGE_KEY, expiresAt.toString());

    const { result } = renderHook(() => useCountdown(STORAGE_KEY, 60));

    expect(result.current.countdown).toBe(remaining);
    expect(result.current.isActive).toBe(true);
  });

  it("should start with 0 when localStorage entry is already expired", () => {
    const expiredAt = Date.now() - 5000; // expirado há 5s
    localStorage.setItem(STORAGE_KEY, expiredAt.toString());

    const { result } = renderHook(() => useCountdown(STORAGE_KEY, 60));

    expect(result.current.countdown).toBe(0);
    expect(result.current.isActive).toBe(false);
  });

  it("should set countdown and localStorage when start() is called", () => {
    const { result } = renderHook(() => useCountdown(STORAGE_KEY, 60));

    act(() => {
      result.current.start();
    });

    expect(result.current.countdown).toBe(60);
    expect(result.current.isActive).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
  });

  it("should decrement countdown by 1 each second", () => {
    const { result } = renderHook(() => useCountdown(STORAGE_KEY, 5));

    act(() => {
      result.current.start();
    });

    expect(result.current.countdown).toBe(5);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.countdown).toBe(4);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.countdown).toBe(3);
  });

  it("should remove localStorage item and set countdown to 0 when timer expires", () => {
    const { result } = renderHook(() => useCountdown(STORAGE_KEY, 2));

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.countdown).toBe(0);
    expect(result.current.isActive).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("should use default duration of 60 seconds", () => {
    const { result } = renderHook(() => useCountdown(STORAGE_KEY));

    act(() => {
      result.current.start();
    });

    expect(result.current.countdown).toBe(60);
  });

  it("should not set interval when countdown is 0", () => {
    const setIntervalSpy = vi.spyOn(globalThis, "setInterval");
    renderHook(() => useCountdown(STORAGE_KEY, 60));

    // countdown inicial é 0, não deve criar interval
    expect(setIntervalSpy).not.toHaveBeenCalled();
    setIntervalSpy.mockRestore();
  });
});
