# Weather AI Agent

A powerful weather application with AI capabilities that provides current weather data, forecasts, and natural language interactions about weather conditions.

## Features

- **Current Weather**: Get real-time weather data for any city worldwide
- **5-Day Forecast**: View detailed weather forecasts for the next 5 days
- **AI Assistant**: Ask natural language questions about the weather and get intelligent responses
- **Caching**: Efficient data caching to minimize API calls and improve performance
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technologies Used

- **Next.js**: React framework for server-side rendering and API routes
- **OpenWeatherMap API**: For weather data and forecasts
- **OpenAI GPT-4**: For natural language processing and AI responses
- **TailwindCSS**: For styling and responsive design

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- OpenWeatherMap API key (get one at [https://openweathermap.org/api](https://openweathermap.org/api))
- OpenAI API key (get one at [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/weather-agent.git
   cd weather-agent
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your API keys:

   ```
   OPENWEATHERMAP_API_KEY=your_openweathermap_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Search for a City**: Enter a city name in the search box or click on one of the popular cities.
2. **View Current Weather**: See the current temperature, conditions, humidity, and wind speed.
3. **Check the Forecast**: View the weather forecast for the next 5 days.
4. **Ask the AI Assistant**: Type natural language questions about the weather such as:
   - "What's the weather like today?"
   - "Will it rain tomorrow?"
   - "Should I bring an umbrella this weekend?"
   - "What's the temperature going to be like on Friday?"

## API Routes

- `/api/weather?city={cityName}`: Get current weather data for a city
- `/api/forecast?city={cityName}`: Get 5-day forecast data for a city
- `/api/weather-agent`: POST endpoint for AI assistant queries

## Deployment

This application can be easily deployed to Vercel:

```bash
npm run build
# or
yarn build
```

For more information on deployment, see the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OpenWeatherMap](https://openweathermap.org/) for providing weather data
- [OpenAI](https://openai.com/) for the GPT-4 API
- [Next.js](https://nextjs.org/) for the React framework
- [TailwindCSS](https://tailwindcss.com/) for the styling
