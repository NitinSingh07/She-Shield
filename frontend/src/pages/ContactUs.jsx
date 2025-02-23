import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    const response = await fetch("https://formspree.io/f/xpwqjjdd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setStatus("Message sent successfully!");
      setFormData({ name: "", phone: "", message: "" }); // Clear form
    } else {
      setStatus("Error sending message. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_#FF1493] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#FF1493] p-6 text-white text-center border-b-4 border-black">
              <h2 className="text-3xl font-black">Get in Touch</h2>
              <p className="mt-2 font-medium">
                We're here to help and answer any questions you might have
              </p>
            </div>

            {/* Contact Form */}
            <div className="p-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                {[
                  { name: "name", label: "Name", type: "text" },
                  { name: "phone", label: "Phone no.", type: "tel" },
                  { name: "message", label: "Message", type: "textarea" },
                ].map((field) => (
                  <div key={field.name} className="relative">
                    <label className="block text-lg font-bold text-gray-700 mb-2">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] focus:shadow-none transform transition-all duration-200 focus:translate-x-1 focus:translate-y-1 focus:outline-none"
                        rows="4"
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] focus:shadow-none transform transition-all duration-200 focus:translate-x-1 focus:translate-y-1 focus:outline-none"
                      />
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  className="w-full bg-[#FF1493] text-white p-4 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
                >
                  Send Message
                </button>
              </form>

              {status && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 rounded-xl border-2 border-black bg-pink-50 text-center font-bold"
                >
                  {status}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;
