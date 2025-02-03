import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import moment from "moment";
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
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        
        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            {/* Left Side: Previous Forums */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:w-1/2"
            >
              <div className="backdrop-blur-lg bg-white/80 p-8 rounded-3xl shadow-xl border border-white/40">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 border-b border-gray-200/50 pb-4">
                  Posted Forums
                </h2>
                <div className="space-y-6">
                  {posts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-lg">
                        You haven’t posted any forums yet.
                      </p>
                      <p className="text-gray-400 mt-2">
                        Your forums will appear here once submitted.
                      </p>
                    </div>
                  ) : (
                    posts.map((post) => (
                      <motion.div
                        key={post._id}
                        whileHover={{ scale: 1.02 }}
                        className="backdrop-blur-sm bg-white/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-white/40"
                      >
                        {/* Post content structure remains same but with updated styling */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-xl text-gray-800 hover:text-blue-600 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {moment(post.createdAt).format(
                                "MMMM Do YYYY, h:mm A"
                              )}
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(post)}
                              className="p-2 bg-blue-100/80 text-blue-600 rounded-full hover:bg-blue-200"
                              title="Edit Post"
                            >
                              <FiEdit2 size={20} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(post._id)}
                              className="p-2 bg-red-100/80 text-red-600 rounded-full hover:bg-red-200"
                              title="Delete Post"
                            >
                              <FiTrash2 size={20} />
                            </motion.button>
                          </div>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {post.content}
                        </p>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right Side: Post a Forum */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:w-1/2"
            >
              <div className="backdrop-blur-lg bg-white/80 p-8 rounded-3xl shadow-xl border border-white/40">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 border-b border-gray-200/50 pb-4">
                    Share Your Voice
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Form fields with enhanced styling */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="title"
                    >
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      placeholder="Enter a title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="content"
                    >
                      Content
                    </label>
                    <textarea
                      id="content"
                      placeholder="Enter content for your forum"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                      rows="6"
                      className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg transition-all duration-300 resize-none"
                    />
                  </div>
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:opacity-90 transition-all duration-300 font-medium shadow-lg"
                    >
                      {editingPostId ? "Update Post" : "Create Post"}
                    </motion.button>
                    {editingPostId && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => {
                          setEditingPostId(null);
                          setTitle("");
                          setContent("");
                        }}
                        className="flex-1 bg-gray-500 text-white py-4 rounded-xl hover:bg-gray-600 transition-colors duration-200 font-medium"
                      >
                        Cancel
                      </motion.button>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
