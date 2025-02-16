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
    <div className="min-h-screen bg-gradient-to-br from-[#ffecd2] via-[#fcb69f] to-[#ffdde1]">
      <Navbar />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden ">
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob  sm:hidden"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000  "></div>
        <div className="absolute bottom-0 left-0 w-96 h-40 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000  "></div>
      </div>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12 mb-[13rem]">
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
                "Safety is not a privilege, it's a basic right for every woman."
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
                <button
                  onClick={() => navigate("/complaints")}
                  className="bg-gradient-to-r from-[#e67e22] to-[#f39c12] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Report Incident
                </button>
                <button className="bg-white text-[#e67e22] border-2 border-[#e67e22] px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Join Community
                </button>
              </motion.div>
            </div>

            {/* Right Content - Hero Images with Creative Layout */}
            <div className="hidden lg:block relative h-full sm:hidden">
              <motion.div
                initial={{ opacity: 0, x: 30, rotate: -10 }}
                animate={{ opacity: 1, x: -50, rotate: -15 }}
                transition={{ delay: 0.4 }}
                className="absolute top-4 right-4 w-[80%] transform hover:scale-105 hover:rotate-0 transition-all duration-300"
              >
                <img
                  src="/hero.jpg"
                  alt="Women Protection Illustration"
                  className="w-full h-auto object-cover rounded-2xl shadow-2xl"
                />
              </motion.div>

              {/* <motion.div
                initial={{ opacity: 0, x: -30, rotate: 5 }}
                animate={{ opacity: 1, x: 0, rotate: 5 }}
                transition={{ delay: 0.6 }}
                className="absolute top-20 left-4 w-[80%] transform hover:scale-105 hover:rotate-0 transition-all duration-300"
              >
                <img
                  src="/hero3.jpg"
                  alt="Women Empowerment"
                  className="w-full h-auto object-cover rounded-2xl shadow-2xl border-4 border-white/50"
                />
              </motion.div> */}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-[60%] hover:scale-105 transition-all duration-300"
              >
                <img
                  src="/hero2.jpg"
                  alt="Community Support"
                  className="w-full h-auto object-cover rounded-2xl shadow-2xl border-4 border-white/50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <span className="text-white text-lg font-semibold">
                    Together We Stand Stronger
                  </span>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute -z-10 w-full h-full"
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-200 rounded-full filter blur-3xl opacity-20"></div>
                <div className="absolute top-20 right-20 w-24 h-24 bg-pink-200 rounded-full filter blur-2xl opacity-20"></div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Map Section */}
        <motion.section
          ref={mapRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={mapInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-20"
        >
          <Map />
        </motion.section>

        {/* Feature section */}
        <FeatureCards/>

        {/* Forum and Complaints Sections */}
        <motion.section
          ref={forumRef}
          initial={{ opacity: 0, x: -20 }}
          animate={forumInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <ForumPost />
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
