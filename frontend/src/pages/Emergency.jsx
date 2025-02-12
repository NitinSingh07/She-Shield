import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellAlertIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSocket } from "../context/SocketContext";

export default function EmergencySection() {
  const [alertSent, setAlertSent] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [currentTip, setCurrentTip] = useState(0);
  const [error, setError] = useState(null);
  const [alertDetails, setAlertDetails] = useState(null);
  const { setIsEmergencySender } = useSocket();

  const images = [
    {
      src: "/help3.jpg",
      alt: "Women Safety Training",
      fallback: "/default3.jpg",
    },
    {
      src: "help2.jpg",
      alt: "Emergency Contact Support",
      fallback: "/default2.jpg",
    },
    {
      src: "help.jpg",
      alt: "Emergency Help in Action",
      fallback: "/default1.jpg",
    },
    { src: "help4.jpg", alt: "Community Support", fallback: "/default4.jpg" },
  ];

  const emergencyTips = [
    "Stay calm and focused",
    "Share your live location",
    "Make noise to attract attention",
    "Run towards crowded areas",
  ];

  useEffect(() => {
    let tipInterval;
    try {
      tipInterval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % emergencyTips.length);
      }, 3000);
    } catch (err) {
      setError("Failed to initialize tips rotation");
    }
    return () => {
      if (tipInterval) clearInterval(tipInterval);
    };
  }, []);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        resolve(null);
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Error getting location:", error);
          resolve(null);
        }
      );
    });
  };

  const getLocationDetails = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${
          import.meta.env.VITE_OPENCAGE_API_KEY
        }`
      );
      const data = await response.json();

      if (data.results && data.results[0]) {
        const components = data.results[0].components;
        return {
          city:
            components.city ||
            components.town ||
            components.village ||
            "Unknown City",
          state: components.state || "Unknown State",
          formatted: data.results[0].formatted,
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting location details:", error);
      return null;
    }
  };

  const handleEmergencyClick = async () => {
    try {
      setAlertSent(true);
      setIsEmergencySender(true);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setTimeout(() => {
              setAlertSent(false);
              setCountdown(3);
              setIsEmergencySender(false);
            }, 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Get current location
      const location = navigator.geolocation
        ? await getCurrentLocation()
        : null;

      // Get location details if coordinates are available
      let locationDetails = null;
      if (location) {
        locationDetails = await getLocationDetails(
          location.latitude,
          location.longitude
        );
        setAlertDetails({
          city: locationDetails?.city || "Unknown City",
          state: locationDetails?.state || "Unknown State",
          coordinates: location
            ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(
                6
              )}`
            : "Not available",
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      // Create alert message with location details
      const alertMessage = locationDetails
        ? `Immediate assistance needed in ${locationDetails.city}, ${locationDetails.state}!`
        : "EMERGENCY ALERT: Someone needs immediate assistance!";

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/emergency/alert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: alertMessage,
            location: location,
            locationDetails: locationDetails,
            timestamp: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to send emergency alert: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Alert sent successfully:", data);
    } catch (err) {
      console.error("Error details:", err);
      setError("Failed to send emergency alert. Please try again.");
      setAlertSent(false);
      setIsEmergencySender(false);
    }
  };

  const handleImageError = (event, fallbackSrc) => {
    event.target.src = fallbackSrc;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <ExclamationCircleIcon className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-red-700 mt-4">{error}</h2>
          <button
            onClick={() => setError(null)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      <div className="min-h-screen relative flex flex-col lg:flex-row items-center justify-between bg-gradient-to-br from-yellow-300 via-red-500 to-orange-500 text-gray-900 p-4 md:p-8">
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              animate={{
                scale: [1, 2, 1],
                x: [0, 100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                delay: i * 2,
              }}
              style={{
                width: `${100 + i * 50}px`,
                height: `${100 + i * 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Left side - Emergency Controls */}
        <div className="z-10 flex flex-col items-center justify-center space-y-8 w-full lg:w-1/2 p-4 md:p-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-black text-white text-center bg-clip-text"
          >
            Emergency Response Hub
          </motion.h1>

          {/* Floating Emergency Tips */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTip}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-xl text-white/90 text-center font-medium"
            >
              Tip: {emergencyTips[currentTip]}
            </motion.p>
          </AnimatePresence>

          {/* Emergency Button */}
          <motion.div
            className="relative"
            animate={
              alertSent
                ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }
                : {}
            }
            transition={{ duration: 0.5, repeat: alertSent ? Infinity : 0 }}
          >
            <button
              onClick={handleEmergencyClick}
              disabled={alertSent}
              className="relative bg-gradient-to-br from-red-600 to-pink-600 text-white px-12 py-6 text-2xl font-bold rounded-full shadow-2xl flex items-center gap-4 border-4 border-white/50 transition-all hover:scale-105 focus:outline-none disabled:opacity-75"
            >
              {alertSent ? (
                <>
                  <ShieldCheckIcon className="w-10 h-10" />
                  Sending Alert ({countdown})
                </>
              ) : (
                <>
                  <BellAlertIcon className="w-10 h-10 animate-pulse" />
                  Activate Emergency
                </>
              )}
            </button>
            {/* Ripple effect */}
            {alertSent && (
              <div className="absolute inset-0 animate-ping rounded-full bg-red-500/50" />
            )}
          </motion.div>

          {/* Alert Details */}
          <AnimatePresence>
            {alertSent && alertDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">
                      Alert Details
                    </h3>
                    <span className="text-sm text-white/80">
                      {alertDetails.timestamp}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <p className="text-white">
                        <span className="font-semibold">Location:</span>{" "}
                        {alertDetails.city}, {alertDetails.state}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <p className="text-white">
                        <span className="font-semibold">Coordinates:</span>{" "}
                        {alertDetails.coordinates}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-white/80">
                    Emergency services have been notified of your location. Stay
                    calm and remain in a safe place.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status message */}
          <AnimatePresence>
            {alertSent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-white text-center space-y-2"
              >
                <p className="text-xl font-semibold">
                  Alert Activation In Progress
                </p>
                <div className="flex justify-center gap-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 bg-white rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right side - Image Gallery */}
        <div className="z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-1/2 p-4 md:p-8">
          {images.map((img, index) => (
            <motion.div
              key={index}
              className="relative aspect-square"
              whileHover={{ scale: 1.05, rotate: index % 2 ? 3 : -3 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <img
                src={img.src}
                alt={img.alt}
                onError={(e) => handleImageError(e, img.fallback)}
                className="rounded-2xl shadow-2xl border-4 border-white/50 object-cover w-full h-full"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
