import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { motion, AnimatePresence } from "framer-motion";

export default function EmergencyNotification() {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("emergency_alert", (alert) => {
      // Add new notification
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...alert,
        },
      ]);

      // Play alert sound
      const audio = new Audio("/alert-sound.mp3"); // Add an alert sound file to your public folder
      audio.play().catch((err) => console.log("Audio play failed:", err));
    });

    return () => {
      socket.off("emergency_alert");
    };
  }, [socket]);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="bg-red-600 text-white p-4 rounded-lg shadow-lg mb-2 max-w-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">Emergency Alert!</h3>
                <p className="mt-1">{notification.message}</p>
                {notification.location && (
                  <p className="text-sm mt-1">
                    Location: {notification.location.latitude.toFixed(6)},
                    {notification.location.longitude.toFixed(6)}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
