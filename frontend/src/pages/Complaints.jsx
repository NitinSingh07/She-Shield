import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
// Add these imports at the top
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Navbar from "../components/Navbar";

const Complaints = () => {
  const { token, showNotification } = useAuth(); // Remove user since we don't need it anymore
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
      // No need to filter here as backend handles it
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
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-gray-50 via-blue-50 to-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-12">
          {/* Complaints History */}
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6 border-b pb-4">
              Your Complaints
            </h2>
            <div className="space-y-6">
              {complaints.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500">
                    No complaints submitted yet.
                  </p>
                  <p className="text-gray-400 mt-2">
                    Your complaints will appear here once submitted.
                  </p>
                </div>
              ) : (
                complaints.map((complaint) => (
                  <div
                    key={complaint._id}
                    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
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
                        <button
                          onClick={() => handleEdit(complaint)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                          title="Edit"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(complaint._id)}
                          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                          title="Delete"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {complaint.description}
                    </p>
                    {complaint.photo && (
                      <div className="mt-4">
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                            complaint.photo
                          }`}
                          alt="Complaint"
                          className="w-full h-64 object-cover rounded-lg shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Submit Complaint Form */}
          <div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {editingComplaintId ? "Edit Complaint" : "Submit a Complaint"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[150px]"
                    placeholder="Describe your complaint..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Photo (Optional)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                    accept="image/*"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium"
                  >
                    {editingComplaintId
                      ? "Update Complaint"
                      : "Submit Complaint"}
                  </button>
                  {editingComplaintId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingComplaintId(null);
                        setDescription("");
                        setPhoto(null);
                      }}
                      className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl hover:bg-gray-600 transition-all duration-300 font-medium"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaints;
