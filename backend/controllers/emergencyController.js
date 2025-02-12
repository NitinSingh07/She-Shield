const User = require("../models/User"); // Adjust based on your user model

// Function to send emergency alerts to all users
exports.sendEmergencyAlert = async (req, res) => {
  try {
    const { message, location, timestamp } = req.body;

    // Get all users from database
    const users = await User.find({});

    // Sending notifications to each user
    for (const user of users) {
      await sendNotification(user, { message, location, timestamp });
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

// Helper function to send notifications
async function sendNotification(user, alertData) {
  // Implement your notification logic here
  console.log(`Alert sent to user ${user.id}:`, alertData);
}
