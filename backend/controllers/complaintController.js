// backend/controllers/complaintController.js
const Complaint = require("../models/Complaint");

exports.createComplaint = async (req, res) => {
  const { description } = req.body;

  // Example validation
  if (!description) {
    return res.status(400).json({ message: "Description is required." });
  }

  // Ensure req.user is populated correctly
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  const complaint = new Complaint({
    userId: req.user.id, // Set userId from req.user
    description,
  });

  try {
    await complaint.save();
    res
      .status(201)
      .json({ message: "Complaint created successfully", complaint });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Server error" });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
