import React from "react";
import Navbar from "../components/Navbar";
import ForumPost from "../components/ForumPost";

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Welcome to Women Safety Hub</h1>
        <p className="mb-4">
          A centralized platform for women in rural areas to access safety
          resources and report harassment.
        </p>
        <ForumPost />
      </div>
    </div>
  );
};

export default Home;
