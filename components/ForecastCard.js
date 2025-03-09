import React from "react";

const ForecastCard = ({ forecastData, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-700/40 to-indigo-700/40 backdrop-blur-sm rounded-xl shadow-xl p-8 w-full max-w-4xl mx-auto border border-blue-500/20">
        <div className="animate-pulse">
          <div className="h-8 bg-blue-600/30 rounded-lg w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-48 bg-blue-600/30 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-blue-700/40 to-indigo-700/40 backdrop-blur-sm rounded-xl shadow-xl p-8 w-full max-w-4xl mx-auto border border-blue-500/20">
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
    <div className="bg-gradient-to-br from-blue-700/40 to-indigo-700/40 backdrop-blur-sm rounded-xl shadow-xl p-8 w-full max-w-4xl mx-auto border border-blue-500/20 transition-all duration-300 hover:shadow-blue-500/10">
      <div className="flex items-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2 text-blue-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 16.2V3.8a2 2 0 0 1 1.85-2h0c1.1 0 2 .9 2 2v12.4a3 3 0 1 1-5.94 0" />
          <path d="M17 16.2V3.8a2 2 0 0 0-1.85-2h0c-1.1 0-2 .9-2 2v12.4a3 3 0 1 0 5.94 0" />
          <circle cx="12" cy="19" r="3" />
          <path d="M10 2v10.2" />
          <path d="M7 2v10.2" />
          <path d="M4 2v10.2" />
        </svg>
        <h2 className="text-2xl font-bold text-white">5-Day Forecast</h2>
        <span className="ml-3 text-xs bg-blue-600/30 px-2 py-1 rounded-full text-blue-200">
          3-hour intervals
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {forecastData.forecast.slice(0, 5).map((day, index) => {
          const mostCommonCondition = getMostCommonCondition(day.conditions);
          const avgTemp = getAverageTemp(day.temperatures);
          const { min, max } = getMinMaxTemp(day.temperatures);

          return (
            <div
              key={index}
              className="bg-blue-800/30 p-5 rounded-xl text-center border border-blue-500/20 transition-all duration-300 hover:bg-blue-700/30 hover:shadow-md transform hover:scale-[1.02]"
            >
              <div className="bg-blue-900/30 rounded-lg py-2 mb-3 border-b border-blue-500/20">
                <p className="font-semibold text-white text-lg">
                  {index === 0 ? "Today" : day.day_name}
                </p>
                <p className="text-xs text-blue-300">
                  {new Date(day.date).toLocaleDateString()}
                </p>
              </div>

              <div className="text-5xl my-4">
                {getWeatherIcon(mostCommonCondition)}
              </div>

              <p className="text-2xl font-bold text-white mb-1">
                {Math.round(avgTemp)}°C
              </p>

              <div className="flex justify-center items-center mb-2">
                <span className="text-blue-300 text-sm mr-2">
                  {Math.round(min)}°
                </span>
                <div className="h-1 w-16 bg-blue-900/50 rounded-full relative">
                  <div
                    className="absolute h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"
                    style={{
                      width: `${((avgTemp - min) / (max - min)) * 100}%`,
                      left: "0",
                    }}
                  ></div>
                </div>
                <span className="text-blue-300 text-sm ml-2">
                  {Math.round(max)}°
                </span>
              </div>

              <p className="text-sm text-blue-100 capitalize">
                {mostCommonCondition}
              </p>

              <div className="mt-3 pt-3 border-t border-blue-500/20 grid grid-cols-2 gap-2 text-xs">
                <div className="text-blue-300">
                  <div className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                    <span>{Math.round(day.humidity[0]?.value || 0)}%</span>
                  </div>
                </div>
                <div className="text-blue-300">
                  <div className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
                    </svg>
                    <span>{Math.round(day.wind_speed[0]?.value || 0)} m/s</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastCard;
