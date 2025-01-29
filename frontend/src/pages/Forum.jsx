import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import moment from "moment";
import Navbar from "../components/Navbar";

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
      <div className="min-h-screen bg-gradient-to-r from-gray-50 via-blue-50 to-gray-100">
        {/* Flex Container */}
        <div className="flex justify-between gap-8">
          {/* Left Side: Previous Forums */}
          <div className="w-1/2 bg-white p-8 mt-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 border-b pb-4">
              Your Last Forums
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
                  <div
                    key={post._id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-xl text-gray-800">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {moment(post.createdAt).format(
                            "MMMM Do YYYY, h:mm A"
                          )}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                          title="Edit Post"
                        >
                          <FiEdit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                          title="Delete Post"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Side: Post a Forum */}
          <div className="w-1/2 bg-white p-8 mt-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-6 border-b pb-4">
                Post a Forum
              </h2>
              <p className="text-lg text-gray-600">
                Share your thoughts and engage with others
              </p>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg resize-none"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  {editingPostId ? "Update Post" : "Create Post"}
                </button>
                {editingPostId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPostId(null);
                      setTitle("");
                      setContent("");
                    }}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
