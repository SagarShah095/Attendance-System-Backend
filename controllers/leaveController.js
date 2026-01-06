const Leave = require("../models/leave");

exports.applyLeave = async (req, res) => {
  const { leaveType, startDate, endDate, reason } = req.body;

  try {
    if (!leaveType || !startDate || !endDate || !reason) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const leave = await Leave.create({
      employee: req.user.id, // from auth middleware
      leaveType,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLeaves = async (req, res) => {
  try {
    let filter = {};

    // Admin → see all leaves
    // Employee → see only own leaves
    if (req.user.role !== "admin") {
      filter.employee = req.user.id;
    }

    const leaves = await Leave.find(filter)
      .populate("employee", "name email department");

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.manageLeaveStatus = async (req, res) => {
  const { action } = req.body; // approved or rejected

  try {
    // Validate action
    if (!["approved", "rejected"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be 'approved' or 'rejected'",
      });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });
    }

    // Prevent re-processing
    if (leave.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Leave already ${leave.status}`,
      });
    }

    // Update leave
    leave.status = action;
    leave.approvedBy = req.user.id;
    leave.approvedAt = new Date();

    await leave.save();

    res.status(200).json({
      success: true,
      message: `Leave ${action} successfully`,
      leave,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

