import { useEffect, useState } from "react";
import axios from "axios";

const ComplaintPost = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        console.log("Attempting to fetch complaints...");
        console.log(
          "API URL:",
          `${import.meta.env.VITE_BACKEND_URL}/api/complaints/all`
        );

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/complaints/all`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Response:", response.data);
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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">All Complaints</h2>
      {complaints.map((complaint) => (
        <div
          key={complaint._id}
          className="bg-white p-4 mb-4 rounded shadow-md"
        >
          <div className="flex items-center mb-2">
            <span className="font-semibold mr-2">Posted by:</span>
            <span>
              {complaint.userId?.name ||
                complaint.userId?.username ||
                "Anonymous"}
            </span>
          </div>
          <p>{complaint.description}</p>
          {complaint.photo && (
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                complaint.photo
              }`}
              alt="Complaint"
              className="mt-2 max-w-md rounded"
            />
          )}
          <div className="text-sm text-gray-500 mt-2">
            {new Date(complaint.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComplaintPost;
