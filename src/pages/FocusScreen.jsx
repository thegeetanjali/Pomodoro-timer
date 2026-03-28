import { useState, useEffect, useRef, useCallback } from "react";
import Card from "../components/Card";

const DURATION = 25 * 60; // 1500 seconds
const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Zero-padded MM:SS formatter */
function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function FocusScreen({ onStop }) {
  const [timeLeft, setTimeLeft] = useState(DURATION);
  // Track whether the timer finished naturally (vs user clicking Stop)
  const finishedNaturally = useRef(false);

  // Stable reference to onStop so the interval closure doesn't go stale
  const onStopRef = useRef(onStop);
  useEffect(() => { onStopRef.current = onStop; }, [onStop]);

  // ── Countdown tick ──────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          finishedNaturally.current = true;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Navigate to End screen when timer hits 0 ────────────────────
  useEffect(() => {
    if (timeLeft === 0) onStopRef.current(true);
  }, [timeLeft]);

  // ── Browser tab title ───────────────────────────────────────────
  useEffect(() => {
    document.title = `${formatTime(timeLeft)} — Focus 🍅`;
    return () => { document.title = "Pomodoro"; };
  }, [timeLeft]);

  // ── User clicks Stop ────────────────────────────────────────────
  const handleStop = useCallback(() => {
    onStop(false);
  }, [onStop]);

  // SVG ring progress (0 → full as time elapses)
  const elapsed = DURATION - timeLeft;
  const strokeOffset = CIRCUMFERENCE * (1 - elapsed / DURATION);

  return (
    <Card>
      <div className="text-sm font-semibold text-rose-400 uppercase tracking-widest mb-7">
        Focus Session
      </div>

      {/* ── Circular progress ring ── */}
      <div className="relative w-44 h-44 mx-auto mb-7">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx="50" cy="50" r={RADIUS}
            fill="none"
            stroke="#fce7e7"
            strokeWidth="7"
          />
          {/* Progress */}
          <circle
            cx="50" cy="50" r={RADIUS}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeOffset}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>

        {/* Time label centred inside ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-3xl font-bold text-gray-800 tabular-nums"
            aria-live="polite"
            aria-label={`${Math.floor(timeLeft / 60)} minutes ${timeLeft % 60} seconds remaining`}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-9">Stay focused...</p>

      <button
        onClick={handleStop}
        className="w-full border-2 border-rose-300 hover:bg-rose-50 active:scale-95 transition-all duration-150 text-rose-500 font-semibold py-3 rounded-2xl text-base"
      >
        Stop
      </button>
    </Card>
  );
}
