import { useState, useEffect } from "react";
import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";

// Import components
import CitySearch from "../components/CitySearch";
import WeatherCard from "../components/WeatherCard";
import ForecastCard from "../components/ForecastCard";
import WeatherAgent from "../components/WeatherAgent";

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
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-[family-name:var(--font-geist-sans)]`}
      >
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Weather AI Agent
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex flex-col gap-6">
              {/* City Search */}
              <CitySearch onCitySelect={handleCitySelect} />

              {city && (
                <>
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
                </>
              )}
            </div>
          </div>
        </main>

        <footer className="bg-white dark:bg-gray-800 shadow-sm mt-auto">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Powered by OpenWeatherMap and OpenAI
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
