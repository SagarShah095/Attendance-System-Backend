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
const checkPermission = require("../middlewares/checkPermission");

router.use(express.json());

router.post("/register", protect, checkPermission('createEmployee'), register);
router.post("/login", login);
router.get("/get-employee", protect, getAllEmployees);
router.get("/me", protect, getMe);
router.put("/update-employee/:id", protect, checkPermission('editEmployee'), updateEmployee);
router.delete("/delete-employee/:id", protect, checkPermission('deleteEmployee'), deleteEmployee);

module.exports = router;
