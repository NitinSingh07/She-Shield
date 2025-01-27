import { useEffect, useState } from "react";
import axios from "axios";

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
    <div>
      <h2 className="text-xl font-bold text-[#2c3e50] mb-6">
        Latest Forum Posts
      </h2>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-[#eef6f7]"
            >
              <p className="text-sm text-[#7f8c8d] mb-2 italic">
                Posted by{" "}
                <span className="text-[#1abc9c] font-medium">
                  {post.userId.username}
                </span>
              </p>
              <h3 className="text-xl font-semibold text-[#2c3e50] mb-3">
                {post.title}
              </h3>
              <p className="text-gray-700 line-clamp-3">{post.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#7f8c8d] italic text-center mt-6">
          No posts available. Be the first to contribute!
        </p>
      )}
    </div>
  );
};

export default ForumPost;
