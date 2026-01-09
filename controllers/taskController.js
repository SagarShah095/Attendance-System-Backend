const Task = require("../models/task");
const User = require("../models/auth");

exports.assignTask = async (req, res) => {
  const { title, description, assignedTo, dueDate } = req.body;

  try {
    // Validate
    if (!title || !assignedTo) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields missing" });
    }

    // Check employee exists
    const employee = await User.findById(assignedTo);
    if (!employee || employee.role !== "employee") {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      assignedBy: req.user.id, // admin
      assignedTo,
      dueDate,
    });

    // 🔥 SOCKET EMIT
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    const socketId = onlineUsers[assignedTo];
    if (socketId) {
      io.to(socketId).emit("newTaskAssigned", {
        message: "New task assigned",
        task,
      });
    }

    res.status(201).json({
      success: true,
      message: "Task assigned successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email department")
      .populate("assignedBy", "name");

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate("assignedBy", "name email");

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * EMPLOYEE → Update own task status
 */
exports.updateMyTaskStatus = async (req, res) => {
  const { status } = req.body;

  try {
    // Validate status
    if (!["pending", "working", "completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      assignedTo: req.user.id, // employee owns task
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or not authorized",
      });
    }

    task.status = status;
    await task.save();

    // 🔥 SOCKET: Notify Admin (optional)
    const io = req.app.get("io");
    io.emit("taskStatusUpdated", {
      taskId: task._id,
      status,
      employee: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: "Task status updated",
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

