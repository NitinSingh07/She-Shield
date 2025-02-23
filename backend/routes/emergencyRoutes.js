const express = require("express");
const router = express.Router();
const { sendEmergencyAlert } = require("../controllers/emergencyController");

// Define route for sending alerts
router.post("/alert", sendEmergencyAlert);

module.exports = router;
