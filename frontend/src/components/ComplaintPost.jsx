import { useEffect, useState } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ComplaintPost = () => {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        console.log("Fetching complaints...");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/complaints/all`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        setComplaints(response.data);
      } catch (error) {
        console.error("Failed to fetch complaints:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="bg-[#FFF5F7] p-8">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-black text-black inline-block relative">
          Community Reports
          <div className="absolute -bottom-2 left-0 w-full h-2 bg-[#FF1493] rounded-full"></div>
        </h2>
        <p className="text-gray-600 mt-4">Together we can make a difference</p>
      </motion.div>

      {complaints.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-[#7f8c8d] italic text-lg mb-4">
            No complaints found. Check back later!
          </p>
          <div className="text-6xl animate-bounce">📬</div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {complaints.map((complaint, index) => (
            <motion.div
              key={complaint._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_#FF1493] hover:shadow-none transform hover:translate-x-2 hover:translate-y-2 transition-all duration-200 overflow-hidden"
            >
              {/* User Badge */}
              <div className="bg-[#FF1493] text-white p-4 border-b-4 border-black">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border-2 border-black bg-white text-[#FF1493] flex items-center justify-center">
                    <FaUser size={20} />
                  </div>
                  <span className="font-bold">
                    {complaint.userId?.username || "Anonymous"}
                  </span>
                </div>
              </div>

              {/* Complaint Content */}
              <div className="p-6">
                {complaint.photo && (
                  <div className="mb-4 rounded-xl border-2 border-black overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                        complaint.photo
                      }`}
                      alt="Report Evidence"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                <p className="text-gray-800 font-medium">
                  {complaint.description}
                </p>

                <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200">
                  <span className="text-sm text-gray-500">
                    Reported on{" "}
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Enhanced CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/reportincident")}
        className="mt-12 mx-auto block bg-[#FF1493] text-white px-8 py-4 rounded-xl font-bold border-4 border-black shadow-[8px_8px_0px_0px_#000] hover:shadow-none transform hover:translate-x-2 hover:translate-y-2 transition-all duration-200"
      >
        Report an Incident
      </motion.button>
    </div>
  );
};

export default ComplaintPost;
