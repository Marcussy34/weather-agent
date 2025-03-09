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
    <div className="relative w-full max-w-3xl mx-auto px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg backdrop-blur-sm"></div>
      <div className="relative">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Search for a City
        </h2>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:bg-white/15"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="absolute right-2 px-6 py-2 bg-blue-500/80 hover:bg-blue-600/80 text-white rounded-xl transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              disabled={isLoading || !city.trim()}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
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
          <div className="mb-8 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-100 rounded-xl">
            <p>{error}</p>
          </div>
        )}

        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-300 mb-4">
            Popular Cities
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {popularCities.map((popularCity, index) => (
              <button
                key={index}
                onClick={() => handlePopularCityClick(popularCity)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {popularCity}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitySearch;
