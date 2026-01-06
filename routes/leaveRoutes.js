const express = require("express");
const router = express.Router();
const {
  applyLeave,
  getLeaves,
  manageLeaveStatus,
} = require("../controllers/leaveController");
const protect = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");

router.post("/apply", protect, applyLeave);
router.get("/", protect, getLeaves);
router.put("/:id/action", protect, isAdmin, manageLeaveStatus);

module.exports = router;
