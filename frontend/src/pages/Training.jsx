import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Training = () => {
  const { token, setMessage } = useAuth();
  const [trainings, setTrainings] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainings = async () => {
      const response = await axios.get("http://localhost:5000/api/training");
      setTrainings(response.data);
    };
    fetchTrainings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/training",
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTitle(""); // Clear the input
      setMessage("Training module submitted successfully!");
      navigate("/"); // Redirect to home on successful submission
    } catch (error) {
      setMessage("Failed to submit training module.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Self-Defense Training Modules</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md mb-4"
      >
        <input
          type="text"
          placeholder="Training Module Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 mb-4 w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Training Module
        </button>
      </form>
      <ul className="list-disc list-inside">
        {trainings.map((training) => (
          <li key={training._id} className="mb-2">
            {training.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Training;
