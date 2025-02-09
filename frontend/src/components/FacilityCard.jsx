import React, { useState, useCallback } from "react";

const FacilityCard = ({ facility, distance, type, onNavigate }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [rating, setRating] = useState(facility.rating || 0);

  const getWorkingHours = useCallback(() => {
    const now = new Date();
    const day = now.getDay();
    const time = now.getHours() * 100 + now.getMinutes();

    // Parse opening hours if available
    const openingHours = facility.tags.opening_hours;
    if (!openingHours) return { isOpen: null, hours: "Hours not available" };

    // Simple parsing for common format "Mo-Fr 09:00-17:00"
    const isOpen = time >= 900 && time <= 1700 && day >= 1 && day <= 5;
    return { isOpen, hours: openingHours };
  }, [facility.tags.opening_hours]);

  const { isOpen, hours } = getWorkingHours();

  const handleCopyLocation = () => {
    const locationText = `${
      facility.tags.name || "Facility"
    } - https://www.google.com/maps?q=${facility.lat},${facility.lon}`;
    navigator.clipboard
      .writeText(locationText)
      .then(() => alert("Location copied to clipboard"))
      .catch(() => alert("Failed to copy location"));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <div
              className={`p-3 rounded-lg ${
                type === "hospital" ? "bg-red-50" : "bg-blue-50"
              }`}
            >
              {type === "hospital" ? (
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
              ) : (
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
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                  />
                </svg>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {facility.tags.name || `Unnamed ${type}`}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{distance} km away</p>
            </div>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              facility.isOpen
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {facility.isOpen ? "Open" : "Status Unknown"}
          </span>
        </div>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              {Object.entries(facility.tags).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <dt className="text-gray-500">{key}</dt>
                  <dd className="font-medium text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="mt-4 space-y-4">
          {/* Working Hours */}
          <div className="flex items-center text-sm">
            <svg
              className="w-5 h-5 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span
              className={`font-medium ${
                isOpen ? "text-green-600" : "text-red-600"
              }`}
            >
              {isOpen ? "Open Now" : "Closed"} • {hours}
            </span>
          </div>

          {/* Rating System */}
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-1 ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onNavigate}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Navigate
            </button>
            <button
              onClick={handleCopyLocation}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
              title="Copy location"
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
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {showDetails ? "Less info" : "More info"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacilityCard;
