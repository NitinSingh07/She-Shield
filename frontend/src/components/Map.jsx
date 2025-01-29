import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
        <div class="popup-content">
          <h3>${record.state_ut}</h3>
          <ul>
            <li>Cyber Blackmailing/Threatening: ${record.cyber_blackmailing__threatening__sec_506__503__384_ipc_r_w_it_act_}</li>
            <li>Cyber Pornography: ${record.cyber_pornography__hosting__publishing_obscene_sexual_materials__sec_67a_67b_girl_child__of_it_act_r_w_other_ipc_sll_}</li>
            <li>Cyber Stalking: ${record.cyber_stalking__cyber_bullying_of_women__sec_354d_ipc_r_w_it_act_}</li>
            <li>Defamation/Morphing: ${record.defamation__morphing__sec_469_ipc_r_w_ipc_and_indecent_rep__of_women__p__act___it_act_}</li>
            <li>Fake Profile: ${record.fake_profile__it_act_r_w_ipc_sll_}</li>
            <li>Other Crimes: ${record.other_crimes_against_women}</li>
            <li><strong>Total Crimes: ${record.total_cyber_crimes_against_women}</strong></li>
          </ul>
        </div>
      `;

      //   L.marker([record.latitude, record.longitude])
      //     .addTo(newMarkersLayer)

      //     .bindPopup(popupContent);
    });

    setMarkersLayer(newMarkersLayer);
  }, [cyberCrimesData, map]);

  return (
    <div className="App">
      <h2 className="text-2xl font-bold mb-4">Cyber Crimes against Women</h2>

      {/* Map Display */}
      <div id="map" style={{ height: "500px", width: "100%" }}></div>

      {/* Info Panel */}
      <div className="info-panel p-4 bg-gray-100">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : !userLocation ? (
          <p className="text-gray-700">Loading location...</p>
        ) : (
          <div>
            {cyberCrimesData.length > 0 && (
              <div className="crime-statistics bg-white p-4 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-3">
                  You are in {cyberCrimesData[0].state_ut}
                </h3>
                <p className="text-lg mb-4">
                  Your Coordinates: {userLocation.lat},{" "}
                  {userLocation.lng}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat-card p-3 bg-gray-50 rounded">
                    <h4 className="font-medium">
                      Cyber Blackmailing/Threatening
                    </h4>
                    <p className="text-lg">
                      {
                        cyberCrimesData[0]
                          .cyber_blackmailing__threatening__sec_506__503__384_ipc_r_w_it_act_
                      }
                    </p>
                  </div>
                  <div className="stat-card p-3 bg-gray-50 rounded">
                    <h4 className="font-medium">Cyber Pornography</h4>
                    <p className="text-lg">
                      {
                        cyberCrimesData[0]
                          .cyber_pornography__hosting__publishing_obscene_sexual_materials__sec_67a_67b_girl_child__of_it_act_r_w_other_ipc_sll_
                      }
                    </p>
                  </div>
                  <div className="stat-card p-3 bg-gray-50 rounded">
                    <h4 className="font-medium">Cyber Stalking</h4>
                    <p className="text-lg">
                      {
                        cyberCrimesData[0]
                          .cyber_stalking__cyber_bullying_of_women__sec_354d_ipc_r_w_it_act_
                      }
                    </p>
                  </div>
                  <div className="stat-card p-3 bg-gray-50 rounded">
                    <h4 className="font-medium">Defamation/Morphing</h4>
                    <p className="text-lg">
                      {
                        cyberCrimesData[0]
                          .defamation__morphing__sec_469_ipc_r_w_ipc_and_indecent_rep__of_women__p__act___it_act_
                      }
                    </p>
                  </div>
                  <div className="stat-card p-3 bg-gray-50 rounded">
                    <h4 className="font-medium">Fake Profile</h4>
                    <p className="text-lg">
                      {cyberCrimesData[0].fake_profile__it_act_r_w_ipc_sll_}
                    </p>
                  </div>
                  <div className="stat-card p-3 bg-gray-50 rounded">
                    <h4 className="font-medium">Other Crimes</h4>
                    <p className="text-lg">
                      {cyberCrimesData[0].other_crimes_against_women}
                    </p>
                  </div>
                  <div className="stat-card p-3 bg-blue-50 rounded col-span-2">
                    <h4 className="font-medium">Total Cyber Crimes</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {cyberCrimesData[0].total_cyber_crimes_against_women}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* JSON Data Display */}
      <div className="data-panel p-4">
        <h2 className="text-xl font-bold mb-2">Cyber Crime Data</h2>
        {cyberCrimesData.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">State</th>
                <th className="border border-gray-300 px-4 py-2">
                  Total Crimes
                </th>
                <th className="border border-gray-300 px-4 py-2">Latitude</th>
                <th className="border border-gray-300 px-4 py-2">Longitude</th>
              </tr>
            </thead>
            <tbody>
              {cyberCrimesData.map((record, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2">
                    {record.state_ut}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {record.total_cyber_crimes_against_women}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {record.latitude}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {record.longitude}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-700">No data available</p>
        )}
      </div>
    </div>
  );
};

export default Map;
