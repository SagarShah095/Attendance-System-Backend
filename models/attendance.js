const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },

    punchIn: {
      type: Date,
    },

    lunchIn: {
      type: Date,
    },

    lunchOut: {
      type: Date,
    },

    punchOut: {
      type: Date,
    },

    workMinutes: {
      type: Number,
      default: 0,
    },

    breakMinutes: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["absent", "present", "half-day"],
      default: "absent",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
