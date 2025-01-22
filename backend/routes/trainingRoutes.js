// backend/routes/trainingRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllTrainings,
  createTraining,
  getTrainingById,
  updateTraining,
  deleteTraining,
} = require("../controllers/trainingController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllTrainings);
router.get("/:id", getTrainingById);

// Protected routes
router.post("/", protect, createTraining);
router.put("/:id", protect, updateTraining);
router.delete("/:id", protect, deleteTraining);

module.exports = router;
