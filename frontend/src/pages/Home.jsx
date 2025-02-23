import Navbar from "../components/Navbar";
import ForumPost from "../components/ForumPost";
import Footer from "../components/Footer";
import ComplaintPost from "../components/ComplaintPost";
import Map from "../components/Map";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import FeatureCards from "../components/Features";

const Home = () => {
  const forumRef = useRef(null);
  const complaintRef = useRef(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  const forumInView = useInView(forumRef, {
    triggerOnce: false,
    margin: "-100px",
  });
  const complaintInView = useInView(complaintRef, {
    triggerOnce: false,
    margin: "-100px",
  });
  const mapInView = useInView(mapRef, { triggerOnce: false, margin: "-100px" });

  return (
    <div className="min-h-screen bg-[#FFF5F7] pt-24">
      {" "}
      {/* Added pt-24 for navbar spacing */}
      <Navbar />
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 animate-slide"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] rounded-full filter blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[30rem] h-[30rem] bg-gradient-to-r from-[#FFA07A] to-[#FF1493] rounded-full filter blur-[140px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] rounded-full filter blur-[160px] animate-pulse delay-2000 opacity-30"></div>
      </div>
      <main className="container mx-auto px-4 py-8">
        {/* Enhanced Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative mb-32"
        >
          <div className="absolute -top-10 -left-10 w-20 h-20 border-4 border-[#FF1493] rounded-lg transform rotate-12"></div>
          <div className="absolute -bottom-10 -right-10 w-20 h-20 border-4 border-black rounded-full"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="relative z-10">
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="bg-white p-8 rounded-3xl shadow-[8px_8px_0px_0px_#FF1493] border-4 border-black transform hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#FF1493] transition-all duration-300"
              >
                <span className="inline-block bg-[#FF1493] text-white px-6 py-2 rounded-full text-sm font-bold transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                  🚨 24/7 Emergency Support
                </span>
                <h1 className="mt-6 text-6xl font-black text-black leading-tight">
                  Empowering
                  <span className="block text-[#FF1493] transform -rotate-1">
                    Every Woman
                  </span>
                  <span className="block text-3xl mt-2 font-normal text-gray-600">
                    Your Safety, Our Mission
                  </span>
                </h1>

                {/* Neo-brutalism Statistics */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {[
                    { number: "24/7", label: "Support" },
                    { number: "1000+", label: "Women Protected" },
                    { number: "100%", label: "Response Rate" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="bg-[#FFE4E1] p-4 rounded-xl border-2 border-black transform hover:scale-105 transition-transform duration-300"
                    >
                      <div className="text-2xl font-black text-[#FF1493]">
                        {stat.number}
                      </div>
                      <div className="text-sm font-bold text-gray-800">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Creative CTA Buttons */}
                <div className="flex gap-6 mt-10">
                  <button
                    onClick={() => navigate("/complaints")}
                    className="group relative px-8 py-4 bg-[#FF1493] text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
                  >
                    Report Incident
                  </button>
                  <button className="px-8 py-4 bg-white text-[#FF1493] font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200">
                    Join Community
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Creative Image Section */}
            <div className="hidden lg:block relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
              >
                <img
                  src="/hero.jpg"
                  alt="Hero"
                  className="rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_#FF1493] transform -rotate-3 hover:rotate-0 transition-all duration-300"
                />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#FFB6C1] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              </motion.div>
            </div>
          </div>

          {/* Add decorative elements */}
          <div className="absolute top-1/2 right-20 w-8 h-8 bg-[#FF1493] rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-20 left-40 w-6 h-6 bg-black rounded-lg animate-bounce delay-700"></div>
        </motion.section>

        {/* Enhanced Map Section */}
        <motion.section
          ref={mapRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={mapInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="relative bg-white p-8 rounded-3xl border border-black mb-20" // Updated border class
        >
          {/* Decorative Elements */}
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#FF1493] rounded-full border-4 border-black"></div>
          <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-black rounded-full border-4 border-[#FF1493]"></div>

          {/* Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-black">
              Crime Analytics Map
              <div className="h-2 w-32 bg-[#FF1493] mt-2 rounded-full"></div>
            </h2>
            <p className="text-gray-600 mt-2">
              Explore crime statistics and emergency services across India
            </p>
          </div>

          <Map />
        </motion.section>

        <motion.section
          ref={forumRef}
          initial={{ opacity: 0, x: -20 }}
          animate={forumInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <ForumPost />
        </motion.section>
        {/* Enhanced Feature Cards */}
        <motion.section
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-20 relative"
        >
          <div className="absolute -top-10 -left-10 w-20 h-20 border-4 border-[#FF1493] rounded-full"></div>
          <div className="bg-white p-8 rounded-3xl border border-black relative z-10"> {/* Updated border class */}
            <FeatureCards />
          </div>
          <div className="absolute -bottom-10 -right-10 w-20 h-20 border-4 border-black rounded-lg transform -rotate-12"></div>
        </motion.section>

        <motion.section
          ref={complaintRef}
          initial={{ opacity: 0, x: 20 }}
          animate={complaintInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <ComplaintPost />
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
