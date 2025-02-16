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
    <div className="flex h-screen rounded-3xl">
      {/* Left Side - Map */}
      <div className="w-1/2 h-screen p-4">
        <div className="h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
          <div id="map" className="h-full w-full"></div>
        </div>
      </div>

      {/* Right Side - Details */}
      <div className="w-1/2 h-screen p-4">
        <div className="h-full flex flex-col gap-4">
          {/* Header Section - Made More Compact */}
          <div className="bg-white rounded-2xl shadow-lg p-3">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <ShieldExclamationIcon className="h-6 w-6 text-red-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-600">
                Women Crime Analytics
              </span>
            </h2>
            {userLocation && cyberCrimesData.length > 0 && (
              <div className="mt-1 p-1.5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <p className="text-xs font-medium text-blue-800 flex items-center gap-1">
                  <MapPinIcon className="h-3 w-3" />
                  Your Current Location : {cyberCrimesData[0].state_ut} (
                  {userLocation.lat} , {userLocation.lng})
                </p>
              </div>

            )}
          </div>

          {/* Stats Grid - More Compact Layout */}
          <div className="grid grid-cols-3 gap-3 flex-none">
            {cyberCrimesData.length > 0 && (
              <>
                {/* Total Cases Card - Spans Full Width */}
                <div className="col-span-3 p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white flex justify-between items-center">
                  <h3 className="text-sm font-semibold">Total Cyber Crimes</h3>
                  <p className="text-2xl font-bold">
                    {cyberCrimesData[0].total_cyber_crimes_against_women}
                  </p>
                </div>

                {/* Make stat cards span 1/3 width each */}
                <CompactStatCard
                  title="Cyber Blackmailing"
                  value={
                    cyberCrimesData[0]
                      .cyber_blackmailing__threatening__sec_506__503__384_ipc_r_w_it_act_
                  }
                  icon={<ExclamationTriangleIcon className="h-4 w-4" />}
                  gradient="from-red-100 to-red-200"
                  textColor="text-red-700"
                />

                <CompactStatCard
                  title="Cyber Stalking"
                  value={
                    cyberCrimesData[0]
                      .cyber_stalking__cyber_bullying_of_women__sec_354d_ipc_r_w_it_act_
                  }
                  icon={<UserGroupIcon className="h-4 w-4" />}
                  gradient="from-purple-100 to-purple-200"
                  textColor="text-purple-700"
                />

                <CompactStatCard
                  title="Cyber Pornography"
                  value={
                    cyberCrimesData[0]
                      .cyber_pornography__hosting__publishing_obscene_sexual_materials__sec_67a_67b_girl_child__of_it_act_r_w_other_ipc_sll_
                  }
                  icon={<ExclamationTriangleIcon className="h-4 w-4" />}
                  gradient="from-pink-100 to-pink-200"
                  textColor="text-pink-700"
                />

                <CompactStatCard
                  title="Defamation"
                  value={
                    cyberCrimesData[0]
                      .defamation__morphing__sec_469_ipc_r_w_ipc_and_indecent_rep__of_women__p__act___it_act_
                  }
                  icon={<DocumentDuplicateIcon className="h-4 w-4" />}
                  gradient="from-indigo-100 to-indigo-200"
                  textColor="text-indigo-700"
                />

                <CompactStatCard
                  title="Fake Profiles"
                  value={cyberCrimesData[0].fake_profile__it_act_r_w_ipc_sll_}
                  icon={<UserIcon className="h-4 w-4" />}
                  gradient="from-orange-100 to-orange-200"
                  textColor="text-orange-700"
                />

                <CompactStatCard
                  title="Other Crimes"
                  value={cyberCrimesData[0].other_crimes_against_women}
                  icon={<ExclamationTriangleIcon className="h-4 w-4" />}
                  gradient="from-green-100 to-green-200"
                  textColor="text-green-700"
                />
              </>
            )}
          </div>

          {/* Chart Section - Fills Remaining Space */}
          {cyberCrimesData.length > 0 && (
            <div className="flex-1 bg-white rounded-xl shadow-lg relative overflow-hidden group">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-20"></div>

              <div className="relative z-10 p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                      Crime Distribution Analysis
                    </h3>
                    <p className="text-sm text-gray-500">
                      State-wise breakdown of cyber crimes
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {["Day", "Week", "Month", "Year"].map((period) => (
                      <button
                        key={period}
                        className="px-3 py-1 text-xs font-medium rounded-full 
                                 bg-gray-100 text-gray-600 hover:bg-purple-100 
                                 hover:text-purple-600 transition-colors"
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 relative min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareChartData(cyberCrimesData)}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 90, bottom: 20 }}
                    >
                      <defs>
                        {prepareChartData(cyberCrimesData).map(
                          (entry, index) => (
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
                          )
                        )}
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
                        width={85}
                        stroke="#94a3b8"
                        strokeWidth={0.5}
                        style={{
                          fontSize: "12px",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: "500",
                        }}
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
                        radius={[6, 6, 6, 6]}
                        barSize={24}
                        animationDuration={1500}
                      >
                        {prepareChartData(cyberCrimesData).map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`url(#barGradient-${index})`}
                              className="transition-all duration-300 hover:brightness-110 hover:scale-x-105 origin-left"
                              style={{
                                filter:
                                  "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1))",
                              }}
                            />
                          )
                        )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {prepareChartData(cyberCrimesData).map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-xs text-gray-600 font-medium">
                        {entry.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Update CompactStatCard for more compact design
const CompactStatCard = ({ title, value, icon, gradient, textColor }) => (
  <div
    className={`p-2.5 rounded-xl bg-gradient-to-r ${gradient} hover:scale-[1.02] transition-transform duration-300`}
  >
    <div className="flex items-center gap-1.5 mb-1">
      <div className={textColor}>{icon}</div>
      <h4 className="text-xs font-medium text-gray-800">{title}</h4>
    </div>
    <p className={`text-lg font-bold ${textColor}`}>{value}</p>
  </div>
);

// Tip Component
// const Tip = ({ icon, text }) => (
//   <div className="flex items-center gap-1 bg-white/50 rounded-full px-3 py-1">
//     <span className="text-green-600">{icon}</span>
//     <span className="text-xs text-green-800">{text}</span>
//   </div>
// );

export default Map;
