import { useState, useEffect, useRef, useCallback } from "react";

const getNextType = (completedFocus) =>
  completedFocus > 0 && completedFocus % 4 === 0 ? "long_break" : "short_break";

export function useTimer(onSessionEnd, focusMins = 25, breakMins = 5) {
  const durations = {
    focus:       focusMins * 60,
    short_break: breakMins * 60,
    long_break:  breakMins * 3 * 60, // long break = 3× short break
  };

  const [type, setType]                   = useState("focus");
  const [timeLeft, setTimeLeft]           = useState(durations.focus);
  const [running, setRunning]             = useState(false);
  const [completedFocus, setCompletedFocus] = useState(0);

  const startedAtRef    = useRef(null);
  const onSessionEndRef = useRef(onSessionEnd);
  const durationsRef    = useRef(durations);

  useEffect(() => { onSessionEndRef.current = onSessionEnd; }, [onSessionEnd]);

  // Keep durations ref fresh; also reset timeLeft when idle and durations change
  useEffect(() => {
    durationsRef.current = durations;
    if (!running) setTimeLeft(durations[type]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusMins, breakMins]);

  // ── Tick ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  // ── Natural completion ─────────────────────────────────────────
  useEffect(() => {
    if (timeLeft !== 0 || !running) return;
    setRunning(false);
    const d = durationsRef.current;
    if (type === "focus") setCompletedFocus((c) => c + 1);
    onSessionEndRef.current({
      type,
      plannedDuration: d[type],
      actualDuration:  d[type],
      completed: true,
      startedAt: startedAtRef.current,
      endedAt:   new Date(),
    });
  }, [timeLeft, running, type]);

  // ── Tab title ─────────────────────────────────────────────────
  useEffect(() => {
    const label = type === "focus" ? "Focus 🍅" : type === "short_break" ? "Break ☕" : "Long Break 🌿";
    document.title = running ? `${formatTime(timeLeft)} — ${label}` : "Pomodoro";
    return () => { document.title = "Pomodoro"; };
  }, [timeLeft, running, type]);

  const start = useCallback(() => {
    startedAtRef.current = new Date();
    setRunning(true);
  }, []);

  const stop = useCallback(() => {
    if (!running) return;
    setRunning(false);
    const d = durationsRef.current;
    onSessionEndRef.current({
      type,
      plannedDuration: d[type],
      actualDuration:  d[type] - timeLeft,
      completed: false,
      startedAt: startedAtRef.current,
      endedAt:   new Date(),
    });
  }, [running, type, timeLeft]);

  const nextCycle = useCallback(() => {
    const next = type === "focus" ? getNextType(completedFocus) : "focus";
    setType(next);
    setTimeLeft(durationsRef.current[next]);
    setRunning(false);
  }, [type, completedFocus]);

  const reset = useCallback(() => {
    setType("focus");
    setTimeLeft(durationsRef.current.focus);
    setRunning(false);
    setCompletedFocus(0);
  }, []);

  return {
    type, timeLeft, running, completedFocus,
    totalDuration: durations[type],
    start, stop, nextCycle, reset,
  };
}

export function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}
