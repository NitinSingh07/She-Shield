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
    <div className="min-h-screen bg-[#FFF5F7]">
      <Navbar />

      <div className="pt-24 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_#FF1493] p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black text-black mb-4">
            Emergency Response Hub
            <div className="h-2 w-32 bg-[#FF1493] mt-2 rounded-full"></div>
          </h1>

          {/* Emergency Tips */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTip}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-pink-50 p-4 rounded-xl border-2 border-black"
            >
              <span className="text-[#FF1493] font-bold">Safety Tip: </span>
              {emergencyTips[currentTip]}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Emergency Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Emergency Button */}
            <motion.button
              onClick={handleEmergencyClick}
              disabled={alertSent}
              className={`
                w-full p-8 rounded-xl border-4 border-black 
                ${alertSent ? "bg-red-500" : "bg-[#FF1493]"} 
                text-white font-bold text-xl
                shadow-[8px_8px_0px_0px_#000] hover:shadow-none 
                transform hover:translate-x-2 hover:translate-y-2 
                transition-all duration-200
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center gap-4">
                {alertSent ? (
                  <>
                    <ShieldCheckIcon className="w-8 h-8" />
                    <span>Sending Alert ({countdown})</span>
                  </>
                ) : (
                  <>
                    <BellAlertIcon className="w-8 h-8" />
                    <span>Activate Emergency Response</span>
                  </>
                )}
              </div>
            </motion.button>

            {/* Alert Details Card */}
            {alertSent && alertDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-pink-100 p-6 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_#FF1493]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-black">
                      Alert Details
                    </h3>
                    <span className="text-sm text-black/80">
                      {alertDetails.timestamp}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <p className="text-black">
                        <span className="font-semibold">Location:</span>{" "}
                        {alertDetails.city}, {alertDetails.state}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <p className="text-black">
                        <span className="font-semibold">Coordinates:</span>{" "}
                        {alertDetails.coordinates}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-black/80">
                    Emergency services have been notified of your location. Stay
                    calm and remain in a safe place.
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Image Gallery */}
          <div className="grid grid-cols-2 gap-4">
            {images.map((img, index) => (
              <motion.div
                key={index}
                className="relative aspect-square"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  onError={(e) => handleImageError(e, img.fallback)}
                  className="w-full h-full object-cover rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#FF1493]"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
