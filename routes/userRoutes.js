const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const { getMe } = require("../controllers/userController");

// GET logged-in user info
router.get("/me", protect, getMe);

module.exports = router;
