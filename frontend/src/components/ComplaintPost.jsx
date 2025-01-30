import { useEffect, useState } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";
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
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#fde7cd] to-[#f0d8bd]">
      <h2 className="text-4xl font-extrabold text-[#2c3e50] text-center mb-10 tracking-wide">
        User Complaints
      </h2>

      {complaints.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-[#7f8c8d] italic text-lg mb-4">
            No complaints found. Check back later!
          </p>
          <div className="text-6xl animate-bounce">📬</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="relative bg-white/90 backdrop-blur-lg p-6 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              {/* Floating User Badge */}
              <div className="absolute top-0 left-0 bg-[#093208] text-white text-xs px-4 py-2 rounded-full flex items-center shadow-lg">
                <div className="w-8 h-8 rounded-full bg-white text-[#ff6f61] flex items-center justify-center mr-3">
                  <FaUser className="text-lg" />
                </div>
                <span className="font-semibold">
                  {complaint.userId?.name ||
                    complaint.userId?.username ||
                    "Anonymous"}
                </span>
              </div>

              {/* Complaint Photo */}
              {complaint.photo && (
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                    complaint.photo
                  }`}
                  alt="Complaint"
                  className="mt-10 rounded-xl shadow-lg object-cover max-h-full w-full"
                  onError={(e) => {
                    console.error("Image failed to load:", e);
                    e.target.style.display = "none";
                  }}
                />
              )}

              {/* Complaint Description */}
              <p className="text-lg text-[#34495e] mt-2 line-clamp-4">
                {complaint.description}
              </p>

              {/* Date */}
              <div className="text-sm text-[#7f8c8d] mt-2">
                <span className="italic">Posted on</span>{" "}
                {new Date(complaint.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => navigate("/complaints")}
        className="bg-[#093208] items-start justify-start  text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mt-6 "
      >
        Add a Complaint
      </button>
    </div>
  );
};

export default ComplaintPost;
