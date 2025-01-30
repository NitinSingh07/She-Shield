import { useEffect, useState } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const ForumPost = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

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
    <div className="container mx-auto relative overflow-hidden p-6">
      <h2 className="text-4xl font-extrabold text-[#2c3e50] text-center mb-10 tracking-wide relative inline-block before:absolute before:w-16 before:h-2 before:bg-[#ff7e5f] before:bottom-0 before:left-1/2 before:-translate-x-1/2">
        Latest Forums
      </h2>
      {posts.length > 0 ? (
        <div className="relative w-full overflow-hidden py-4 px-2">
          <motion.div
            className="flex space-x-4"
            animate={{ x: ["100%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            {posts.concat(posts).map((post, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg w-80 flex-shrink-0"
              >
                <div className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] text-white flex justify-center items-center rounded-full shadow-md">
                    <FaUser />
                  </div>
                  {post.userId.username}
                </div>
                <h3 className="text-xl font-semibold text-[#2c3e50] mt-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 border-l-4 border-[#ff7e5f] pl-3 mt-2">
                  {post.content}
                </p>
              </div>
            ))}
          </motion.div>
          <button
            onClick={() => navigate("/forum")}
            className="bg-gradient-to-r from-[#e67e22] to-[#f39c12] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mt-6 mx-auto block"
          >
            Post Your Forum
          </button>
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
