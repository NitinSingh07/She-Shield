import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";

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

  const EmergencyPanel = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        <div className="bg-red-600 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">
            Emergency Response Panel
          </h3>
          <button
            onClick={() => setShowEmergencyPanel(false)}
            className="text-white hover:text-red-100"
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
            <button
              onClick={() => handleEmergencyCall("112")}
              className="flex items-center justify-center space-x-2 bg-red-100 p-4 rounded-lg hover:bg-red-200 transition-colors"
            >
              <svg
                className="w-6 h-6 text-red-700"
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
              <span className="font-medium text-red-700">Call Emergency</span>
            </button>
            <button
              onClick={() =>
                sendEmergencySMS(emergencyContacts.map((c) => c.number))
              }
              className="flex items-center justify-center space-x-2 bg-blue-100 p-4 rounded-lg hover:bg-blue-200 transition-colors"
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
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center justify-between">
              Emergency Contacts
              <button className="text-sm text-blue-600 hover:text-blue-800">
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
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {showEmergencyPanel && <EmergencyPanel />}

      <div className="container mx-auto px-4 py-6">
        {/* Status Dashboard */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nearest Hospital</p>
                <h3 className="text-xl font-semibold text-gray-900">
                  {hospitals[0]?.tags.name || "Searching..."}
                </h3>
              </div>
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {hospitals[0]
                ? `${calculateDistance(
                    location?.latitude,
                    location?.longitude,
                    hospitals[0].lat,
                    hospitals[0].lon
                  )}km away`
                : "Calculating..."}
            </p>
          </div>

          {/* Additional status cards... */}
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {["all", "hospitals", "police"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    selectedTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Main content sections with conditional rendering based on selectedTab */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-red-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {location ? (
          <div className="space-y-8">
            {/* Medical Services Section */}
            <section className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                <h2 className="text-xl font-semibold text-slate-800">
                  Emergency Medical Services
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Nearby hospitals and medical facilities
                </p>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hospitals.map((place) => (
                  <div
                    key={place.id}
                    className="group relative bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {calculateDistance(
                          location.latitude,
                          location.longitude,
                          place.lat,
                          place.lon
                        )}
                        km
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start">
                        <div className="shrink-0">
                          <svg
                            className="w-6 h-6 text-red-600"
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
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-slate-900">
                            {place.tags.name || "Unnamed Hospital"}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {place.tags.amenity}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const { latitude, longitude } = location;
                            const { lat, lon } = place;
                            window.open(
                              `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${latitude},${longitude};${lat},${lon}`,
                              "_blank"
                            );
                          }}
                          className="flex-1 flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
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
                        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600">
                          Call Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Police Stations Section - Similar professional styling */}
              <section className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                  <h2 className="text-xl font-semibold text-slate-800">
                    Law Enforcement
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Nearby police stations
                  </p>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {policeStations.length > 0 ? (
                    policeStations.map((place) => (
                      <div
                        key={place.id}
                        className="group relative bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="absolute top-4 right-4 z-10">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {calculateDistance(
                              location.latitude,
                              location.longitude,
                              place.lat,
                              place.lon
                            )}
                            km
                          </span>
                        </div>

                        <div className="p-5">
                          <div className="flex items-start">
                            <div className="shrink-0">
                              <svg
                                className="w-6 h-6 text-blue-600"
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
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-medium text-slate-900">
                                {place.tags.name || "Unnamed Police Station"}
                              </h3>
                              <p className="mt-1 text-sm text-slate-500">
                                {place.tags.amenity}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex space-x-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const { latitude, longitude } = location;
                                const { lat, lon } = place;
                                window.open(
                                  `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${latitude},${longitude};${lat},${lon}`,
                                  "_blank"
                                );
                              }}
                              className="flex-1 flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
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
                            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                              Call Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full p-8 text-center">
                      <p className="text-gray-500">
                        Searching for nearby police stations... If none appear,
                        try refreshing the page.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </section>
          </div>
        ) : (
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-slate-200 border-t-red-600 animate-spin"></div>
              </div>
              <p className="mt-4 text-base font-medium text-slate-600">
                Accessing location services...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Action Button */}
      <button
        onClick={() => setShowEmergencyPanel(true)}
        className="fixed bottom-6 right-6 z-40 group"
      >
        <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-25"></span>
        <div className="relative flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors">
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default HelpPage;
