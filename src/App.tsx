import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

// Import weather condition images
import sun from "./assets/images/sun.svg";
import cloud from "./assets/images/cloud.svg";
import rain from "./assets/images/rain.svg";
import sunCloud from "./assets/images/sun-cloud.svg";
import wrong from "./assets/images/wrong.svg";

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
  const [error, setError] = useState(false);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const API_KEY = "d20c3a8de10be8f56842d4d403f42eab";

  const getWeather = async () => {
    if (!city) return;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) {
        throw new Error("City not found");
      }
      const data = await res.json();
      setWeather(data);
      setError(false);
    } catch {
      setError(true);
      setWeather(null);
    }
  };

  const getWeatherIcon = (description: string) => {
    if (description.includes("sun")) return sun;
    if (description.includes("cloud")) return cloud;
    if (description.includes("rain")) return rain;
    if (description.includes("clear")) return sun;
    if (description.includes("few clouds")) return sunCloud;
    return sunCloud;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 relative overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "#111827",
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              repulse: {
                distance: 100,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.1,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.1,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
        className="absolute top-0 left-0 w-full h-full z-0"
      />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-white z-10 overflow-hidden border border-white/20
                   before:absolute before:content-[''] before:top-0 before:left-0 before:w-1/2 before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-aurora"
      >
        <motion.h1 
          className="text-5xl font-bold text-center mb-8 tracking-wider bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-gradient-x"
          style={{ backgroundSize: '200% 200%' }}
        >
          Weather Now
        </motion.h1>

        <div className="relative flex justify-center mb-8">
          <input
            type="text"
            placeholder="Enter city..."
            className="w-full max-w-xs p-4 rounded-full bg-white/10 border-2 border-transparent focus:border-blue-400 outline-none text-white placeholder-white/50 transition-all duration-300"
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getWeather()}
          />
          <button
            onClick={getWeather}
            className="absolute right-0 top-0 h-full px-5 text-white/60 hover:text-white transition-colors duration-300 flex items-center justify-center"
            style={{ right: 'calc(50% - 160px)'}}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {weather && weather.main ? (
            <motion.div
              key="weather"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="text-center bg-white/5 p-6 rounded-xl shadow-inner"
            >
              <motion.img
                src={getWeatherIcon(weather.weather[0].description)}
                alt="weather icon"
                className="w-32 h-32 mx-auto mb-4"
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              <h2 className="text-4xl font-bold">{weather.name}</h2>
              <p className="text-7xl font-thin my-2">
                {Math.round(weather.main.temp)}°C
              </p>
              <p className="capitalize text-2xl">
                {weather.weather[0].description}
              </p>
              <p className="text-xl mt-2">
                Humidity: {weather.main.humidity}%
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <img
                src={wrong}
                alt="wrong city"
                className="w-32 h-32 mx-auto mb-4"
              />
              <p className="text-center text-white/80">
                City not found. Please try again.
              </p>
            </motion.div>
          ) : (
            <p className="text-center text-white/80 text-lg">
              Enter a city to see the magic
            </p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default App;
