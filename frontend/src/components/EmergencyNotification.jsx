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
    // Only show notifications if user is not the emergency sender
    !isEmergencySender && (
      <div className="fixed top-4 right-4 z-50">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-xl mb-4"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Emergency Alert
                  </h3>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="text-gray-700 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-3">

                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <p className="text-white">
                      <span className="font-semibold">Coordinates:</span>{" "}
                      {notification.location &&
                        `${notification.location.latitude.toFixed(
                          6
                        )}, ${notification.location.longitude.toFixed(6)}`}
                    </p>
                  </div>

                  {notification.message && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <p className="text-white">
                        <span className="font-semibold">Message:</span>{" "}
                        {notification.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-sm text-white/80">
                  Emergency services have been notified of this location. Stay
                  calm and remain in a safe place.
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )
  );
}
