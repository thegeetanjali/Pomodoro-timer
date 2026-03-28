import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";
import Navbar from "../components/layout/Navbar";

const DAILY_GOAL = 8;

function StatCard({ label, value, sub, color = "text-rose-500" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm p-5 text-center"
    >
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-sm font-medium text-gray-700 mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg px-4 py-3 text-sm border border-gray-100">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-rose-500">{payload[0]?.value} sessions</p>
    </div>
  );
}

// ── Read + compute stats from localStorage ───────────────────────
function useLocalStats() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem("pomodoro_sessions") || "[]");
    setSessions(raw);
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];

  const todaySessions = sessions.filter(
    (s) => s.type === "focus" && new Date(s.startedAt).toISOString().split("T")[0] === todayStr
  );
  const todayCompleted  = todaySessions.filter((s) => s.completed).length;
  const todayMinutes    = Math.round(todaySessions.reduce((a, s) => a + s.actualDuration, 0) / 60);
  const goalProgress    = Math.min(100, Math.round((todayCompleted / DAILY_GOAL) * 100));

  // 7-day chart
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    const daySessions = sessions.filter(
      (s) => s.type === "focus" && new Date(s.startedAt).toISOString().split("T")[0] === key
    );
    return {
      day: d.toLocaleDateString("en", { weekday: "short" }),
      sessions: daySessions.length,
    };
  });

  const allFocus     = sessions.filter((s) => s.type === "focus");
  const allCompleted = allFocus.filter((s) => s.completed).length;
  const allHours     = Math.round(allFocus.reduce((a, s) => a + s.actualDuration, 0) / 3600);

  return {
    todaySessions, todayCompleted, todayMinutes, goalProgress,
    chartData,
    lifetime: { sessions: allFocus.length, completed: allCompleted, focusHours: allHours },
    recent: sessions.slice(0, 10),
  };
}

export default function DashboardPage() {
  const { todaySessions, todayCompleted, todayMinutes, goalProgress,
          chartData, lifetime, recent } = useLocalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pb-10 space-y-6">
        <div className="pt-2">
          <h2 className="text-xl font-bold text-gray-800">Your Dashboard</h2>
          <p className="text-sm text-gray-400">Daily goal: {DAILY_GOAL} pomodoros</p>
        </div>

        {/* Today stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Today"      value={todaySessions.length} sub="sessions" />
          <StatCard label="Goal"       value={`${goalProgress}%`}   sub={`${todayCompleted}/${DAILY_GOAL}`} color="text-orange-500" />
          <StatCard label="Focus Time" value={`${todayMinutes}m`}   sub="today"    color="text-emerald-500" />
        </div>

        {/* Goal progress bar */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Daily Goal Progress</span>
            <span className="text-rose-500 font-semibold">{goalProgress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${goalProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-rose-400 h-3 rounded-full"
            />
          </div>
        </div>

        {/* Weekly chart */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barGap={4}>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#fef2f2" }} />
              <Bar dataKey="sessions" radius={[6, 6, 0, 0]} maxBarSize={32}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={i === 6 ? "#f43f5e" : "#fca5a5"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lifetime stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="All Sessions" value={lifetime.sessions}              color="text-gray-700" />
          <StatCard label="Completed"    value={lifetime.completed}             color="text-rose-500" />
          <StatCard label="Focus Hours"  value={`${lifetime.focusHours}h`}      color="text-blue-500" />
        </div>

        {/* Recent sessions */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Sessions</h3>
          {recent.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No sessions yet — start your first! 🍅</p>
          ) : (
            <ul className="space-y-2">
              {recent.map((s) => (
                <li key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{s.completed ? "✅" : "⏹️"}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-700 truncate max-w-[180px]">{s.task}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(s.startedAt).toLocaleDateString("en", {
                          month: "short", day: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {Math.round(s.actualDuration / 60)} min
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
