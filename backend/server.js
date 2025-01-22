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

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
connectDB(); // Call the connectDB function

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/forum", forumRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
