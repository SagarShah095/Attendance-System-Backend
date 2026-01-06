const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
