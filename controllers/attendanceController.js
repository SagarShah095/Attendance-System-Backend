const Attendance = require("../models/attendance");

exports.punch = async (req, res) => {
  const employeeId = req.user.id; // from auth middleware
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let attendance = await Attendance.findOne({
    employee: employeeId,
    date: today,
  });

  if (!attendance) {
    attendance = new Attendance({
      employee: employeeId,
      date: today,
    });
  }

  const now = new Date();
  const { type } = req.body;

  switch (type) {
    case "punchIn":
      if (attendance.punchIn)
        return res.status(400).json({ message: "Already punched in" });

      attendance.punchIn = now;
      attendance.status = "present";
      break;

    case "lunchIn":
      if (!attendance.punchIn || attendance.lunchIn)
        return res.status(400).json({ message: "Invalid lunch in" });

      attendance.lunchIn = now;
      break;

    case "lunchOut":
      if (!attendance.lunchIn || attendance.lunchOut)
        return res.status(400).json({ message: "Invalid lunch out" });

      attendance.lunchOut = now;
      attendance.breakMinutes =
        (attendance.lunchOut - attendance.lunchIn) / 60000;
      break;

    case "punchOut":
      if (!attendance.punchIn || attendance.punchOut)
        return res.status(400).json({ message: "Invalid punch out" });

      attendance.punchOut = now;

      const totalMinutes = (attendance.punchOut - attendance.punchIn) / 60000;

      attendance.workMinutes = totalMinutes - attendance.breakMinutes;

      break;

    default:
      return res.status(400).json({ message: "Invalid punch type" });
  }

  await attendance.save();
  res.json({ message: "Punch recorded", attendance });
};

exports.getTodayAttendance = async (req, res) => {
  const employeeId = req.user.id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await Attendance.findOne({
    employee: employeeId,
    date: today,
  });

  if (!attendance) {
    return res.json({ message: "No attendance found", attendance: null });
  }

  res.json({ attendance });
};

exports.updateAttendance = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const attendance = await Attendance.findByIdAndUpdate(id, updates, {
    new: true,
  });

  if (!attendance)
    return res.status(404).json({ message: "Attendance not found" });

  res.json({ message: "Attendance updated", attendance });
};

exports.getAllAttendanceWithUsers = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let filter = {};

    // Optional date filter
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(filter)
      .populate({
        path: "employee",
        select: "name email role department employeeCode", // adjust to your Auth schema
      })
      .sort({ date: -1 });

    res.json({
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteAttendance = async (req, res) => {
  const { id } = req.params;

  const attendance = await Attendance.findByIdAndDelete(id);

  if (!attendance)
    return res.status(404).json({ message: "Attendance not found" });

  res.json({ message: "Attendance deleted" });
};
