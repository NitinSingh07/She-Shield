import { useEffect, useState } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";

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
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-4xl font-extrabold text-[#2c3e50] text-center mb-10 tracking-wide">
        Latest News or Forums
      </h2>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post._id}
              className="relative bg-gradient-to-tr from-[#e8f8f5] to-[#d8f8e7] p-6 rounded-xl shadow-lg  border border-[#b2dfdb]"
            >
              {/* User Info */}
              <div className="absolute top-0 left-0 bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] text-white text-sm px-4 py-2 rounded-tr-3xl rounded-bl-3xl shadow-md transform translate-x-4 -translate-y-4">
                <FaUser className="inline-block mr-2" />
                {post.userId.username}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-semibold text-[#2c3e50] mb-4">
                {post.title}
              </h3>

              {/* Content */}
              <p className="text-gray-700 text-base line-clamp-3 mb-6">
                {post.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-10">
          <p className="text-[#7f8c8d] italic text-lg mb-4">
            No posts available. Be the first to contribute!
          </p>
          <div className="text-6xl">📭</div>
        </div>
      )}
    </div>
  );
};

export default ForumPost;
