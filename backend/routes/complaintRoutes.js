// backend/routes/complaintRoutes.js
const express = require("express");
const {
  createComplaint,
  getComplaints,
} = require("../controllers/complaintController");
const { protect } = require("../middleware/authMiddleware"); // Import the protect middleware specifically
const router = express.Router();

router.post("/", protect, createComplaint); // Use the protect middleware
router.get("/", getComplaints); // Optionally, you can protect this too

module.exports = router;
