import React, { useEffect, useState } from 'react';
import './HelpPage.css';

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
      setError('Geolocation is not supported by this browser.');
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
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch nearby places.');
      }

      const data = await response.json();
      const allPlaces = data.elements;

      const hospitals = allPlaces.filter((place) => place.tags.amenity === 'hospital');
      const policeStations = allPlaces.filter((place) => place.tags.amenity === 'police');

      setHospitals(hospitals);
      setPoliceStations(policeStations);
    } catch (error) {
      setError('Failed to fetch nearby places.');
    }
  };

  const handlePlaceClick = (place, event) => {
    const rect = event.target.getBoundingClientRect();
    setPopupPosition({ top: rect.top + window.scrollY + 10, left: rect.left + window.scrollX + 10 });
    setSelectedPlace(place);
  };

  return (
    <div>
      <h1><b>HOSPITALS AND POLICE STATIONS</b></h1>
      {error && <p className="error">Error: {error}</p>}
      {location ? (
        <div>
          <h2>Nearby Hospitals</h2>
          <div className="card-container">
            {hospitals.map((place) => (
              <div
                className="card"
                key={place.id}
                onClick={(event) => handlePlaceClick(place, event)}
              >
                <strong>{place.tags.name || 'Unnamed Hospital'}</strong>
                <p>{place.tags.amenity}</p>
              </div>
            ))}
          </div>

          <h2>Nearby Police Stations</h2>
          <div className="card-container">
            {policeStations.map((place) => (
              <div
                className="card"
                key={place.id}
                onClick={(event) => handlePlaceClick(place, event)}
              >
                <strong>{place.tags.name || 'Unnamed Police Station'}</strong>
                <p>{place.tags.amenity}</p>
              </div>
            ))}
          </div>

          {selectedPlace && (
            <div
              className="popup"
              style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }}
            >
              <h3><b>{selectedPlace.tags.name || 'Unnamed'}</b></h3>
              <p>Amenity: {selectedPlace.tags.amenity}</p>
              <button
              className="directions-button"
              onClick={() => {
                const { latitude, longitude } = location; 
                const { lat, lon } = selectedPlace; 
                
                const directionsUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${latitude},${longitude};${lat},${lon}`;

                window.open(directionsUrl, '_blank');
                }}
>
  Get Directions
</button>

            </div>
          )}
        </div>
      ) : (
        <p className="loading">Loading your location...</p>
      )}
    </div>
  );
};

export default HelpPage;
