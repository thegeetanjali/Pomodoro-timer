const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    task: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "Focus session",
    },
    type: {
      type: String,
      enum: ["focus", "short_break", "long_break"],
      default: "focus",
    },
    plannedDuration: {
      type: Number, // seconds
      required: true,
    },
    actualDuration: {
      type: Number, // seconds — how long user actually ran
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    endedAt: {
      type: Date,
      required: true,
    },
    pomodoroNumber: {
      type: Number, // which pomodoro in today's sequence
      default: 1,
    },
  },
  { timestamps: true }
);

// Compound index for fast per-user date-range queries
sessionSchema.index({ user: 1, startedAt: -1 });

module.exports = mongoose.model("Session", sessionSchema);
