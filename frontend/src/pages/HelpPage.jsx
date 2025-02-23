import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

// Add this animated background component
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 90, 0],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-[#FF1493] to-pink-200 opacity-20 blur-3xl"
    />
    <motion.div
      animate={{
        scale: [1, 1.5, 1],
        rotate: [0, -90, 0],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 1 }}
      className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-pink-200 to-[#FF1493] opacity-20 blur-3xl"
    />
  </div>
);

// Update FacilityCard border styles
const FacilityCard = ({
  place,
  type,
  location,
  onCall,
  onGetDirections,
  calculateDistance,
}) => {
  const isHospital = type === "hospital";
  const distance = calculateDistance(
    location.latitude,
    location.longitude,
    place.lat,
    place.lon
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="relative bg-white p-6 rounded-xl border border-black hover:shadow-[8px_8px_0px_0px_#FF1493] transition-all duration-300"
    >
      {/* Creative Status Indicator */}
      {/* <div className="absolute top-4 right-4 flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-3 h-3 rounded-full ${
            isHospital ? "bg-[#FF1493]" : "bg-blue-600"
          }`}
        />
        <span className="text-xs font-bold">
          {isHospital ? "Emergency Ready" : "On Duty"}
        </span>
      </div> */}

      {/* Enhanced Distance Badge */}
      {/* <div className="absolute -top-4 -left-4 transform -rotate-6">
        <motion.div
          whileHover={{ rotate: 0 }}
          className={`
            px-4 py-2 ${isHospital ? "bg-[#FF1493]" : "bg-blue-600"} text-white
            rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000]
            transition-all duration-300
          `}
        >
          <span className="text-lg font-bold">{distance}km</span>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-white border-2 border-black"></div>
        </motion.div>
      </div> */}

      {/* Facility Icon & Details */}
      <div className="flex items-start space-x-4">
        <div
          className={`
          p-3 rounded-xl border border-black shadow-[4px_4px_0px_0px_#000]
          ${isHospital ? "bg-pink-50" : "bg-blue-50"}
        `}
        >
          {isHospital ? (
            <svg
              className="w-8 h-8 text-[#FF1493]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          ) : (
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-black">
            {place.tags.name ||
              `Unnamed ${isHospital ? "Hospital" : "Police Station"}`}
          </h3>
          <p className="mt-1 text-sm font-medium text-gray-600">
            {place.tags.amenity || type}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-3">
        <button
          onClick={onGetDirections}
          className="flex-1 flex items-center justify-center px-4 py-3 bg-white rounded-xl font-bold border border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Directions
        </button>
        <button
          onClick={onCall}
          className={`
            px-6 py-3 rounded-xl font-bold border border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200 text-white
            ${isHospital ? "bg-[#FF1493]" : "bg-blue-600"}
          `}
        >
          Call Now
        </button>
      </div>

      {/* Add facility status indicators */}
      <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
        <div className="flex justify-between text-xs font-medium">
          <span
            className={`${isHospital ? "text-[#FF1493]" : "text-blue-600"}`}
          >
            ⏰ 24/7 Available
          </span>
          <span className="text-gray-600">
            📍{" "}
            {calculateDistance(
              location.latitude,
              location.longitude,
              place.lat,
              place.lon
            )}
            km away
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const HelpPage = () => {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
  const [error, setError] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [selectedTab, setSelectedTab] = useState("all");
  const [showEmergencyPanel, setShowEmergencyPanel] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: "Police", number: "100", status: "active" },
    { name: "Ambulance", number: "102", status: "active" },
    { name: "Fire", number: "101", status: "active" },
    { name: "Women Helpline", number: "1091", status: "active" },
  ]);
  const [selectedFacility, setSelectedFacility] = useState(null);

  const fetchNearbyPlaces = async (latitude, longitude) => {
    const radius = 20000; // 20km radius

    // Rest of the query remains same
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="police"](around:${radius},${latitude},${longitude});
        way["amenity"="police"](around:${radius},${latitude},${longitude});
        node["police"](around:${radius},${latitude},${longitude});
        way["police"](around:${radius},${latitude},${longitude});
        
        node["amenity"="hospital"](around:${radius},${latitude},${longitude});
        way["amenity"="hospital"](around:${radius},${latitude},${longitude});
      );
      out body;
      >;
      out skel qt;
    `;

    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (!data.elements) throw new Error("No data received from API");

      // Filter and sort by distance within 20km
      const filterByDistance = (places) => {
        return places
          .filter((place) => {
            const distance = calculateDistance(
              latitude,
              longitude,
              place.lat,
              place.lon
            );
            return distance <= 15; // Only show places within 20km
          })
          .sort((a, b) => a.distance - b.distance);
      };

      // Process police stations
      const police = filterByDistance(
        data.elements
          .filter(
            (place) =>
              place.tags &&
              (place.tags.amenity === "police" || place.tags.police)
          )
          .map((station) => ({
            ...station,
            type: "police",
            isOpen: true,
            distance: calculateDistance(
              latitude,
              longitude,
              station.lat,
              station.lon
            ),
          }))
      );

      // Process hospitals
      const hospitals = filterByDistance(
        data.elements
          .filter((place) => place.tags && place.tags.amenity === "hospital")
          .map((hospital) => ({
            ...hospital,
            type: "hospital",
            isOpen: true,
            distance: calculateDistance(
              latitude,
              longitude,
              hospital.lat,
              hospital.lon
            ),
          }))
      );

      console.log(
        `Found ${hospitals.length} hospitals and ${police.length} police stations within 20km`
      );

      setHospitals(hospitals);
      setPoliceStations(police);

      if (police.length === 0 && hospitals.length === 0) {
        setError("No emergency services found within 20km of your location.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(`Failed to fetch nearby places: ${error.message}`);
    }
  };

  // Add this new function to handle failed requests
  const handleFetchRetry = useCallback(
    async (latitude, longitude, retryCount = 0) => {
      try {
        await fetchNearbyPlaces(latitude, longitude);
      } catch (error) {
        if (retryCount < 3) {
          setTimeout(
            () => handleFetchRetry(latitude, longitude, retryCount + 1),
            2000
          );
        } else {
          setError(
            "Unable to fetch emergency services after multiple attempts"
          );
        }
      }
    },
    []
  );

  // Update useEffect to use the retry handler
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          handleFetchRetry(latitude, longitude);
        },
        (err) => {
          setError(err.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, [handleFetchRetry]);

  const handlePlaceClick = (place, event) => {
    const rect = event.target.getBoundingClientRect();
    setPopupPosition({
      top: rect.top + window.scrollY + 10,
      left: rect.left + window.scrollX + 10,
    });
    setSelectedPlace(place);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const handleEmergencyCall = useCallback((number) => {
    window.location.href = `tel:${number}`;
  }, []);

  const sendEmergencySMS = useCallback(async (contacts) => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const message = `EMERGENCY! I need help! Location: https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;

      if ("share" in navigator) {
        await navigator.share({
          title: "Emergency Alert",
          text: message,
          url: `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`,
        });
      } else {
        window.location.href = `sms:${contacts.join(
          ","
        )}?body=${encodeURIComponent(message)}`;
      }
    } catch (error) {
      setError("Failed to send emergency SMS");
    }
  }, []);

  // Add this function to filter facilities based on selected tab
  const getFilteredFacilities = () => {
    switch (selectedTab) {
      case "hospitals":
        return { hospitals, policeStations: [] };
      case "police":
        return { hospitals: [], policeStations };
      default:
        return { hospitals, policeStations };
    }
  };

  const EmergencyPanel = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl border border-black shadow-[8px_8px_0px_0px_#FF1493] w-full max-w-2xl"
      >
        <div className="bg-[#FF1493] px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h3 className="text-xl font-bold text-white">
            Emergency Response Panel
          </h3>
          <button
            onClick={() => setShowEmergencyPanel(false)}
            className="text-white hover:text-pink-200 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Emergency Buttons */}
            <button
              onClick={() => handleEmergencyCall("112")}
              className="flex items-center justify-center space-x-2 bg-white p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#FF1493] hover:shadow-none transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
            >
              <svg
                className="w-6 h-6 text-[#FF1493]" /* ...existing SVG... */
              />
              <span className="font-bold text-[#FF1493]">Call Emergency</span>
            </button>

            <button
              onClick={() =>
                sendEmergencySMS(emergencyContacts.map((c) => c.number))
              }
              className="flex items-center justify-center space-x-2 bg-white p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
            >
              <svg
                className="w-6 h-6 text-blue-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
              <span className="font-medium text-blue-700">Send SOS</span>
            </button>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-[#FFF5F7] rounded-xl p-4 border-2 border-black">
            <h4 className="font-bold text-black mb-4 flex items-center justify-between">
              Emergency Contacts
              <button className="text-sm text-[#FF1493] hover:text-black transition-colors">
                Add Contact
              </button>
            </h4>

            <div className="space-y-2">
              {emergencyContacts.map((contact) => (
                <div
                  key={contact.name}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div>
                    <span className="font-medium">{contact.name}</span>
                    <p className="text-sm text-gray-500">{contact.number}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEmergencyCall(contact.number)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => sendEmergencySMS([contact.number])}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderFacilities = () => {
    const { hospitals, policeStations } = getFilteredFacilities();
    return (
      <div className="space-y-8">
        {/* Hospitals Section */}
        {hospitals.length > 0 && (
          <section className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_#FF1493] overflow-hidden">
            <div className="border-b-4 border-black bg-pink-50 px-6 py-4">
              <h2 className="text-2xl font-bold text-[#FF1493]">
                Emergency Medical Services
              </h2>
              <p className="text-sm font-medium text-gray-600 mt-1">
                Nearby hospitals and medical facilities
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map((place) => (
                <FacilityCard
                  key={place.id}
                  place={place}
                  type="hospital"
                  location={location}
                  calculateDistance={calculateDistance} // Pass the function here
                  onCall={() => handleEmergencyCall(place.tags.phone || "112")}
                  onGetDirections={(e) => {
                    e.stopPropagation();
                    window.open(
                      `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${location.latitude},${location.longitude};${place.lat},${place.lon}`,
                      "_blank"
                    );
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Police Stations Section */}
        {policeStations.length > 0 && (
          <section className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_#FF1493] overflow-hidden">
            <div className="border-b-4 border-black bg-blue-50 px-6 py-4">
              <h2 className="text-2xl font-bold text-blue-600">
                Law Enforcement
              </h2>
              <p className="text-sm font-medium text-gray-600 mt-1">
                Nearby police stations
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {policeStations.map((place) => (
                <FacilityCard
                  key={place.id}
                  place={place}
                  type="police"
                  location={location}
                  calculateDistance={calculateDistance} // Pass the function here
                  onCall={() => handleEmergencyCall(place.tags.phone || "100")}
                  onGetDirections={(e) => {
                    e.stopPropagation();
                    window.open(
                      `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${location.latitude},${location.longitude};${place.lat},${place.lon}`,
                      "_blank"
                    );
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] pt-24">
      <Navbar />
      <AnimatedBackground />
      {showEmergencyPanel && <EmergencyPanel />}

      <div className="container mx-auto px-4 py-6">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-black text-black">
            Emergency Services Hub
            <div className="h-2 w-32 bg-[#FF1493] mx-auto mt-2 rounded-full"></div>
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Quick access to nearby hospitals and police stations. Help is just a
            click away.
          </p>
        </motion.div>

        {/* Enhanced Stats Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Stats cards with creative styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-black shadow-[4px_4px_0px_0px_#FF1493]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#FF1493]">
                  Nearest Hospital
                </p>
                <h3 className="text-xl font-bold text-black">
                  {hospitals[0]?.tags.name || "Searching..."}
                </h3>
              </div>
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-[#FF1493] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF1493]"></span>
              </span>
            </div>
            {/* ...existing distance content... */}
          </motion.div>
          {/* ...other status cards... */}
        </motion.div>

        {/* Enhanced Filter Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 flex space-x-4 justify-center"
        >
          {["all", "hospitals", "police"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`
                px-6 py-2 rounded-xl font-bold border border-black transition-all duration-200 flex items-center space-x-2
                ${
                  selectedTab === tab
                    ? "bg-[#FF1493] text-white shadow-[4px_4px_0px_0px_#000]"
                    : "bg-white text-black hover:shadow-[4px_4px_0px_0px_#FF1493]"
                }
              `}
            >
              {tab === "hospitals" && (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              )}
              {tab === "police" && (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 6v18h18V6H3zm4 4h10M7 16h10M7 12h10"
                  />
                </svg>
              )}
              {tab === "all" && (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              )}
              <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </button>
          ))}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-white border border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#FF1493]"
          >
            {/* ...existing error content... */}
          </motion.div>
        )}

        {/* Main Content with Filtered Results */}
        {location ? (
          renderFacilities()
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-[60vh] flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 border-4 border-[#FF1493] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">
              Locating nearest emergency services...
            </p>
          </motion.div>
        )}
      </div>

      {/* Enhanced Emergency Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowEmergencyPanel(true)}
        className="fixed bottom-6 right-6 z-40"
      >
        <span className="absolute inset-0 rounded-xl bg-[#FF1493] animate-ping opacity-25"></span>
        <div className="relative flex items-center justify-center w-16 h-16 bg-[#FF1493] text-white rounded-xl border border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none transform hover:translate-x-1 hover:translate-y-1 transition-all duration-200">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5"
            />
          </svg>
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
        </div>
      </motion.button>
      <Footer />
    </div>
  );
};

export default HelpPage;
