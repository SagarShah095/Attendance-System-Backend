const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getAllEmployees,
  getMe,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/authController");
const protect = require("../middlewares/authMiddleware");

router.use(express.json());

router.post("/register", register);
router.post("/login", login);
router.get("/get-employee", protect, getAllEmployees);
router.get("/me", protect, getMe);
router.put("/update-employee/:id", protect, updateEmployee);
router.delete("/delete-employee/:id", protect, deleteEmployee);

module.exports = router;
