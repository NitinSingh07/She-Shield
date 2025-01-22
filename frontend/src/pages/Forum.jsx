import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { FaEdit, FaTrash } from "react-icons/fa";
import moment from "moment";

const Forum = () => {
  const { token, showNotification } = useAuth();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get(
        "http://localhost:5000/api/forum/userallposts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(response.data);
    };
    fetchPosts();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPostId) {
        await axios.put(
          `http://localhost:5000/api/forum/${editingPostId}`,
          { title, content },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        showNotification("Post updated successfully!", "success");
      } else {
        await axios.post(
          "http://localhost:5000/api/forum",
          { title, content },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        showNotification("Post created successfully!", "success");
      }
      setTitle("");
      setContent("");
      setEditingPostId(null);
      const response = await axios.get(
        "http://localhost:5000/api/forum/userallposts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error submitting post:", error.response.data);
      showNotification("Failed to submit post.", "error");
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditingPostId(post._id);
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/forum/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showNotification("Post deleted successfully!", "success");
      const response = await axios.get(
        "http://localhost:5000/api/forum/userallposts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error deleting post:", error.response.data);
      showNotification("Failed to delete post.", "error");
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-[#f0f9ff] to-[#dff0f4] min-h-screen">
      {/* Flex Container */}
      <div className="flex justify-between gap-12">
        {/* Left Side: Previous Forums */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Your Last Forums
          </h2>
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-4">
                  <button
                    onClick={() => handleEdit(post)}
                    className="text-blue-600 hover:text-blue-700 transition-all"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-red-600 hover:text-red-700 transition-all"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>

                {/* Post Content */}
                <h3 className="font-semibold text-2xl text-gray-800 mb-4">
                  {post.title}
                </h3>
                <p className="text-gray-700 text-lg mb-6">{post.content}</p>
                <p className="text-sm text-gray-500">
                  Posted on{" "}
                  {moment(post.createdAt).format("MMMM Do YYYY, h:mm A")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Post a Forum */}
        <div className="flex-1 bg-white p-8 rounded-xl shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Post a Forum
            </h1>
            <p className="text-xl text-gray-600">
              Share your thoughts and engage with others
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-8 max-w-xl mx-auto">
            <div>
              <input
                type="text"
                placeholder="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border border-gray-300 p-4 rounded-xl w-full text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div>
              <textarea
                placeholder="Post Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="border border-gray-300 p-4 rounded-xl w-full text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                rows="6"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 focus:outline-none transition-all"
              >
                {editingPostId ? "Update Post" : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Forum;
