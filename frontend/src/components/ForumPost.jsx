import { useEffect, useState } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

const ForumPost = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/forum`
      );
      setPosts(response.data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto p-8">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative"
      >
        <h2 className="text-4xl font-black text-black relative inline-block">
          Community Forums
          <div className="absolute -bottom-2 left-0 w-full h-2 bg-[#FF1493] rounded-full transform -rotate-1"></div>
        </h2>
        <p className="text-gray-600 mt-4">
          Join the conversation and share your experiences
        </p>
      </motion.div>

      {posts.length > 0 ? (
        <div className="relative overflow-hidden">
          {/* Forum Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_#FF1493] hover:shadow-none transform hover:translate-x-2 hover:translate-y-2 transition-all duration-200"
              >
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl border-2 border-black bg-[#FF1493] text-white flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                    <FaUser size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-black">
                      {post.userId.username}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <h4 className="text-xl font-bold text-black mb-2">
                  {post.title}
                </h4>
                <p className="text-gray-600 border-l-4 border-[#FF1493] pl-4">
                  {post.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Enhanced CTA Button */}
          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/forum")}
            className="mt-8 bg-[#FF1493] text-white px-8 py-4 rounded-xl font-bold border-4 border-black shadow-[8px_8px_0px_0px_#000] hover:shadow-none transform hover:translate-x-2 hover:translate-y-2 transition-all duration-200"
          >
            Start a Discussion
          </motion.button> */}
        </div>
      ) : (
        <div className="text-center mt-12">
          <p className="text-[#7f8c8d] italic text-lg mb-4">
            No trending threads. Start one now!
          </p>
          <div className="text-6xl animate-bounce">📭</div>
        </div>
      )}
    </div>
  );
};

export default ForumPost;
