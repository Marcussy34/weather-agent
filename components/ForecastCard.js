import React from "react";

const ForecastCard = ({ forecastData, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-4xl mx-auto">
        <div className="text-red-500 dark:text-red-400">
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (
    !forecastData ||
    !forecastData.forecast ||
    forecastData.forecast.length === 0
  ) {
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

  // Get the most common condition for a day
  const getMostCommonCondition = (conditions) => {
    if (!conditions || conditions.length === 0) return "";

    const conditionCounts = conditions.reduce((acc, { description }) => {
      acc[description] = (acc[description] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(conditionCounts).sort((a, b) => b[1] - a[1])[0][0];
  };

  // Calculate average temperature for a day
  const getAverageTemp = (temperatures) => {
    if (!temperatures || temperatures.length === 0) return 0;

    const sum = temperatures.reduce((acc, { temp }) => acc + temp, 0);
    return sum / temperatures.length;
  };

  // Get min and max temperature for a day
  const getMinMaxTemp = (temperatures) => {
    if (!temperatures || temperatures.length === 0) return { min: 0, max: 0 };

    const temps = temperatures.map((t) => t.temp);
    return {
      min: Math.min(...temps),
      max: Math.max(...temps),
    };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        5-Day Forecast
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {forecastData.forecast.slice(0, 5).map((day, index) => {
          const mostCommonCondition = getMostCommonCondition(day.conditions);
          const avgTemp = getAverageTemp(day.temperatures);
          const { min, max } = getMinMaxTemp(day.temperatures);

          return (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center"
            >
              <p className="font-semibold text-gray-800 dark:text-white">
                {index === 0 ? "Today" : day.day_name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(day.date).toLocaleDateString()}
              </p>

              <div className="text-4xl my-2">
                {getWeatherIcon(mostCommonCondition)}
              </div>

              <p className="text-lg font-bold text-gray-800 dark:text-white">
                {Math.round(avgTemp)}°C
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                {Math.round(min)}° / {Math.round(max)}°
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-300 capitalize mt-1">
                {mostCommonCondition}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastCard;
