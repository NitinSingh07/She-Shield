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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-red-50 to-orange-100 relative">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Complaints History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className="text-4xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4 
                         flex items-center space-x-3"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-red-500 to-orange-400">
                Your Complaints
              </span>
            </h2>
            <div className="space-y-6">
              {complaints.length === 0 ? (
                <motion.div
                  className="bg-white rounded-2xl p-8 text-center shadow-md"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-lg text-gray-600">
                    No complaints submitted yet.
                  </p>
                  <p className="text-gray-500 mt-2">
                    Your complaints will appear here once submitted.
                  </p>
                </motion.div>
              ) : (
                complaints.map((complaint, index) => (
                  <motion.div
                    key={complaint._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg
                             transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Posted on:</p>
                        <p className="text-gray-700 font-medium">
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
                ))
              )}
            </div>
          </motion.div>

          {/* Submit Complaint Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
              <h2
                className="text-3xl font-bold mb-6 bg-clip-text text-transparent 
                           bg-gradient-to-r from-yellow-500 via-red-500 to-orange-400"
              >
                {editingComplaintId ? "Edit Complaint" : "Submit a Complaint"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full p-4 border border-gray-200 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             text-gray-700 placeholder-gray-400 bg-gray-50
                             resize-none min-h-[150px]"
                    placeholder="Describe your complaint..."
                  />
                </div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="relative group"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo (Optional)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    className="w-full text-sm text-gray-500
                             file:mr-4 file:py-2 file:px-4 file:rounded-full
                             file:border-0 file:bg-blue-50 file:text-blue-700
                             hover:file:bg-blue-100 file:transition-colors"
                    accept="image/*"
                  />
                </motion.div>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-yellow-400 via-red-500 to-orange-400
                             text-white py-3 px-6 rounded-xl font-medium
                             hover:opacity-90 transition-all duration-300
                             shadow-md hover:shadow-lg"
                  >
                    {editingComplaintId
                      ? "Update Complaint"
                      : "Submit Complaint"}
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Complaints;
