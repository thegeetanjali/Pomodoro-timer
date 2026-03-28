const Session = require("../models/Session.model");

// ── GET /api/analytics/summary ──────────────────────────────────
// Returns today's stats + weekly chart data
const getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // Today boundaries
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // 7-day window
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 6);

    // ── Today stats ─────────────────────────────────────────────
    const todayStats = await Session.aggregate([
      {
        $match: {
          user: userId,
          type: "focus",
          startedAt: { $gte: todayStart, $lte: todayEnd },
        },
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          completedSessions: { $sum: { $cond: ["$completed", 1, 0] } },
          totalFocusMinutes: { $sum: { $divide: ["$actualDuration", 60] } },
        },
      },
    ]);

    // ── Weekly chart (sessions per day) ─────────────────────────
    const weeklyData = await Session.aggregate([
      {
        $match: {
          user: userId,
          type: "focus",
          startedAt: { $gte: weekStart, $lte: todayEnd },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$startedAt" },
          },
          sessions: { $sum: 1 },
          completed: { $sum: { $cond: ["$completed", 1, 0] } },
          focusMinutes: { $sum: { $divide: ["$actualDuration", 60] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ── All-time totals ──────────────────────────────────────────
    const allTime = await Session.aggregate([
      { $match: { user: userId, type: "focus" } },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          completedSessions: { $sum: { $cond: ["$completed", 1, 0] } },
          totalFocusMinutes: { $sum: { $divide: ["$actualDuration", 60] } },
          currentStreak: { $sum: 0 }, // calculated below
        },
      },
    ]);

    const today = todayStats[0] || { totalSessions: 0, completedSessions: 0, totalFocusMinutes: 0 };
    const lifetime = allTime[0] || { totalSessions: 0, completedSessions: 0, totalFocusMinutes: 0 };

    res.json({
      today: {
        sessions: today.totalSessions,
        completed: today.completedSessions,
        focusMinutes: Math.round(today.totalFocusMinutes),
        goalProgress: Math.min(100, Math.round((today.completedSessions / req.user.dailyGoal) * 100)),
      },
      weekly: weeklyData.map((d) => ({
        date: d._id,
        sessions: d.sessions,
        completed: d.completed,
        focusMinutes: Math.round(d.focusMinutes),
      })),
      lifetime: {
        sessions: lifetime.totalSessions,
        completed: lifetime.completedSessions,
        focusHours: Math.round(lifetime.totalFocusMinutes / 60),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary };
