// backend/routes/complaintRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createComplaint,
  getComplaints,
  updateComplaint,
  deleteComplaint,
  getAllComplaints,  // Add this new controller
  upload,
} = require("../controllers/complaintController");

// Public route for getting all complaints
router.get("/all", getAllComplaints);

// Protected routes
router.post("/", protect, upload.single("photo"), createComplaint);
router.get("/", protect, getComplaints);
router.put("/:id", protect, upload.single("photo"), updateComplaint);
router.delete("/:id", protect, deleteComplaint);

module.exports = router;
