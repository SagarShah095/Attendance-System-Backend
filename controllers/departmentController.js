const Department = require("../models/department");

exports.addDept = async (req, res) => {
  const { department, description } = req.body;

  try {
    if (!department || !description) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const dept = await Department.create({
      department,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Department Created Successfully",
      dept,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllDept = async (req, res) => {
  try {
    const departments = await Department.find();

    res.status(200).json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDept = async (req, res) => {
  const { department, description } = req.body;

  try {
    const dept = await Department.findByIdAndUpdate(
      req.params.id,
      { department, description },
      { new: true, runValidators: true }
    );

    if (!dept) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      dept,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDept = async (req, res) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);

    if (!dept) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
