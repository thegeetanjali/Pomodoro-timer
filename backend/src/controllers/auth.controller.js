const { validationResult } = require("express-validator");
const User = require("../models/User.model");
const { signToken } = require("../utils/jwt");

// ── POST /api/auth/register ─────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    const token = signToken({ id: user._id });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, dailyGoal: user.dailyGoal },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/login ────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    // Explicitly select password (it's excluded by default)
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken({ id: user._id });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, dailyGoal: user.dailyGoal },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/auth/me ────────────────────────────────────────────
const getMe = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      dailyGoal: req.user.dailyGoal,
    },
  });
};

// ── PATCH /api/auth/me ──────────────────────────────────────────
const updateMe = async (req, res, next) => {
  try {
    const { name, dailyGoal } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, dailyGoal },
      { new: true, runValidators: true }
    );
    res.json({ user: { id: updated._id, name: updated.name, email: updated.email, dailyGoal: updated.dailyGoal } });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, updateMe };
