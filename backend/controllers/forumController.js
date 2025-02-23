// backend/controllers/forumController.js
const ForumPost = require("../models/ForumPost");
const User = require("../models/User"); // Import the User model

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find()
      .populate("userId", "username") // Ensure this matches your schema
      .populate("comments.user", "username");
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
};

// Get all posts for the logged-in user
exports.getUserAllPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find({ userId: req.user.id }) // Fetch posts for the logged-in user
      .populate("userId", "username") // Ensure this matches your schema
      .populate("comments.user", "username");
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
};

// Get single post
exports.getPostById = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate("user", "username")
      .populate("comments.user", "username");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create post
exports.createPost = async (req, res) => {
  const { title, content } = req.body;

  // Validate input
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  const forumPost = new ForumPost({
    userId: req.user.id, // Ensure req.user is populated correctly
    title,
    content,
  });

  try {
    await forumPost.save();
    res
      .status(201)
      .json({ message: "Forum post created successfully", forumPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the post owner
    if (post.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    Object.assign(post, req.body);
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// backend/controllers/forumController.js
exports.deletePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Allow only the post owner or an admin to delete the post
    if (
      post.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Add comment to post
exports.addComment = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      text: req.body.text,
      user: req.user._id,
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
