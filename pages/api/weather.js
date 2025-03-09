// Weather API route
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
    const cachedData = getCachedData(city, "weather");
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

    // Fetch weather data from OpenWeatherMap
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        error: errorData.message || "Failed to fetch weather data",
      });
    }

    const data = await response.json();

    // Transform the data to match our schema
    const weatherData = {
      location: {
        city: data.name,
        country: data.sys.country,
        coordinates: {
          latitude: data.coord.lat,
          longitude: data.coord.lon,
        },
      },
      temperature: {
        current: data.main.temp,
        min: data.main.temp_min,
        max: data.main.temp_max,
      },
      conditions: data.weather[0].description,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      updated_at: new Date().toISOString(),
    };

    // Cache the data
    setCachedData(city, "weather", weatherData);

    return res.status(200).json(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return res.status(500).json({ error: "Failed to fetch weather data" });
  }
}
