import React from "react";

const WeatherCard = ({ weatherData, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md mx-auto">
        <div className="text-red-500 dark:text-red-400">
          <h3 className="text-lg font-semibold mb-2">Error</h3>
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md mx-auto">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {weatherData.location.city}, {weatherData.location.country}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date(weatherData.updated_at).toLocaleString()}
          </p>
        </div>
        <div className="text-5xl">{getWeatherIcon(weatherData.conditions)}</div>
      </div>

      <div className="mb-6">
        <div className="flex items-end">
          <span className="text-5xl font-bold text-gray-800 dark:text-white">
            {Math.round(weatherData.temperature.current)}°C
          </span>
          <span className="text-gray-500 dark:text-gray-400 ml-2">
            Feels like {Math.round(weatherData.temperature.current)}°C
          </span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 capitalize mt-1">
          {weatherData.conditions}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Min / Max</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {Math.round(weatherData.temperature.min)}° /{" "}
            {Math.round(weatherData.temperature.max)}°
          </p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {weatherData.humidity}%
          </p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Wind Speed</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {weatherData.wind_speed} m/s
          </p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Coordinates
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {weatherData.location.coordinates.latitude.toFixed(2)},{" "}
            {weatherData.location.coordinates.longitude.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
