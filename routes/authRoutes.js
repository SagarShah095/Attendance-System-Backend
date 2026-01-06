const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getAllEmployees,
  getMe,
} = require("../controllers/authController");
const protect = require("../middlewares/authMiddleware");

router.use(express.json());

router.post("/register", register);
router.post("/login", login);
router.get("/get-employee", getAllEmployees);
router.get("/me", protect, getMe);

module.exports = router;
