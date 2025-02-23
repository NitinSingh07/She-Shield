// backend/controllers/trainingController.js
const Training = require("../models/Training");

// Get all trainings
exports.getAllTrainings = async (req, res) => {
  try {
    const trainings = await Training.find();
    res.json(trainings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single training
exports.getTrainingById = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ message: "Training not found" });
    }
    res.json(training);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create training
exports.createTraining = async (req, res) => {
  try {
    const training = new Training({
      ...req.body,
      createdBy: req.user._id,
    });
    const newTraining = await training.save();
    res.status(201).json(newTraining);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update training
exports.updateTraining = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ message: "Training not found" });
    }

    Object.assign(training, req.body);
    const updatedTraining = await training.save();
    res.json(updatedTraining);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete training
exports.deleteTraining = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ message: "Training not found" });
    }

    await training.remove();
    res.json({ message: "Training deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
