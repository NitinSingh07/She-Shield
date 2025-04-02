// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      try {
        token = req.headers.authorization.split(" ")[1].trim();

        if (!token) {
          throw new Error("No token found");
        }

        // Log token for debugging
        console.log("Received token:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
          throw new Error("User not found");
        }

        req.user = user;
        next();
      } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({
          success: false,
          message: "Not authorized",
          error: error.message,
        });
      }
    } else {
      res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};

module.exports = { protect };
