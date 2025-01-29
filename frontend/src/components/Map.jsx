import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPinIcon,
  ShieldExclamationIcon,
  UserIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/solid";

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
          `http://localhost:5000/api/cyber-crimes?state=${state}`
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
  }, [userLocation]);

  // Initialize Map & Add Markers
  useEffect(() => {
    if (!userLocation || map) return;

    const newMap = L.map("map").setView(
      [userLocation.lat, userLocation.lng],
      6
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(newMap);

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
        <div class="p-4 max-w-sm">
          <h3 class="text-lg font-bold text-gray-800 mb-3">${record.state_ut}</h3>
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
            <div class="flex justify-between items-center pt-2 border-t mt-2">
              <span class="text-sm font-bold text-gray-700">Total Crimes:</span>
              <span class="font-bold text-blue-600">${record.total_cyber_crimes_against_women}</span>
            </div>
          </div>
        </div>
      `;

      L.marker([record.latitude, record.longitude])
        .addTo(newMarkersLayer)
        .bindPopup(popupContent);
    });

    setMarkersLayer(newMarkersLayer);
  }, [cyberCrimesData, map]);

  return (
    <div className="App bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center justify-center gap-2">
        <ShieldExclamationIcon className="h-8 w-8 text-red-500" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-600">
          Cyber Crimes against Women in our Country
        </span>
      </h2>

      {/* Map Display */}
      <div
        id="map"
        className="rounded-xl shadow-lg overflow-hidden"
        style={{ height: "500px", width: "100%" }}
      ></div>

      {/* Info Panel */}
      <div className="info-panel mt-6 rounded-xl bg-white shadow-lg p-6">
        {error ? (
          <p className="text-red-500 flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5" />
            {error}
          </p>
        ) : !userLocation ? (
          <p className="text-gray-700 animate-pulse flex items-center gap-2">
            <MapPinIcon className="h-5 w-5" />
            Loading location...
          </p>
        ) : (
          <div>
            {cyberCrimesData.length > 0 && (
              <div className="crime-statistics">
                <div className="mb-6 border-b pb-4">
                  <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                    <UserIcon className="h-6 w-6 text-blue-500" />
                    You are in {cyberCrimesData[0].state_ut}
                  </h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                    Coordinates: {userLocation.lat.toFixed(4)},{" "}
                    {userLocation.lng.toFixed(4)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="stat-card p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                      <h4 className="font-medium text-gray-800">
                        Cyber Blackmailing
                      </h4>
                    </div>
                    <p className="text-2xl font-bold text-red-600">
                      {
                        cyberCrimesData[0]
                          .cyber_blackmailing__threatening__sec_506__503__384_ipc_r_w_it_act_
                      }
                    </p>
                  </div>

                  <div className="stat-card p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <UserGroupIcon className="h-5 w-5 text-purple-500" />
                      <h4 className="font-medium text-gray-800">
                        Cyber Stalking
                      </h4>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      {
                        cyberCrimesData[0]
                          .cyber_stalking__cyber_bullying_of_women__sec_354d_ipc_r_w_it_act_
                      }
                    </p>
                  </div>

                  <div className="stat-card p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <DocumentDuplicateIcon className="h-5 w-5 text-orange-500" />
                      <h4 className="font-medium text-gray-800">
                        Fake Profiles
                      </h4>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">
                      {cyberCrimesData[0].fake_profile__it_act_r_w_ipc_sll_}
                    </p>
                  </div>

                  <div className="stat-card p-4 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-pink-500" />
                      <h4 className="font-medium text-gray-800">
                        Cyber Pornography
                      </h4>
                    </div>
                    <p className="text-2xl font-bold text-pink-600">
                      {
                        cyberCrimesData[0]
                          .cyber_pornography__hosting__publishing_obscene_sexual_materials__sec_67a_67b_girl_child__of_it_act_r_w_other_ipc_sll_
                      }
                    </p>
                  </div>

                  <div className="stat-card p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <UserIcon className="h-5 w-5 text-indigo-500" />
                      <h4 className="font-medium text-gray-800">
                        Defamation/Morphing
                      </h4>
                    </div>
                    <p className="text-2xl font-bold text-indigo-600">
                      {
                        cyberCrimesData[0]
                          .defamation__morphing__sec_469_ipc_r_w_ipc_and_indecent_rep__of_women__p__act___it_act_
                      }
                    </p>
                  </div>

                  <div className="stat-card p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-green-500" />
                      <h4 className="font-medium text-gray-800">
                        Other Crimes
                      </h4>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {cyberCrimesData[0].other_crimes_against_women}
                    </p>
                  </div>

                  <div className="stat-card p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 col-span-full hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-blue-500" />
                      <h4 className="font-medium text-gray-800">
                        Total Cyber Crimes
                      </h4>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-3xl font-bold text-blue-600">
                        {cyberCrimesData[0].total_cyber_crimes_against_women}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Total reported cases in {cyberCrimesData[0].state_ut}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="data-panel mt-6 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <DocumentDuplicateIcon className="h-6 w-6 text-gray-600" />
          Cyber Crime Data
        </h2>
        {cyberCrimesData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Total Crimes
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Coordinates
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cyberCrimesData.map((record, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {record.state_ut}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-600 font-semibold">
                      {record.total_cyber_crimes_against_women}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {record.latitude.toFixed(4)},{" "}
                      {record.longitude.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No data available</p>
        )}
      </div>
    </div>
  );
};

export default Map;
