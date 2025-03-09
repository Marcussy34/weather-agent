// Weather AI Agent API route
import { getCachedData, setCachedData } from "../../utils/cache";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { query, city } = req.body;

    // Validate input
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    if (!city) {
      return res.status(400).json({ error: "City parameter is required" });
    }

    // Get API key from environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const weatherApiKey = process.env.OPENWEATHERMAP_API_KEY;

    if (!openaiApiKey) {
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    if (!weatherApiKey) {
      return res.status(500).json({ error: "Weather API key not configured" });
    }

    // Check cache for weather data
    let weatherData = getCachedData(city, "weather");

    // If not in cache, fetch it
    if (!weatherData) {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${weatherApiKey}&units=metric`
      );

      if (!weatherResponse.ok) {
        return res.status(weatherResponse.status).json({
          error: `Failed to fetch weather data for ${city}`,
        });
      }

      weatherData = await weatherResponse.json();

      // Transform and cache the data
      const transformedWeatherData = {
        location: {
          city: weatherData.name,
          country: weatherData.sys.country,
          coordinates: {
            latitude: weatherData.coord.lat,
            longitude: weatherData.coord.lon,
          },
        },
        temperature: {
          current: weatherData.main.temp,
          min: weatherData.main.temp_min,
          max: weatherData.main.temp_max,
        },
        conditions: weatherData.weather[0].description,
        humidity: weatherData.main.humidity,
        wind_speed: weatherData.wind.speed,
        updated_at: new Date().toISOString(),
      };

      setCachedData(city, "weather", transformedWeatherData);
      weatherData = transformedWeatherData;
    }

    // Check cache for forecast data
    let forecastData = getCachedData(city, "forecast");

    // If not in cache, fetch it
    if (!forecastData) {
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          city
        )}&appid=${weatherApiKey}&units=metric`
      );

      if (!forecastResponse.ok) {
        return res.status(forecastResponse.status).json({
          error: `Failed to fetch forecast data for ${city}`,
        });
      }

      const rawForecastData = await forecastResponse.json();

      // Transform the data
      const forecastByDay = {};

      rawForecastData.list.forEach((item) => {
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

      forecastData = {
        location: {
          city: rawForecastData.city.name,
          country: rawForecastData.city.country,
          coordinates: {
            latitude: rawForecastData.city.coord.lat,
            longitude: rawForecastData.city.coord.lon,
          },
        },
        forecast: forecast,
        updated_at: new Date().toISOString(),
      };

      setCachedData(city, "forecast", forecastData);
    }

    // Prepare context for the AI
    const context = {
      current_weather: {
        city: weatherData.location.city,
        country: weatherData.location.country,
        temperature: weatherData.temperature.current,
        feels_like: weatherData.temperature.current, // Approximation
        conditions: weatherData.conditions,
        humidity: weatherData.humidity,
        wind_speed: weatherData.wind_speed,
        timestamp: weatherData.updated_at,
      },
      forecast: forecastData.forecast.map((day) => ({
        date: day.date,
        day_name: day.day_name,
        temperatures: day.temperatures,
        conditions: day.conditions,
        humidity: day.humidity,
        wind_speed: day.wind_speed,
      })),
    };

    // Call OpenAI API to generate a response
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a helpful weather assistant. You have access to current weather and forecast data for ${city}. 
            Provide accurate, concise, and helpful responses to weather-related queries. 
            If you don't know the answer or if the query is not related to weather, politely say so.
            Always use metric units (Celsius, meters per second, etc.) unless specifically asked for imperial units.`,
            },
            {
              role: "user",
              content: `Here is the weather data for ${city}:\n${JSON.stringify(
                context,
                null,
                2
              )}\n\nUser query: ${query}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      }
    );

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      return res.status(openaiResponse.status).json({
        error: errorData.error?.message || "Failed to generate AI response",
      });
    }

    const aiData = await openaiResponse.json();
    const aiResponse = aiData.choices[0].message.content;

    return res.status(200).json({
      query,
      city,
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in weather agent:", error);
    return res.status(500).json({ error: "Failed to process weather query" });
  }
}
