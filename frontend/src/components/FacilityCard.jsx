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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
      {/* Header Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          {/* Facility Icon & Name */}
          <div className="flex items-start space-x-3">
            <div
              className={`p-3 rounded-lg ${
                type === "hospital" ? "bg-red-50" : "bg-blue-50"
              }`}
            >
              {type === "hospital" ? (
                <svg
                  className="w-6 h-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {facility.tags.name || `Unnamed ${type}`}
              </h3>
              <div className="flex items-center mt-1 space-x-2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <span className="text-sm text-gray-500">
                  {distance} km away
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium 
            ${
              isOpen
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {isOpen ? "Open Now" : "Status Unknown"}
          </div>
        </div>
      </div>

      {/* Body Section */}
      <div className="p-4 space-y-4">
        {/* Working Hours */}
        <div className="flex items-center text-sm">
          <svg
            className="w-5 h-5 text-gray-400 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span
            className={`font-medium ${
              isOpen ? "text-green-600" : "text-red-600"
            }`}
          >
            {hours}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-0.5 focus:outline-none"
              >
                <svg
                  className={`w-5 h-5 ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-500">({rating || 0}/5)</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-2">
          <button
            onClick={onNavigate}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
              />
            </svg>
            Navigate
          </button>
          <button
            onClick={handleCopyLocation}
            className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            title="Copy location"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Details Section */}
      {showDetails && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm">
            {Object.entries(facility.tags).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <dt className="text-gray-500 capitalize">
                  {key.replace(/_/g, " ")}
                </dt>
                <dd className="text-gray-900 font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg
            className={`w-5 h-5 mr-1 transition-transform ${
              showDetails ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
          {showDetails ? "Show less" : "Show more"}
        </button>
      </div>
    </div>
  );
};

export default FacilityCard;
