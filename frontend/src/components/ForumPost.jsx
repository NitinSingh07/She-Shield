import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const ForumPost = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get("http://localhost:5000/api/forum");
      setPosts(response.data);
    };
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/forum/${postId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleUpdate = async (postId, updatedContent) => {
    try {
      await axios.put(
        `http://localhost:5000/api/forum/${postId}`,
        { content: updatedContent },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, content: updatedContent } : post
        )
      );
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Latest Forum Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post._id} className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-500 text-sm mb-2">
              Posted by {post.userId.username}
            </p>
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-700 mb-4">{post.content}</p>
            {user && user.id === post.userId._id && (
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() =>
                    handleUpdate(
                      post._id,
                      prompt("Update your post:", post.content)
                    )
                  }
                  className="text-blue-500 hover:underline"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumPost;
