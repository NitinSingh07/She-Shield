import React from "react";

const Notification = ({ message, type }) => {
  if (!message) return null;

  const notificationStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded shadow-md ${notificationStyles[type]}`}
    >
      {message}
    </div>
  );
};

export default Notification;
