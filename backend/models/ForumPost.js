const mongoose = require("mongoose");

const ForumPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Ensure this is correct
    title: { type: String, required: true },
    content: { type: String, required: true },
    comments: [
      {
        text: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Ensure this is correct
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ForumPost", ForumPostSchema);
