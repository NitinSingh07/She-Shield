import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion"; // Add this import

const Forum = () => {
  const { token, showNotification } = useAuth();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/forum/userallposts`,
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
          `${import.meta.env.VITE_BACKEND_URL}/api/forum/${editingPostId}`,
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
          `${import.meta.env.VITE_BACKEND_URL}/api/forum`,
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
        `${import.meta.env.VITE_BACKEND_URL}/api/forum/userallposts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error submitting post:", error.response.data);
      showNotification("Failed to submit post.", error);
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditingPostId(post._id);
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/forum/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showNotification("Post deleted successfully!", "success");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/forum/userallposts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error deleting post:", error.response.data);
      showNotification("Failed to delete post.", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] pt-24">
      <Navbar />

      {/* Creative Background Pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FFF5F7] to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Forum Form */}
          <div className="bg-white p-8 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_#FF1493]">
            <h2 className="text-3xl font-black mb-8">
              {editingPostId ? "Edit Forum" : "Post a Forum"}
              <div className="h-2 w-20 bg-[#FF1493] mt-2 rounded-full"></div>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                placeholder="Discussion Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] focus:shadow-none transform transition-all duration-200 focus:translate-x-1 focus:translate-y-1 focus:outline-none"
                required
              />

              <textarea
                placeholder="Share your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] focus:shadow-none transform transition-all duration-200 focus:translate-x-1 focus:translate-y-1 focus:outline-none resize-none min-h-[150px]"
                required
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-[#FF1493] text-white px-6 py-3 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
              >
                {editingPostId ? "Update Discussion" : "Post Discussion"}
              </motion.button>
            </form>
          </div>

          {/* Forum Posts */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black">
              Your Forums
              <div className="h-2 w-20 bg-[#FF1493] mt-2 rounded-full"></div>
            </h2>

            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl border-4 border-black hover:shadow-[8px_8px_0px_0px_#FF1493] transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {/* Add this date display */}
                    <div>
                      <p className="text-gray-700 font-mono">
                        {new Date(post.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    <h3 className="text-xl font-bold">{post.title}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 rounded-lg border-2 border-black hover:shadow-none transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="p-2 rounded-lg border-2 border-black hover:shadow-none transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600">{post.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Forum;
