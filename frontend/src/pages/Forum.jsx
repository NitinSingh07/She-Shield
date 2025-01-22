import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importing icons

const Forum = () => {
  const { token, user, showNotification } = useAuth();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get(
        "http://localhost:5000/api/forum/userallposts", // Ensure this endpoint fetches only the logged-in user's posts
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
      setTitle(""); // Clear the input
      setContent(""); // Clear the input
      setEditingPostId(null); // Reset editing state
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Forum Posts</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md mb-6"
      >
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 mb-4 w-full rounded"
        />
        <textarea
          placeholder="Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="border p-2 mb-4 w-full rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {editingPostId ? "Update Post" : "Create Post"}
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="border p-4 rounded shadow-md mb-4 bg-gray-100"
          >
            <h3 className="font-bold text-lg">{post.title}</h3>
            <p className="text-gray-700">{post.content}</p>
            <div className="flex  flex-row mt-4">
              <button
                onClick={() => handleEdit(post)}
                className="text-blue-600 flex items-center"
              >
                <FaEdit className="mr-1" />
              </button>
              <button
                onClick={() => handleDelete(post._id)}
                className="text-red-600 flex items-center"
              >
                <FaTrash className="mr-1" /> 
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;
