import { useState } from "react";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
  }>;
}

// Tailwind CSS classes are used for styling
function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const API_KEY = "d20c3a8de10be8f56842d4d403f42eab";

  const getWeather = async () => {
    if (!city) return;
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();
    setWeather(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 p-4">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md rounded-xl shadow-2xl p-6 text-white">
        <h1 className="text-4xl font-bold text-center mb-6">Weather App</h1>

        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Enter city"
            className="w-full max-w-xs p-3 rounded-l-lg border-0 outline-none bg-white/50 placeholder-white/80 text-gray-800 focus:bg-white transition"
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && getWeather()}
          />
          <button
            onClick={getWeather}
            className="p-3 bg-blue-600 rounded-r-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
        
        {weather && weather.main ? (
          <div className="text-center bg-white/20 p-6 rounded-xl shadow-inner">
            <h2 className="text-3xl font-bold">{weather.name}</h2>
            <p className="text-6xl font-light my-2">{Math.round(weather.main.temp)}°C</p>
            <p className="capitalize text-xl">{weather.weather[0].description}</p>
            <p className="text-lg mt-2">Humidity: {weather.main.humidity}%</p>
          </div>
        ) : (
          <p className="text-center text-white/80">Enter a city to get the weather</p>
        )}
      </div>
    </div>
  );
}

export default App;
