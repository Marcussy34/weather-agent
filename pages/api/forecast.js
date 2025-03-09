// Forecast API route
import { getCachedData, setCachedData } from "../../utils/cache";

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { city } = req.query;

    // Validate input
    if (!city) {
      return res.status(400).json({ error: "City parameter is required" });
    }

    // Check cache first
    const cachedData = getCachedData(city, "forecast");
    if (cachedData) {
      return res.status(200).json({
        ...cachedData,
        cached: true,
      });
    }

    // Get API key from environment variables
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" });
    }

    // Fetch forecast data from OpenWeatherMap
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        error: errorData.message || "Failed to fetch forecast data",
      });
    }

    const data = await response.json();

    // Transform the data to match our schema
    // OpenWeatherMap returns forecast in 3-hour intervals for 5 days
    // We'll organize it by day for easier consumption

    const forecastByDay = {};

    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const day = date.toISOString().split("T")[0]; // YYYY-MM-DD format

      if (!forecastByDay[day]) {
        forecastByDay[day] = {
          date: day,
          day_name: date.toLocaleDateString("en-US", { weekday: "long" }),
          temperatures: [],
          conditions: [],
          humidity: [],
          wind_speed: [],
        };
      }

      forecastByDay[day].temperatures.push({
        time: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temp: item.main.temp,
        feels_like: item.main.feels_like,
      });

      forecastByDay[day].conditions.push({
        time: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      });

      forecastByDay[day].humidity.push({
        time: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        value: item.main.humidity,
      });

      forecastByDay[day].wind_speed.push({
        time: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        value: item.wind.speed,
      });
    });

    // Convert to array and sort by date
    const forecast = Object.values(forecastByDay).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const forecastData = {
      location: {
        city: data.city.name,
        country: data.city.country,
        coordinates: {
          latitude: data.city.coord.lat,
          longitude: data.city.coord.lon,
        },
      },
      forecast: forecast,
      updated_at: new Date().toISOString(),
    };

    // Cache the data
    setCachedData(city, "forecast", forecastData);

    return res.status(200).json(forecastData);
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    return res.status(500).json({ error: "Failed to fetch forecast data" });
  }
}
