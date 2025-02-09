import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const HelpPage = () => {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
  const [error, setError] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          fetchNearbyPlaces(latitude, longitude);
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchNearbyPlaces = async (latitude, longitude) => {
    const radius = 5000;
    const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:${radius}, ${latitude}, ${longitude});
        node["amenity"="police"](around:${radius}, ${latitude}, ${longitude});
      );
      out body;
    `;

    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch nearby places.");
      }

      const data = await response.json();
      const allPlaces = data.elements;

      setHospitals(
        allPlaces.filter((place) => place.tags.amenity === "hospital")
      );
      setPoliceStations(
        allPlaces.filter((place) => place.tags.amenity === "police")
      );
    } catch (error) {
      setError("Failed to fetch nearby places.");
    }
  };

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
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
             Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
             Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100">
      <Navbar />
      <div className="container mx-auto p-8 relative">
        {/* Emergency Contact Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button className="animate-pulse bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>EMERGENCY</span>
          </button>
        </div>

        {error && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-3 rounded-lg shadow-xl animate-pulse backdrop-blur-sm border border-red-400">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {location ? (
          <div className="space-y-12 relative z-10">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 z-0 overflow-hidden">
              <div className="absolute -top-10 -left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <section className="mb-16">
              <div className="flex items-center justify-center mb-8 space-x-4">
                <div className="w-16 h-1 bg-orange-500 rounded-full"></div>
                <h2 className="text-5xl font-black text-orange-900 text-center">
                  <span className="inline-block transform hover:scale-110 transition-transform duration-300">🏥</span>
                  <span className="bg-gradient-to-r from-orange-600 to-rose-600 text-transparent bg-clip-text"> Medical Help</span>
                </h2>
                <div className="w-16 h-1 bg-orange-500 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hospitals.map((place) => (
                  <div
                    key={place.id}
                    className="group relative overflow-hidden rounded-2xl perspective-1000"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-rose-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500 z-0"></div>
                    <div className="relative bg-white/80 backdrop-blur-lg p-6 transform transition-all duration-500 group-hover:translate-z-10 border border-orange-100 shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] rounded-2xl">
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {calculateDistance(location.latitude, location.longitude, place.lat, place.lon)}km away
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-orange-100 rounded-full">
                          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-orange-900 group-hover:text-orange-700">
                          {place.tags.name || "Unnamed Hospital"}
                        </h3>
                      </div>

                      <div className="space-y-4">
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
                          className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          <span>Navigate Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-4xl font-black mb-8 text-orange-900 text-center">
                <span className="inline-block transform hover:scale-110 transition-transform duration-300">
                  🚔
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                  {" "}
                  Police Stations
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {policeStations.map((place) => (
                  <div
                    key={place.id}
                    className="group relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/40 hover:bg-white/60 transition-all duration-500 border border-white/20 hover:border-blue-200 shadow-lg hover:shadow-2xl transform hover:-translate-y-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="p-6 relative z-10">
                      <h3 className="text-2xl font-bold text-blue-900 mb-3 group-hover:text-blue-700">
                        {place.tags.name || "Unnamed Police Station"}
                      </h3>
                      <p className="text-blue-700/70">{place.tags.amenity}</p>
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
                        className="mt-4 inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-sm transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <span className="mr-2">📍</span> Get Directions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-32 h-32 relative">
                <div className="absolute inset-0 rounded-full border-8 border-orange-200 border-t-orange-500 animate-spin"></div>
                <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-rose-500 animate-spin" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl animate-bounce">📍</span>
                </div>
              </div>
              <p className="mt-8 text-2xl font-medium text-orange-800 animate-pulse">
                Locating nearby emergency services...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpPage;
