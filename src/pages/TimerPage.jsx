import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Card from "../components/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useTimer, formatTime } from "../hooks/useTimer";

const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const TYPE_LABELS = {
  focus:       { label: "Focus",       color: "text-rose-400",    ring: "#f43f5e", track: "#fce7e7" },
  short_break: { label: "Short Break", color: "text-emerald-400", ring: "#10b981", track: "#d1fae5" },
  long_break:  { label: "Long Break",  color: "text-blue-400",    ring: "#3b82f6", track: "#dbeafe" },
};

const SCREEN = { IDLE: "idle", RUNNING: "running", END: "end" };

const FOCUS_PRESETS = [15, 25, 45];
const BREAK_PRESETS = [5, 10, 15];

function saveSession(session) {
  const existing = JSON.parse(localStorage.getItem("pomodoro_sessions") || "[]");
  existing.unshift({ ...session, id: Date.now() });
  localStorage.setItem("pomodoro_sessions", JSON.stringify(existing.slice(0, 100)));
}

// ── Small preset pill button ──────────────────────────────────────
function Preset({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 border
        ${active
          ? "bg-rose-500 text-white border-rose-500 shadow-sm"
          : "bg-white text-gray-500 border-gray-200 hover:border-rose-300 hover:text-rose-500"
        }`}
    >
      {label}
    </button>
  );
}

export default function TimerPage() {
  const [screen, setScreen]           = useState(SCREEN.IDLE);
  const [task, setTask]               = useState("");
  const [lastSession, setLastSession] = useState(null);

  // Custom duration state (minutes)
  const [focusMins, setFocusMins] = useState(25);
  const [breakMins, setBreakMins] = useState(5);

  const handleSessionEnd = useCallback((sessionData) => {
    const full = { ...sessionData, task: task || "Focus session" };
    setLastSession(full);
    setScreen(SCREEN.END);
    saveSession(full);
    if (sessionData.completed) toast.success("Session complete! 🎉");
  }, [task]);

  const { type, timeLeft, completedFocus, totalDuration, start, stop, nextCycle, reset } =
    useTimer(handleSessionEnd, focusMins, breakMins);

  const { label, color, ring, track } = TYPE_LABELS[type];
  const elapsed      = totalDuration - timeLeft;
  const strokeOffset = CIRCUMFERENCE * (1 - elapsed / totalDuration);

  const handleStart   = () => { start(); setScreen(SCREEN.RUNNING); };
  const handleStop    = () => stop();
  const handleRestart = () => { reset(); setTask(""); setScreen(SCREEN.IDLE); };
  const handleNext    = () => { nextCycle(); setScreen(SCREEN.IDLE); };

  // Clamp custom input values
  const onFocusInput = (v) => {
    const n = Math.min(90, Math.max(1, Number(v) || 1));
    setFocusMins(n);
  };
  const onBreakInput = (v) => {
    const n = Math.min(30, Math.max(1, Number(v) || 1));
    setBreakMins(n);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">

          {/* ── IDLE ── */}
          {screen === SCREEN.IDLE && (
            <Card key="idle" className="max-w-sm">
              {/* Cycle dots */}
              <div className="flex justify-center gap-1.5 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i < completedFocus % 4 ? "bg-rose-400" : "bg-gray-200"
                  }`} />
                ))}
              </div>

              <div className="text-5xl mb-4">🍅</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {type === "focus" ? "Ready to focus?" : label}
              </h1>
              <p className="text-gray-400 text-sm mb-6">
                {focusMins}-minute {type === "focus" ? "session" : "break"}
              </p>

              {type === "focus" && (
                <div className="space-y-5 text-left mb-6">
                  {/* Task input */}
                  <Input
                    label="What are you working on?"
                    placeholder="e.g. Write unit tests..."
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleStart()}
                  />

                  {/* ── Focus duration ── */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Focus Duration
                    </p>
                    {/* Presets */}
                    <div className="flex gap-2 mb-2">
                      {FOCUS_PRESETS.map((m) => (
                        <Preset
                          key={m}
                          label={`${m} min`}
                          active={focusMins === m}
                          onClick={() => setFocusMins(m)}
                        />
                      ))}
                      {/* Custom badge when not a preset */}
                      {!FOCUS_PRESETS.includes(focusMins) && (
                        <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-500 text-white border border-rose-500">
                          {focusMins} min
                        </span>
                      )}
                    </div>
                    {/* Custom input */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 shrink-0">Custom:</span>
                      <input
                        type="number"
                        min={1}
                        max={90}
                        value={focusMins}
                        onChange={(e) => onFocusInput(e.target.value)}
                        className="w-16 px-2 py-1 text-sm text-center rounded-lg border border-gray-200 bg-gray-50
                          focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400"
                      />
                      <span className="text-xs text-gray-400">min (1–90)</span>
                    </div>
                  </div>

                  {/* ── Break duration ── */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Break Duration
                    </p>
                    {/* Presets */}
                    <div className="flex gap-2 mb-2">
                      {BREAK_PRESETS.map((m) => (
                        <Preset
                          key={m}
                          label={`${m} min`}
                          active={breakMins === m}
                          onClick={() => setBreakMins(m)}
                        />
                      ))}
                      {!BREAK_PRESETS.includes(breakMins) && (
                        <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-500 text-white border border-rose-500">
                          {breakMins} min
                        </span>
                      )}
                    </div>
                    {/* Custom input */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 shrink-0">Custom:</span>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={breakMins}
                        onChange={(e) => onBreakInput(e.target.value)}
                        className="w-16 px-2 py-1 text-sm text-center rounded-lg border border-gray-200 bg-gray-50
                          focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400"
                      />
                      <span className="text-xs text-gray-400">min (1–30)</span>
                    </div>
                  </div>
                </div>
              )}

              <Button onClick={handleStart}>Start {label}</Button>

              {completedFocus > 0 && (
                <p className="text-xs text-gray-400 mt-4">
                  {completedFocus} pomodoro{completedFocus !== 1 ? "s" : ""} completed today
                </p>
              )}
            </Card>
          )}

          {/* ── RUNNING ── */}
          {screen === SCREEN.RUNNING && (
            <Card key="running" className="max-w-sm">
              <div className={`text-sm font-semibold uppercase tracking-widest mb-6 ${color}`}>
                {label}
              </div>

              {task && type === "focus" && (
                <p className="text-gray-600 text-sm font-medium mb-4 truncate px-2">📌 {task}</p>
              )}

              <div className="relative w-44 h-44 mx-auto mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="50" r={RADIUS} fill="none" stroke={track} strokeWidth="7" />
                  <circle
                    cx="50" cy="50" r={RADIUS} fill="none"
                    stroke={ring} strokeWidth="7" strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeOffset}
                    className="transition-[stroke-dashoffset] duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-800 tabular-nums" aria-live="polite">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-8">
                {type === "focus" ? "Stay focused..." : "Take a breather 😌"}
              </p>

              <Button variant="outline" onClick={handleStop}>Stop</Button>
            </Card>
          )}

          {/* ── END ── */}
          {screen === SCREEN.END && lastSession && (
            <Card key="end" className="max-w-sm">
              <div className="text-5xl mb-4">{lastSession.completed ? "🎉" : "😢"}</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {lastSession.completed ? "Session Complete!" : "You stopped early"}
              </h1>
              <p className={`text-sm mb-2 ${lastSession.completed ? "text-emerald-400" : "text-gray-400"}`}>
                {lastSession.completed
                  ? "Great work! Take a short break."
                  : `Focused for ${Math.round(lastSession.actualDuration / 60)} min`}
              </p>

              {task && <p className="text-xs text-gray-400 mb-6 truncate">📌 {task}</p>}

              <div className="space-y-3">
                {lastSession.completed && (
                  <Button onClick={handleNext}>
                    {type === "focus" ? "Start Break ☕" : "Next Focus 🍅"}
                  </Button>
                )}
                <Button variant={lastSession.completed ? "outline" : "primary"} onClick={handleRestart}>
                  Restart
                </Button>
              </div>
            </Card>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
