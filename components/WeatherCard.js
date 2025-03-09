import React from "react";

const WeatherCard = ({ weatherData, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-700/40 to-indigo-700/40 backdrop-blur-sm rounded-xl shadow-xl p-8 w-full max-w-md mx-auto border border-blue-500/20">
        <div className="animate-pulse">
          <div className="h-8 bg-blue-600/30 rounded-lg w-3/4 mb-6"></div>
          <div className="h-32 bg-blue-600/30 rounded-lg mb-6"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-blue-600/30 rounded-lg"></div>
            <div className="h-20 bg-blue-600/30 rounded-lg"></div>
            <div className="h-20 bg-blue-600/30 rounded-lg"></div>
            <div className="h-20 bg-blue-600/30 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-blue-700/40 to-indigo-700/40 backdrop-blur-sm rounded-xl shadow-xl p-8 w-full max-w-md mx-auto border border-blue-500/20">
        <div className="text-red-300">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Error
          </h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

  // Map weather conditions to icons
  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase();

    if (conditionLower.includes("clear")) return "☀️";
    if (conditionLower.includes("sun")) return "☀️";
    if (conditionLower.includes("cloud")) return "☁️";
    if (conditionLower.includes("rain")) return "🌧️";
    if (conditionLower.includes("drizzle")) return "🌦️";
    if (conditionLower.includes("thunder")) return "⛈️";
    if (conditionLower.includes("snow")) return "❄️";
    if (conditionLower.includes("mist") || conditionLower.includes("fog"))
      return "🌫️";

    return "🌡️"; // Default
  };

  return (
    <div className="bg-gradient-to-br from-blue-700/40 to-indigo-700/40 backdrop-blur-sm rounded-xl shadow-xl p-8 w-full max-w-md mx-auto border border-blue-500/20 transition-all duration-300 hover:shadow-blue-500/10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {weatherData.location.city}, {weatherData.location.country}
          </h2>
          <p className="text-sm text-blue-200 mt-1">
            Last updated: {new Date(weatherData.updated_at).toLocaleString()}
          </p>
        </div>
        <div className="text-6xl">{getWeatherIcon(weatherData.conditions)}</div>
      </div>

      <div className="mb-8">
        <div className="flex items-end">
          <span className="text-6xl font-bold text-white">
            {Math.round(weatherData.temperature.current)}°
          </span>
          <span className="text-blue-200 ml-3 mb-2">
            Feels like {Math.round(weatherData.temperature.current)}°C
          </span>
        </div>
        <p className="text-xl text-blue-100 capitalize mt-2">
          {weatherData.conditions}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-800/30 p-4 rounded-xl border border-blue-500/20 transition-all duration-300 hover:bg-blue-700/30 hover:shadow-md transform hover:scale-[1.02]">
          <p className="text-sm text-blue-300 mb-1">Min / Max</p>
          <p className="text-lg font-semibold text-white">
            {Math.round(weatherData.temperature.min)}° /{" "}
            {Math.round(weatherData.temperature.max)}°
          </p>
        </div>
        <div className="bg-blue-800/30 p-4 rounded-xl border border-blue-500/20 transition-all duration-300 hover:bg-blue-700/30 hover:shadow-md transform hover:scale-[1.02]">
          <p className="text-sm text-blue-300 mb-1">Humidity</p>
          <p className="text-lg font-semibold text-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 text-blue-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
            {weatherData.humidity}%
          </p>
        </div>
        <div className="bg-blue-800/30 p-4 rounded-xl border border-blue-500/20 transition-all duration-300 hover:bg-blue-700/30 hover:shadow-md transform hover:scale-[1.02]">
          <p className="text-sm text-blue-300 mb-1">Wind Speed</p>
          <p className="text-lg font-semibold text-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 text-blue-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
            </svg>
            {weatherData.wind_speed} m/s
          </p>
        </div>
        <div className="bg-blue-800/30 p-4 rounded-xl border border-blue-500/20 transition-all duration-300 hover:bg-blue-700/30 hover:shadow-md transform hover:scale-[1.02]">
          <p className="text-sm text-blue-300 mb-1">Coordinates</p>
          <p className="text-lg font-semibold text-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 text-blue-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="10" r="3" />
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
            </svg>
            {weatherData.location.coordinates.latitude.toFixed(2)},{" "}
            {weatherData.location.coordinates.longitude.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
