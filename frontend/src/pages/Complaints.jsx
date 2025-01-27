import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
// Add these imports at the top
import { FiEdit2, FiTrash2 } from "react-icons/fi";

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
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Previous Complaints */}
      <div className="w-1/2 p-6 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
          Your Complaints History
        </h2>
        <div className="space-y-6">
          {complaints.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">You havenot submitted any complaints yet.</p>
              <p className="text-gray-400 mt-2">Your submitted complaints will appear here.</p>
            </div>
          ) : (
            complaints.map((complaint) => (
              <div
                key={complaint._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500">Posted on</p>
                    <p className="text-sm font-medium text-gray-700">
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
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(complaint)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                      title="Edit complaint"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(complaint._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                      title="Delete complaint"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                  {complaint.description}
                </p>
                {complaint.photo && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                        complaint.photo
                      }`}
                      alt="Complaint"
                      className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Side - Submit Complaint Form */}
      <div className="w-1/2 p-6">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px] resize-none"
                placeholder="Please describe your complaint..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo (Optional)
              </label>
              <input
                type="file"
                onChange={(e) => setPhoto(e.target.files[0])}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="image/*"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                {editingComplaintId ? "Update Complaint" : "Submit Complaint"}
              </button>
              {editingComplaintId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingComplaintId(null);
                    setDescription("");
                    setPhoto(null);
                  }}
                  className="flex-1 bg-gray-500 text-white py-2.5 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Complaints;
