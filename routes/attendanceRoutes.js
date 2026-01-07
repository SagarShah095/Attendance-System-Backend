const express = require("express");
const router = express.Router();
const { punch, getTodayAttendance, updateAttendance, deleteAttendance, getAllAttendanceWithUsers } = require("../controllers/attendanceController");
const protect = require("../middlewares/authMiddleware");

router.use(express.json());

router.post("/punch", protect, punch);
router.get("/today", protect, getTodayAttendance);
router.get("/all", protect, getAllAttendanceWithUsers);
router.put("/:id", protect, updateAttendance);
router.delete("/:id", protect, deleteAttendance);

module.exports = router;
