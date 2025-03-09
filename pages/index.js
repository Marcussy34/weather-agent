import { useState, useEffect } from "react";
import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";

// Import components
import CitySearch from "../components/CitySearch";
import WeatherCard from "../components/WeatherCard";
import ForecastCard from "../components/ForecastCard";
import WeatherAgent from "../components/WeatherAgent";
import { RetroGrid } from "../components/RetroGrid";
import { AuroraText } from "../components/AuroraText";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [forecastError, setForecastError] = useState(null);

  // Fetch weather data when city changes
  useEffect(() => {
    if (!city) return;

    const fetchWeatherData = async () => {
      setIsLoadingWeather(true);
      setWeatherError(null);

      try {
        const res = await fetch(
          `/api/weather?city=${encodeURIComponent(city)}`
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch weather data");
        }

        const data = await res.json();
        setWeatherData(data);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setWeatherError(err.message);
      } finally {
        setIsLoadingWeather(false);
      }
    };

    const fetchForecastData = async () => {
      setIsLoadingForecast(true);
      setForecastError(null);

      try {
        const res = await fetch(
          `/api/forecast?city=${encodeURIComponent(city)}`
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch forecast data");
        }

        const data = await res.json();
        setForecastData(data);
      } catch (err) {
        console.error("Error fetching forecast data:", err);
        setForecastError(err.message);
      } finally {
        setIsLoadingForecast(false);
      }
    };

    fetchWeatherData();
    fetchForecastData();
  }, [city]);

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
  };

  return (
    <>
      <Head>
        <title>Weather AI Agent</title>
        <meta
          name="description"
          content="Weather AI Agent powered by OpenWeatherMap and OpenAI"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white font-[family-name:var(--font-geist-sans)] relative overflow-hidden`}
      >
        {/* Retro Grid Background */}
        <RetroGrid
          opacity={0.3}
          lightLineColor="#4338ca"
          darkLineColor="#818cf8"
        />

        {/* Gradient orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative">
          <header className="pt-12 pb-8 px-4">
            <div className="max-w-7xl mx-auto text-center">
              <div className="inline-block relative">
                {/* Glowing background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-50 blur-2xl animate-pulse-glow"></div>

                {/* Title with gradient and animation */}
                <h1 className="relative text-4xl md:text-6xl font-bold">
                  <AuroraText
                    colors={[
                      "#fbbf24", // amber-400
                      "#f87171", // red-400
                      "#f472b6", // pink-400
                      "#a78bfa", // violet-400
                      "#60a5fa", // blue-400
                      "#34d399", // emerald-400
                    ]}
                    speed={1.5}
                  >
                    Weather AI Agent
                  </AuroraText>
                </h1>
              </div>

              {/* Subtitle with fade-in animation */}
              <p className="mt-4 text-lg text-blue-200/80 font-light tracking-wide animate-fade-in">
                Intelligent Weather Insights & Forecasts
              </p>
            </div>
          </header>

          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col gap-8">
              {/* City Search */}
              <CitySearch onCitySelect={handleCitySelect} />

              {city && (
                <div className="space-y-8 animate-fade-in">
                  {/* Weather Card */}
                  <WeatherCard
                    weatherData={weatherData}
                    isLoading={isLoadingWeather}
                    error={weatherError}
                  />

                  {/* Forecast Card */}
                  <ForecastCard
                    forecastData={forecastData}
                    isLoading={isLoadingForecast}
                    error={forecastError}
                  />

                  {/* Weather Agent */}
                  <WeatherAgent city={city} />
                </div>
              )}
            </div>
          </main>

          <footer className="mt-12 py-6 px-4 text-center">
            <p className="text-sm text-gray-400">
              Powered by OpenWeatherMap and OpenAI
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
