import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderHook, act } from "@testing-library/react";
import { useTimer, formatTime } from "./hooks/useTimer";

// ── formatTime unit tests ────────────────────────────────────────
describe("formatTime()", () => {
  it("formats 0 as 00:00", () => expect(formatTime(0)).toBe("00:00"));
  it("formats 90 as 01:30", () => expect(formatTime(90)).toBe("01:30"));
  it("formats 1500 as 25:00", () => expect(formatTime(1500)).toBe("25:00"));
  it("formats 300 as 05:00", () => expect(formatTime(300)).toBe("05:00"));
});

// ── useTimer hook tests ──────────────────────────────────────────
describe("useTimer hook", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("initialises with focus type and 25:00", () => {
    const { result } = renderHook(() => useTimer(jest.fn()));
    expect(result.current.type).toBe("focus");
    expect(result.current.timeLeft).toBe(1500);
    expect(result.current.running).toBe(false);
  });

  it("starts counting down after start()", () => {
    const { result } = renderHook(() => useTimer(jest.fn()));
    act(() => { result.current.start(); });
    act(() => { jest.advanceTimersByTime(3000); });
    expect(result.current.timeLeft).toBe(1497);
    expect(result.current.running).toBe(true);
  });

  it("calls onSessionEnd with completed=false when stop() is called", () => {
    const onEnd = jest.fn();
    const { result } = renderHook(() => useTimer(onEnd));
    act(() => { result.current.start(); });
    act(() => { jest.advanceTimersByTime(5000); });
    act(() => { result.current.stop(); });
    expect(onEnd).toHaveBeenCalledWith(
      expect.objectContaining({ completed: false, type: "focus" })
    );
  });

  it("resets to initial state after reset()", () => {
    const { result } = renderHook(() => useTimer(jest.fn()));
    act(() => { result.current.start(); });
    act(() => { jest.advanceTimersByTime(10000); });
    act(() => { result.current.reset(); });
    expect(result.current.timeLeft).toBe(1500);
    expect(result.current.running).toBe(false);
    expect(result.current.completedFocus).toBe(0);
  });

  it("switches to short_break after nextCycle() from focus", () => {
    const { result } = renderHook(() => useTimer(jest.fn()));
    act(() => { result.current.nextCycle(); });
    expect(result.current.type).toBe("short_break");
    expect(result.current.timeLeft).toBe(300);
  });
});
