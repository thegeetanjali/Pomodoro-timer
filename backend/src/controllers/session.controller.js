const Session = require("../models/Session.model");

// ── POST /api/sessions ──────────────────────────────────────────
const createSession = async (req, res, next) => {
  try {
    const { task, type, plannedDuration, actualDuration, completed, startedAt, endedAt } = req.body;

    // Count today's focus sessions to assign pomodoroNumber
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCount = await Session.countDocuments({
      user: req.user._id,
      type: "focus",
      startedAt: { $gte: todayStart },
    });

    const session = await Session.create({
      user: req.user._id,
      task,
      type: type || "focus",
      plannedDuration,
      actualDuration,
      completed,
      startedAt,
      endedAt,
      pomodoroNumber: todayCount + 1,
    });

    res.status(201).json({ session });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/sessions ───────────────────────────────────────────
const getSessions = async (req, res, next) => {
  try {
    const { limit = 20, page = 1, from, to } = req.query;
    const filter = { user: req.user._id };

    if (from || to) {
      filter.startedAt = {};
      if (from) filter.startedAt.$gte = new Date(from);
      if (to) filter.startedAt.$lte = new Date(to);
    }

    const [sessions, total] = await Promise.all([
      Session.find(filter)
        .sort({ startedAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Session.countDocuments(filter),
    ]);

    res.json({ sessions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/sessions/:id ────────────────────────────────────
const deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json({ message: "Session deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { createSession, getSessions, deleteSession };
