const express = require("express");
const router = express.Router();
const {
  assignTask,
  getAllTasks,
  updateTask,
  deleteTask,
  getMyTasks,
  updateMyTaskStatus,
} = require("../controllers/taskController");
const protect = require("../middlewares/authMiddleware");

router.post("/assign", protect, assignTask);
router.get("/all", protect, getAllTasks);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.get("/my", protect, getMyTasks);
router.put("/status/:id", protect, updateMyTaskStatus);

module.exports = router;
