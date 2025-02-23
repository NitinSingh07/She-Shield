import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion"; // Add this import

const Complaints = () => {
  const { token, showNotification } = useAuth();
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [editingComplaintId, setEditingComplaintId] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, [token]);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/complaints`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComplaints(response.data);
    } catch (error) {
      console.error("Failed to fetch complaints", error);
      showNotification("Failed to fetch complaints", "error");
    }
  };

  const handleEdit = (complaint) => {
    setDescription(complaint.description);
    setPhoto(null);
    setEditingComplaintId(complaint._id);
  };

  const handleDelete = async (complaintId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/complaints/${complaintId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showNotification("Complaint deleted successfully!", "success");
      fetchComplaints();
    } catch (error) {
      console.error("Error deleting complaint:", error);
      showNotification("Failed to delete complaint", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", description);
    if (photo) {
      formData.append("photo", photo);
    }

    try {
      if (editingComplaintId) {
        await axios.put(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/complaints/${editingComplaintId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        showNotification("Complaint updated successfully!", "success");
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/complaints`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        showNotification("Complaint submitted successfully!", "success");
      }

      setDescription("");
      setPhoto(null);
      setEditingComplaintId(null);
      fetchComplaints();
    } catch (error) {
      console.error("Error submitting complaint:", error);
      showNotification("Failed to submit complaint", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] pt-24">
      <Navbar />

      {/* Creative Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#FF1493] rounded-full opacity-10 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-black rounded-full opacity-10 blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Submit Complaint Form */}
          <div className="bg-white p-8 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_#FF1493]">
            <h2 className="text-3xl font-black mb-8">
              {editingComplaintId ? "Edit Report" : "File a Report"}
              <div className="h-2 w-20 bg-[#FF1493] mt-2 rounded-full"></div>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] focus:shadow-none transform transition-all duration-200 focus:translate-x-1 focus:translate-y-1 focus:outline-none resize-none min-h-[150px]"
                  placeholder="Describe what happened..."
                />
              </div>

              {/* Enhanced File Upload */}
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  accept="image/*"
                />
                <div className="p-4 border-2 border-dashed border-[#FF1493] rounded-xl text-center">
                  <div className="text-[#FF1493]">
                    📸 Click to upload evidence (optional)
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Supports: JPG, PNG, HEIC
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 bg-[#FF1493] text-white px-6 py-3 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
                >
                  {editingComplaintId ? "Update Report" : "Submit Report"}
                </motion.button>
                {editingComplaintId && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setEditingComplaintId(null);
                      setDescription("");
                      setPhoto(null);
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 
                             rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </motion.button>
                )}
              </div>
            </form>
          </div>

          {/* Complaints History */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black">
              Your Reports
              <div className="h-2 w-20 bg-[#FF1493] mt-2 rounded-full"></div>
            </h2>

            {complaints.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-8 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_#FF1493] text-center"
              >
                <div className="text-6xl mb-4">📝</div>
                <p className="text-lg font-medium">No reports submitted yet</p>
                <p className="text-gray-600 mt-2">
                  Your reports will appear here
                </p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {complaints.map((complaint, index) => (
                  <motion.div
                    key={complaint._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-xl border-4 border-black hover:shadow-[8px_8px_0px_0px_#FF1493] transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm font-mono text-gray-500">Posted on:</p>
                        <p className="text-gray-700 font-mono">
                          {new Date(complaint.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(complaint)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-full
                                   hover:bg-blue-100 transition-colors"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(complaint._id)}
                          className="p-2 bg-red-50 text-red-600 rounded-full
                                   hover:bg-red-100 transition-colors"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                    <p className="text-gray-700">{complaint.description}</p>
                    {complaint.photo && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="mt-4 rounded-lg overflow-hidden shadow-sm"
                      >
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                            complaint.photo
                          }`}
                          alt="Complaint"
                          className="w-full h-64 object-cover hover:scale-105 transition-transform"
                        />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Complaints;
