import React from "react";
import { motion } from "framer-motion";
import { useState } from "react";

const FeatureCard = ({ icon, title, description, color, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative bg-white p-6 rounded-xl border-4 border-black"
      style={{
        boxShadow: isHovered
          ? "8px 8px 0px 0px #FF1493"
          : "8px 8px 0px 0px #000",
        transform: isHovered ? "translate(-4px, -4px)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div
        className={`w-12 h-12 ${color} rounded-xl border-2 border-black mb-4 flex items-center justify-center`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>

      {/* Neo-brutalism decorative elements */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#FF1493] rounded-full"></div>
      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-black rounded-full"></div>
    </motion.div>
  );
};

const FeatureCards = () => {
  const features = [
    {
      icon: "🚨",
      title: "24/7 Emergency Response",
      description:
        "Immediate assistance when you need it most with real-time tracking and support.",
      color: "bg-pink-100",
    },
    {
      icon: "🗺️",
      title: "Safe Route Navigation",
      description:
        "AI-powered route suggestions to help you travel safely day or night.",
      color: "bg-purple-100",
    },
    {
      icon: "👥",
      title: "Community Support",
      description:
        "Connect with a network of supporters and fellow users for mutual safety.",
      color: "bg-blue-100",
    },
    {
      icon: "🔒",
      title: "Anonymous Reporting",
      description: "Securely report incidents while maintaining your privacy.",
      color: "bg-green-100",
    },
  ];

  return (
    <div className="py-12">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-12"
      >
        Empowering Features
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} delay={index * 0.2} />
        ))}
      </div>
    </div>
  );
};

export default FeatureCards;
