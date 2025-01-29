import Navbar from "../components/Navbar";
import ForumPost from "../components/ForumPost";
import Footer from "../components/Footer";
import ComplaintPost from "../components/ComplaintPost";
import Map from "../components/Map";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FaShieldAlt, FaUsers, FaHandHoldingHeart } from "react-icons/fa";
import { MdSecurity, MdEmergency } from "react-icons/md";
import { GiCctvCamera } from "react-icons/gi";

const Home = () => {
  const forumRef = useRef(null);
  const complaintRef = useRef(null);
  const mapRef = useRef(null);

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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#fff7eb]">
      <Navbar />
      <div className="container mx-auto px-6 py-8 flex-1">
        {/* Enhanced Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-r from-[#fff7eb] via-[#fbf0dc] to-[#f7e6cc] rounded-3xl shadow-2xl overflow-hidden border border-amber-100"
        >
          {/* Decorative Elements */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#ffe3b3] rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-[#fcd49b] rounded-full blur-3xl opacity-50"></div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
            {/* Left Content */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold">
                  Emergency? Call 112
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#2c3e50] tracking-tight leading-tight">
                  Your Safety is Our{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e67e22] to-[#f39c12]">
                    Priority
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-[#34495e] leading-relaxed"
              >
                Empowering women in rural areas with access to safety resources,
                reporting tools, and a supportive community. Together, we stand
                for safety and equality.
              </motion.p>
              <p className="text-sm md:text-base text-[#7f8c8d] italic text-center">
                “Safety is not a privilege, it’s a basic right for every woman.”
              </p>

              {/* Safety Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-3 gap-4 bg-white/50 p-4 rounded-xl"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#e67e22]">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
                <div className="text-center border-x border-amber-200">
                  <div className="text-2xl font-bold text-[#e67e22]">1000+</div>
                  <div className="text-sm text-gray-600">Women Protected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#e67e22]">100%</div>
                  <div className="text-sm text-gray-600">Response Rate</div>
                </div>
              </motion.div>

              {/* Enhanced CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex gap-4"
              >
                <button className="bg-gradient-to-r from-[#e67e22] to-[#f39c12] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Report Incident
                </button>
                <button className="bg-white text-[#e67e22] border-2 border-[#e67e22] px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Join Community
                </button>
              </motion.div>
            </div>

            {/* Enhanced Right Image Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div className="relative h-full flex items-center justify-center">
                {/* Main Image */}
                <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
                  <img
                    src="/women-empowerment.png" // Add your image path here
                    alt="Women Empowerment"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#e67e22]/20 to-transparent"></div>

                  {/* Floating Elements */}
                  <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
                  <div className="absolute -left-4 -top-4 w-32 h-32 bg-orange-400/20 rounded-full blur-2xl"></div>
                </div>

                {/* Enhanced Floating Badges */}
                <div className="absolute -right-4 top-10 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-amber-100">
                  <MdSecurity className="text-[#e67e22] text-2xl mb-1" />
                  <div className="text-sm font-semibold text-gray-800">
                    Security
                  </div>
                  <div className="text-xs text-gray-600">
                    Advanced Protection
                  </div>
                </div>

                <div className="absolute -left-4 bottom-10 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-amber-100">
                  <FaHandHoldingHeart className="text-red-500 text-2xl mb-1" />
                  <div className="text-sm font-semibold text-gray-800">
                    Community Care
                  </div>
                  <div className="text-xs text-gray-600">
                    Always Here for You
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Interactive Map Section */}
        <motion.div
          ref={mapRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={mapInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1 }}
          className="mt-16"
        >
          <Map />
        </motion.div>

        {/* Forum Section */}
        <motion.div
          ref={forumRef}
          initial={{ opacity: 0, x: -50 }}
          animate={forumInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16"
        >
          <ForumPost />
        </motion.div>

        {/* Complaint Section */}
        <motion.div
          ref={complaintRef}
          initial={{ opacity: 0, x: 50 }}
          animate={complaintInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <ComplaintPost />
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
