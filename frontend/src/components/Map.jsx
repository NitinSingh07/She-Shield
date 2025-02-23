import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPinIcon,
  ShieldExclamationIcon,
  UserIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/solid";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

// Add this state coordinates mapping at the top of the file, outside the component
const stateCoordinates = {
  "andhra pradesh": { lat: 15.9129, lng: 79.74 },
  "arunachal pradesh": { lat: 28.218, lng: 94.7278 },
  assam: { lat: 26.2006, lng: 92.9376 },
  bihar: { lat: 25.0961, lng: 85.3131 },
  chhattisgarh: { lat: 21.2787, lng: 81.8661 },
  goa: { lat: 15.2993, lng: 74.124 },
  gujarat: { lat: 22.2587, lng: 71.1924 },
  haryana: { lat: 29.0588, lng: 76.0856 },
  "himachal pradesh": { lat: 31.1048, lng: 77.1734 },
  jharkhand: { lat: 23.6102, lng: 85.2799 },
  karnataka: { lat: 15.3173, lng: 75.7139 },
  kerala: { lat: 10.8505, lng: 76.2711 },
  "madhya pradesh": { lat: 22.9734, lng: 78.6569 },
  maharashtra: { lat: 19.7515, lng: 75.7139 },
  manipur: { lat: 24.6637, lng: 93.9063 },
  meghalaya: { lat: 25.467, lng: 91.3662 },
  mizoram: { lat: 23.1645, lng: 92.9376 },
  nagaland: { lat: 26.1584, lng: 94.5624 },
  odisha: { lat: 20.9517, lng: 85.0985 },
  punjab: { lat: 31.1471, lng: 75.3412 },
  rajasthan: { lat: 27.0238, lng: 74.2179 },
  sikkim: { lat: 27.533, lng: 88.5122 },
  "tamil nadu": { lat: 11.1271, lng: 78.6569 },
  telangana: { lat: 18.1124, lng: 79.0193 },
  tripura: { lat: 23.9408, lng: 91.9882 },
  "uttar pradesh": { lat: 26.8467, lng: 80.9462 },
  uttarakhand: { lat: 30.0668, lng: 79.0193 },
  "west bengal": { lat: 22.9868, lng: 87.855 },
  delhi: { lat: 28.6139, lng: 77.209 },
};

// Add India's boundaries
const INDIA_BOUNDS = {
  north: 35.513327,
  south: 6.4626999,
  west: 68.1766451,
  east: 97.395561,
};

const Map = () => {
  const [cyberCrimesData, setCyberCrimesData] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);
  const [markersLayer, setMarkersLayer] = useState(null);
  const [stateName, setStateName] = useState(null);

  // Get User Location & Detect State
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError("Failed to get location");
      }
    );
  }, []);

  // Fetch Cyber Crime Data based on Detected State
  useEffect(() => {
    if (!userLocation) return;

    const fetchCrimeData = async () => {
      try {
        // Reverse Geocoding to get state name
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${userLocation.lat}&lon=${userLocation.lng}&format=json`
        );
        const locationData = await response.json();
        const state = locationData.address.state.trim().toLowerCase();
        console.log("Detected State:", state);

        // Fetch cyber crime data for the detected state
        const crimeResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/cyber-crimes?state=${state}`
        );
        const crimeData = await crimeResponse.json();
        console.log("Fetched Cyber Crime Data:", crimeData);

        // Add coordinates to the crime data
        const enrichedData = crimeData.records.map((record) => ({
          ...record,
          latitude: stateCoordinates[record.state_ut.toLowerCase()]?.lat,
          longitude: stateCoordinates[record.state_ut.toLowerCase()]?.lng,
        }));

        const validatedData = enrichedData.filter(
          (record) =>
            record.state_ut.trim().toLowerCase() === state &&
            record.latitude !== undefined &&
            record.longitude !== undefined
        );

        console.log("Validated Data:", validatedData);
        setCyberCrimesData(validatedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      }
    };

    fetchCrimeData();
  }, [userLocation, map]);

  // Update map initialization
  useEffect(() => {
    if (!userLocation || map) return;

    const newMap = L.map("map", {
      minZoom: 4,
      maxZoom: 8,
      maxBounds: [
        [INDIA_BOUNDS.south - 1, INDIA_BOUNDS.west - 1],
        [INDIA_BOUNDS.north + 1, INDIA_BOUNDS.east + 1],
      ],
    }).setView([20.5937, 78.9629], 5); // Center of India

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      bounds: [
        [INDIA_BOUNDS.south, INDIA_BOUNDS.west],
        [INDIA_BOUNDS.north, INDIA_BOUNDS.east],
      ],
    }).addTo(newMap);

    // Add India outline
    fetch("/india.geojson") // You'll need to add this file to your public folder
      .then((response) => response.json())
      .then((data) => {
        L.geoJSON(data, {
          style: {
            color: "#ff6b6b",
            weight: 2,
            fillColor: "#ffe8e8",
            fillOpacity: 0.1,
          },
        }).addTo(newMap);
      });

    setMap(newMap);
  }, [userLocation]);

  // Update Markers when Crime Data Changes
  useEffect(() => {
    if (!map || !userLocation) return;

    if (markersLayer) {
      markersLayer.clearLayers();
    }

    const newMarkersLayer = L.layerGroup().addTo(map);

    // Add User Location Marker
    L.marker([userLocation.lat, userLocation.lng], {
      icon: L.icon({
        iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        iconSize: [32, 32],
      }),
    })
      .addTo(newMarkersLayer)
      .bindPopup("You are here")
      .openPopup();

    // Add Cyber Crime Data Markers with detailed information
    cyberCrimesData.forEach((record) => {
      const popupContent = `
        <div class="p-4 max-w-sm bg-white rounded-lg shadow-lg">
          <h3 class="text-lg font-bold text-gray-800 mb-3 border-b pb-2">${record.state_ut}</h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Cyber Blackmailing:</span>
              <span class="font-semibold text-red-600">${record.cyber_blackmailing__threatening__sec_506__503__384_ipc_r_w_it_act_}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Cyber Pornography:</span>
              <span class="font-semibold text-pink-600">${record.cyber_pornography__hosting__publishing_obscene_sexual_materials__sec_67a_67b_girl_child__of_it_act_r_w_other_ipc_sll_}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Cyber Stalking:</span>
              <span class="font-semibold text-purple-600">${record.cyber_stalking__cyber_bullying_of_women__sec_354d_ipc_r_w_it_act_}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Defamation/Morphing:</span>
              <span class="font-semibold text-indigo-600">${record.defamation__morphing__sec_469_ipc_r_w_ipc_and_indecent_rep__of_women__p__act___it_act_}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Fake Profile:</span>
              <span class="font-semibold text-orange-600">${record.fake_profile__it_act_r_w_ipc_sll_}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Other Crimes:</span>
              <span class="font-semibold text-green-600">${record.other_crimes_against_women}</span>
            </div>
            <div class="flex justify-between items-center pt-2 border-t mt-2 bg-blue-50 p-2 rounded-lg">
              <span class="text-sm font-bold text-gray-700">Total Crimes:</span>
              <span class="font-bold text-blue-600">${record.total_cyber_crimes_against_women}</span>
            </div>
          </div>
        </div>
      `;

      //   L.marker([record.latitude, record.longitude])
      //     .addTo(newMarkersLayer)
      //     .bindPopup(popupContent);
    });

    setMarkersLayer(newMarkersLayer);
  }, [cyberCrimesData, map]);

  // Add this function to prepare complete chart data
  const prepareChartData = (data) => {
    if (!data.length) return [];
    return [
      {
        name: "Blackmailing",
        value:
          data[0]
            .cyber_blackmailing__threatening__sec_506__503__384_ipc_r_w_it_act_,
        color: "#ef4444",
      },
      {
        name: "Stalking",
        value:
          data[0]
            .cyber_stalking__cyber_bullying_of_women__sec_354d_ipc_r_w_it_act_,
        color: "#8b5cf6",
      },
      {
        name: "Pornography",
        value:
          data[0]
            .cyber_pornography__hosting__publishing_obscene_sexual_materials__sec_67a_67b_girl_child__of_it_act_r_w_other_ipc_sll_,
        color: "#ec4899",
      },
      {
        name: "Fake Profile",
        value: data[0].fake_profile__it_act_r_w_ipc_sll_,
        color: "#f97316",
      },
      {
        name: "Defamation",
        value:
          data[0]
            .defamation__morphing__sec_469_ipc_r_w_ipc_and_indecent_rep__of_women__p__act___it_act_,
        color: "#6366f1",
      },
      {
        name: "Other Crimes",
        value: data[0].other_crimes_against_women,
        color: "#22c55e",
      },
    ];
  };

  return (
    <div className="relative flex h-[75vh] rounded-3xl z-0">
      {" "}
      {/* Reduced height */}
      {/* Left Side - Map */}
      <div className="w-1/3 p-2">
        {" "}
        {/* Reduced width and padding */}
        <div className="relative h-full rounded-2xl overflow-hidden border-2 border-black bg-white">
          {/* Loading State */}
          {!map && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-[#FF1493] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading map...</p>
              </div>
            </div>
          )}

          <div id="map" className="h-full w-full"></div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 bg-white rounded-xl border border-black shadow-[4px_4px_0px_0px_#FF1493] p-2 space-y-2">
            <button
              onClick={() => map?.setZoom((map.getZoom() || 5) + 1)}
              className="p-2 hover:bg-pink-50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" /* ...existing svg... */ />
            </button>
            <button
              onClick={() => map?.setZoom((map.getZoom() || 5) - 1)}
              className="p-2 hover:bg-pink-50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" /* ...existing svg... */ />
            </button>
          </div>
        </div>
      </div>
      {/* Right Side - Analytics */}
      <div className="w-2/3 p-2">
        {" "}
        {/* Increased width and reduced padding */}
        <div className="h-full flex flex-col gap-2">
          {" "}
          {/* Reduced gap */}
          {/* Header */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 border-2 border-black hover:shadow-[4px_4px_0px_0px_#FF1493] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF1493] to-pink-400 flex items-center justify-center border border-black">
                  <ShieldExclamationIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#FF1493] to-purple-600">
                    Crime Analytics Dashboard
                  </h2>
                  {userLocation && cyberCrimesData.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPinIcon className="h-3 w-3 text-blue-600" />
                      <p className="text-xs font-medium text-blue-800">
                        {cyberCrimesData[0].state_ut}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Real-time Indicator */}
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-black">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-green-700">
                  Live Data
                </span>
              </div>
            </div>
          </div>
          {/* Stats Grid */}
          <div className="grid grid-cols-6 gap-2">
            {" "}
            {/* Changed to 6 columns */}
            {cyberCrimesData.length > 0 && (
              <>
                <div className="col-span-6 p-2 rounded-xl border-2 border-black bg-gradient-to-r from-[#FF1493] to-pink-500">
                  <div className="relative z-10 flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-bold">
                        Total Cyber Crimes
                      </h3>
                      <p className="text-3xl font-black text-white mt-1">
                        {cyberCrimesData[0].total_cyber_crimes_against_women}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
                      <ExclamationTriangleIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-10 rounded-full transform -translate-x-12 translate-y-12"></div>
                </div>

                {/* Stat Cards */}
                {prepareChartData(cyberCrimesData).map((stat, index) => (
                  <CompactStatCard
                    key={index}
                    title={stat.name}
                    value={stat.value}
                    icon={getIconForStat(stat.name)}
                    gradient={`from-${stat.color}/10 to-${stat.color}/20`}
                    textColor={`text-${stat.color}`}
                  />
                ))}
              </>
            )}
          </div>
          {/* Chart Section */}
          <div className="flex-1 min-h-0 bg-white rounded-xl border-2 border-black relative overflow-hidden">
            <div className="relative z-10 p-3 h-full flex flex-col">
              {" "}
              {/* Reduced padding */}
              {/* Chart Header */}
              <div className="flex justify-between items-center mb-1">
                {" "}
                {/* Reduced margin */}
                <h3 className="text-base font-bold">Crime Distribution</h3>
                <div className="flex gap-1 bg-gray-50 p-1 rounded-lg border border-black">
                  {["D", "W", "M", "Y"].map((period) => (
                    <button
                      key={period}
                      className="px-2 py-0.5 text-xs font-bold rounded-md hover:bg-[#FF1493] hover:text-white"
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              {/* Chart Container */}
              <div className="flex-1 -mx-2">
                {" "}
                {/* Adjusted margin */}
                <ResponsiveContainer width="100%" height={280}>
                  {" "}
                  {/* Fixed height */}
                  <BarChart
                    data={prepareChartData(cyberCrimesData)}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
                  >
                    <defs>
                      {prepareChartData(cyberCrimesData).map((entry, index) => (
                        <linearGradient
                          key={`gradient-${index}`}
                          id={`barGradient-${index}`}
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop
                            offset="0%"
                            stopColor={entry.color}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor={entry.color}
                            stopOpacity={0.4}
                          />
                        </linearGradient>
                      ))}
                    </defs>

                    <XAxis
                      type="number"
                      stroke="#94a3b8"
                      strokeWidth={0.5}
                      style={{
                        fontSize: "12px",
                        fontFamily: "Inter, sans-serif",
                      }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={60}
                      fontSize={10}
                      tick={{ fill: "#666" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(224, 231, 255, 0.2)" }}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.97)",
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        padding: "12px",
                      }}
                      labelStyle={{ color: "#374151", fontWeight: 600 }}
                    />
                    <Bar
                      dataKey="value"
                      barSize={16}
                      radius={[6, 6, 6, 6]}
                      animationDuration={1500}
                    >
                      {prepareChartData(cyberCrimesData).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`url(#barGradient-${index})`}
                          className="transition-all duration-300 hover:brightness-110 hover:scale-x-105 origin-left"
                          style={{
                            filter:
                              "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1))",
                          }}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Compact Legend */}
              <div className="flex flex-wrap gap-1 mt-1 px-1">
                {prepareChartData(cyberCrimesData).map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded-md"
                  >
                    {/* <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    /> */}
                    {/* <span className="text-[10px] font-medium text-gray-600">
                      {entry.name}
                    </span> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated CompactStatCard for better space efficiency
const CompactStatCard = ({ title, value, icon, gradient, textColor }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`p-2 rounded-lg border border-black shadow-[1px_1px_0px_0px_#000] 
                bg-gradient-to-br ${gradient} hover:shadow-none transform 
                hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200`}
  >
    <div className="flex items-center gap-1">
      <div className={`p-1 rounded-md bg-white/50 ${textColor}`}>{icon}</div>
      <h4 className="text-[10px] font-bold text-gray-800 truncate">{title}</h4>
    </div>
    <p className={`text-sm font-black ${textColor} mt-1`}>{value}</p>
  </motion.div>
);

// Helper function to get icons
const getIconForStat = (name) => {
  // ...implement icon mapping based on stat name
};

export default Map;
