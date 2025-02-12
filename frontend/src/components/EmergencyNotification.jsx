import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { motion, AnimatePresence } from "framer-motion";

export default function EmergencyNotification() {
  const [notifications, setNotifications] = useState([]);
  const [audio] = useState(new Audio("/alert-sound.mp3")); // Create audio instance once
  const { socket, isEmergencySender } = useSocket();

  // Pre-load the audio
  useEffect(() => {
    audio.load();
  }, [audio]);

  useEffect(() => {
    if (!socket) return;

    const handleEmergencyAlert = async (alert) => {
      // Add new notification
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...alert,
        },
      ]);

      // Play sound for all users except sender
      if (!isEmergencySender) {
        try {
          // Try to play immediately
          await audio.play();
        } catch (error) {
          // If autoplay fails, try playing on next user interaction
          const playOnInteraction = () => {
            audio.play();
            document.removeEventListener("click", playOnInteraction);
          };
          document.addEventListener("click", playOnInteraction);
        }
      }
    };

    socket.on("emergency_alert", handleEmergencyAlert);

    return () => {
      socket.off("emergency_alert", handleEmergencyAlert);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [socket, audio, isEmergencySender]);

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
