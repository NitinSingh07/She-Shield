import Navbar from "../components/Navbar";
import ForumPost from "../components/ForumPost";
import Footer from "../components/Footer";
import ComplaintPost from "../components/ComplaintPost";
import Map from "../components/Map";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

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
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-6 py-8 flex-1">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-[#fff7eb] via-[#ffedcc] to-[#ffd699] p-10 rounded-2xl shadow-lg relative overflow-hidden"
        >
          <div className="absolute -top-10 -left-10 w-44 h-44 bg-[#ffe3b3] rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-44 h-44 bg-[#fcd49b] rounded-full blur-3xl opacity-50"></div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2c3e50] mb-6 tracking-tight leading-tight text-center">
            Welcome to <span className="text-[#e67e22]">She-Shield</span>
          </h1>
          <p className="text-lg md:text-xl text-[#34495e] mb-8 leading-relaxed text-center">
            Empowering women in rural areas with access to safety resources,
            reporting tools, and a supportive community. Together, we stand for
            safety and equality.
          </p>
          <div className="bg-white border-l-4 border-[#e67e22] p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <p className="text-sm md:text-base text-[#7f8c8d] italic text-center">
              “Safety is not a privilege, it’s a basic right for every woman.”
            </p>
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
