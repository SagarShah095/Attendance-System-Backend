const express = require("express");
const router = express.Router();
const {
  addDept,
  getAllDept,
  updateDept,
  deleteDept,
} = require("../controllers/departmentController");

router.post("/add", addDept);
router.get("/", getAllDept);
router.put("/:id", updateDept);
router.delete("/:id", deleteDept);

module.exports = router;
