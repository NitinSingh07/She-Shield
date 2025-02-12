const User = require("../models/User");

exports.sendEmergencyAlert = async (req, res) => {
  try {
    const { message, location, timestamp } = req.body;
    const io = req.app.get("io");
    const connectedUsers = req.app.get("connectedUsers");

    // Get all users from database
    const users = await User.find({});

    // Send notifications to each user
    for (const user of users) {
      // Get socket ID for connected user
      const socketId = connectedUsers.get(user._id.toString());

      if (socketId) {
        // Send real-time notification to connected user
        io.to(socketId).emit("emergency_alert", {
          message,
          location,
          timestamp,
          type: "EMERGENCY",
        });
      }

      // Log the notification
      console.log(`Alert sent to user ${user._id}:`, {
        message,
        location,
        timestamp,
      });
    }

    res.status(200).json({
      success: true,
      message: "Emergency alert sent successfully",
      recipientCount: users.length,
    });
  } catch (error) {
    console.error("Emergency alert error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send emergency alert",
      error: error.message,
    });
  }
};
