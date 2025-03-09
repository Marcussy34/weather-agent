import React, { useState } from "react";

const CitySearch = ({ onCitySelect }) => {
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const popularCities = [
    "London",
    "New York",
    "Tokyo",
    "Paris",
    "Sydney",
    "Berlin",
    "Toronto",
    "Singapore",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!city.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Validate the city by making a request to the weather API
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || `Could not find weather data for "${city}"`
        );
      }

      // City is valid, call the onCitySelect callback
      onCitySelect(city);
    } catch (err) {
      console.error("Error validating city:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopularCityClick = (popularCity) => {
    setCity(popularCity);
    // Immediately submit the form with the selected city
    handleCitySelect(popularCity);
  };

  const handleCitySelect = async (selectedCity) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate the city by making a request to the weather API
      const res = await fetch(
        `/api/weather?city=${encodeURIComponent(selectedCity)}`
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || `Could not find weather data for "${selectedCity}"`
        );
      }

      // City is valid, call the onCitySelect callback
      onCitySelect(selectedCity);
    } catch (err) {
      console.error("Error validating city:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Search for a City
      </h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !city.trim()}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Searching...
              </span>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
          Popular Cities
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularCities.map((popularCity, index) => (
            <button
              key={index}
              onClick={() => handlePopularCityClick(popularCity)}
              className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              disabled={isLoading}
            >
              {popularCity}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CitySearch;
