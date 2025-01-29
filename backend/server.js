// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv"); // Import dotenv
dotenv.config(); // Load environment variables from .env file

const connectDB = require("./config/db"); // Import the connectDB function
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const trainingRoutes = require("./routes/trainingRoutes");
const forumRoutes = require("./routes/forumRoutes");
const fs = require("fs");
const path = require("path");
const app = express();

const allowedOrigins = [
  "https://she-shield.vercel.app", // Production frontend
  "http://localhost:5173", // Local development frontend
];

app.use(cors());
app.use(express.json());

// Database connection
connectDB(); // Call the connectDB function

// Endpoint to get cyber crimes data by state
app.get("/api/cyber-crimes", (req, res) => {
  const state = req.query.state;
  if (!state) {
    return res.status(400).json({ error: "State parameter is required" });
  }

  // Read the JSON file
  fs.readFile(
    path.join(__dirname, "data", "api_key.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      try {
        const jsonData = JSON.parse(data);
        const records = jsonData.records.filter(
          (record) =>
            record.state_ut.trim().toLowerCase() === state.trim().toLowerCase()
        );

        res.json({ records });
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/forum", forumRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
