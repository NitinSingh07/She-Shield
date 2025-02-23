// backend/models/Training.js
const mongoose = require("mongoose");

const TrainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

module.exports = mongoose.model("training", TrainingSchema);
