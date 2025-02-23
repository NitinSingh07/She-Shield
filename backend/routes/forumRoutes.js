// backend/routes/forumRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  addComment,
  getUserAllPosts,
} = require("../controllers/forumController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllPosts);
router.get("/userallposts", protect, getUserAllPosts);
router.get("/:id", getPostById);

// Protected routes
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.post("/:id/comments", protect, addComment);

module.exports = router;
