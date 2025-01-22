import React, { useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Complaints = () => {
  const { token, showNotification } = useAuth(); // Use showNotification
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/complaints",
        { description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDescription(""); // Clear the input
      showNotification("Complaint submitted successfully!", "success"); // Use showNotification
      navigate("/"); // Redirect to home on successful submission
    } catch (error) {
      showNotification("Failed to submit complaint.", "error"); // Use showNotification
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Submit a Complaint</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <textarea
          placeholder="Describe your complaint"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border p-2 mb-4 w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
};

export default Complaints;
