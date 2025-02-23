import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_#FF1493] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#FF1493] p-8 text-white text-center border-b-4 border-black relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-8 left-8 w-16 h-16 border-4 border-white/30 rounded-full"></div>
                <div className="absolute bottom-8 right-8 w-16 h-16 border-4 border-white/30 rounded-lg transform rotate-12"></div>
              </div>
              <div className="relative z-10">
                <h1 className="text-4xl font-black">About She-Shield</h1>
                <p className="mt-2 text-xl font-medium">
                  "For Every Woman, Safety Comes First."
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Mission Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-pink-50 p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#FF1493]"
              >
                <h2 className="text-2xl font-bold text-[#FF1493]">
                  Our Mission
                </h2>
                <p className="mt-4 text-gray-800">
                  We believe that safety is a fundamental right. By leveraging
                  technology, we aim to provide immediate assistance, raise
                  awareness, and foster a strong community where women can
                  support each other.
                </p>
              </motion.div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: "🔒",
                    title: "Anonymous & Secure Reporting",
                    bg: "bg-orange-100",
                    text: "Report incidents without fear, ensuring privacy and security.",
                    link: "/complaints",
                  },
                  {
                    icon: "👥",
                    title: "Community Support & Awareness",
                    bg: "bg-red-100",
                    text: "Engage in discussions and spread awareness about safety.",
                    link: "/forum",
                  },
                  {
                    icon: "🚨",
                    title: "Emergency Assistance & SOS",
                    bg: "bg-red-100",
                    text: "Instantly connect with trusted contacts and emergency services.",
                    link: "/emergency",
                  },
                  {
                    icon: "🏥",
                    title: "Nearest Police & Medical Support",
                    bg: "bg-orange-100",
                    text: "Quickly locate nearby police stations and medical facilities.",
                    link: "/help",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
                  >
                    <span className="text-3xl">{feature.icon}</span>
                    <h3 className="text-xl font-bold mt-4">{feature.title}</h3>
                    <p className="mt-2 text-gray-600">{feature.text}</p>
                  </motion.div>
                ))}
              </div>

              {/* Join Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center bg-[#FF1493] text-white p-8 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000]"
              >
                <h2 className="text-3xl font-bold">Join Our Movement</h2>
                <p className="mt-4 mb-6">
                  Safety is a{" "}
                    shared responsibility
                  . Be part of our mission to create a safer environment for
                  women everywhere. Join our community, contribute, and help us
                  make a difference.
                </p>
              
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
