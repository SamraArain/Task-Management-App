const express = require("express");
const { adminOnly, protect } = require("../middleware/authMiddleware");
const { getUsers, getUserById, deleteUser } = require("../controllers/userController"); // ✅ FIXED

const router = express.Router();

// User management routes
router.get("/", protect, adminOnly, getUsers);       // Get all users
router.get("/:id", protect, getUserById);            // Get user by ID


module.exports = router;
