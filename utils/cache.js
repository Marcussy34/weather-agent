// Simple in-memory cache for weather data
// In a production environment, you would use Redis or another caching solution

// Cache structure:
// {
//   [city]: {
//     weather: { data, timestamp },
//     forecast: { data, timestamp }
//   }
// }

const cache = {};

// Default cache expiry time in milliseconds (15 minutes)
const DEFAULT_CACHE_EXPIRY = 15 * 60 * 1000;

/**
 * Get cached data for a city
 * @param {string} city - The city name
 * @param {string} type - The type of data ('weather' or 'forecast')
 * @returns {object|null} The cached data or null if not found or expired
 */
export function getCachedData(city, type) {
  if (!city || !type) return null;

  const normalizedCity = city.toLowerCase();
  const cacheEntry = cache[normalizedCity]?.[type];

  if (!cacheEntry) return null;

  const { data, timestamp } = cacheEntry;
  const now = Date.now();

  // Check if cache is expired
  if (now - timestamp > DEFAULT_CACHE_EXPIRY) {
    // Cache expired, remove it
    delete cache[normalizedCity][type];

    // If city has no more data, remove the city entry
    if (Object.keys(cache[normalizedCity]).length === 0) {
      delete cache[normalizedCity];
    }

    return null;
  }

  return data;
}

/**
 * Set data in the cache
 * @param {string} city - The city name
 * @param {string} type - The type of data ('weather' or 'forecast')
 * @param {object} data - The data to cache
 */
export function setCachedData(city, type, data) {
  if (!city || !type || !data) return;

  const normalizedCity = city.toLowerCase();

  // Initialize city entry if it doesn't exist
  if (!cache[normalizedCity]) {
    cache[normalizedCity] = {};
  }

  // Set the data with current timestamp
  cache[normalizedCity][type] = {
    data,
    timestamp: Date.now(),
  };
}

/**
 * Clear the entire cache or for a specific city
 * @param {string} [city] - Optional city name to clear cache for
 */
export function clearCache(city) {
  if (city) {
    const normalizedCity = city.toLowerCase();
    delete cache[normalizedCity];
  } else {
    // Clear all cache
    Object.keys(cache).forEach((key) => {
      delete cache[key];
    });
  }
}

/**
 * Get cache statistics
 * @returns {object} Cache statistics
 */
export function getCacheStats() {
  const cities = Object.keys(cache);
  const totalEntries = cities.reduce((total, city) => {
    return total + Object.keys(cache[city]).length;
  }, 0);

  return {
    cities: cities.length,
    totalEntries,
    entries: cities.map((city) => ({
      city,
      types: Object.keys(cache[city]),
      timestamps: Object.entries(cache[city]).reduce(
        (acc, [type, { timestamp }]) => {
          acc[type] = new Date(timestamp).toISOString();
          return acc;
        },
        {}
      ),
    })),
  };
}
