// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv"); // Import dotenv
dotenv.config(); // Load environment variables from .env file
const { createServer } = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db"); // Import the connectDB function
const corsOptions = require("./config/cors.config"); // Import CORS options
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const trainingRoutes = require("./routes/trainingRoutes");
const forumRoutes = require("./routes/forumRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const fs = require("fs");
const path = require("path");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: corsOptions, // Use the same CORS configuration for socket.io
});

// Store connected users
const connectedUsers = new Map();

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle user authentication
  socket.on("authenticate", (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log("User authenticated:", userId);
  });

  socket.on("emergency_alert", (alertData) => {
    // Broadcast the alert to all connected clients except the sender
    socket.broadcast.emit("emergency_alert", alertData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    // Remove user from connected users
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

// Make io accessible to routes
app.set("io", io);
app.set("connectedUsers", connectedUsers);

// Use the imported CORS options
app.use(cors(corsOptions));

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
app.use("/api/emergency", emergencyRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Update the listen call to use httpServer instead of app
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
