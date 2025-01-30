// backend/controllers/complaintController.js
const Complaint = require("../models/Complaint");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

exports.createComplaint = async (req, res) => {
  try {
    const { description } = req.body;
    const photo = req.file ? req.file.filename : null;

    const complaint = new Complaint({
      userId: req.user.id,
      description,
      photo,
    });

    await complaint.save();
    res
      .status(201)
      .json({ message: "Complaint created successfully", complaint });
  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const updateData = {
      description,
    };

    if (req.file) {
      updateData.photo = req.file.filename;

      // Delete old photo if it exists
      const oldComplaint = await Complaint.findById(id);
      if (oldComplaint && oldComplaint.photo) {
        const oldPhotoPath = path.join(uploadDir, oldComplaint.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
    }

    const complaint = await Complaint.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Complaint updated successfully", complaint });
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Delete photo if it exists
    if (complaint.photo) {
      const photoPath = path.join(uploadDir, complaint.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await Complaint.findByIdAndDelete(id);
    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    // Only get complaints for the logged-in user
    const complaints = await Complaint.find({ userId: req.user.id })
      .select("description photo createdAt userId")
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    // console.log('Fetching all complaints...');
    const complaints = await Complaint.find()
      .populate('userId', ['name', 'username', 'email']) // Populate more user fields
      .sort({ createdAt: -1 });
    
    // console.log('Complaints with user details:', complaints); // Debug log
    return res.status(200).json(complaints);
  } catch (error) {
    console.error('Error in getAllComplaints:', error);
    return res.status(500).json({ 
      message: "Failed to fetch complaints",
      error: error.message 
    });
  }
};

exports.upload = upload;
