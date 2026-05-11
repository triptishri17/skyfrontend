import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import WeatherPage from "./components/WeatherPage";
import { useWeather } from "./hooks/useWeather";
import { Cloud } from "lucide-react";

function App() {
  const {
    weatherData,
    forecastData,
    loading,
    error,
    fetchWeather,
  } = useWeather();

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("weatherFavorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Default City
  useEffect(() => {
    fetchWeather("London");
  }, []);

  // Save Favorites
  useEffect(() => {
    localStorage.setItem(
      "weatherFavorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  // Dynamic Background
  const getBackgroundGradient = () => {
    if (!weatherData)
      return "from-slate-900 via-blue-950 to-slate-900";

    const condition =
      weatherData.weather[0].main.toLowerCase();

    if (condition.includes("clear")) {
      return "from-sky-500 via-blue-700 to-slate-900";
    }

    if (condition.includes("cloud")) {
      return "from-slate-700 via-slate-800 to-slate-900";
    }

    if (
      condition.includes("rain") ||
      condition.includes("drizzle")
    ) {
      return "from-gray-700 via-blue-900 to-slate-950";
    }

    if (condition.includes("snow")) {
      return "from-blue-200 via-slate-400 to-slate-700";
    }

    if (condition.includes("thunderstorm")) {
      return "from-purple-900 via-slate-900 to-black";
    }

    return "from-indigo-900 via-slate-900 to-black";
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-1000 overflow-x-hidden`}
    >
      {/* Main Wrapper */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <header className="flex items-center justify-center gap-3 mb-10">
          <Cloud className="w-8 h-8 text-cyan-300" />

          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
            WeatherDash
          </h1>
        </header>

        {/* Search */}
        <div className="mb-8">
          {/* <SearchBar onSearch={fetchWeather} /> */}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center h-[300px]">
            <div className="w-16 h-16 border-4 border-cyan-300 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="max-w-md mx-auto bg-red-500/20 border border-red-400/30 backdrop-blur-xl rounded-2xl p-5 text-center text-red-100">
            {error}
          </div>
        )}

        {/* Weather Dashboard */}
        {!loading &&
          !error &&
          weatherData &&
          forecastData && (
            <WeatherPage
              weatherData={{
                location: {
                  name: weatherData.name,
                  region: weatherData.sys.country,
                  country: weatherData.sys.country,
                },

                current: {
                  temp: Math.round(
                    weatherData.main.temp
                  ),

                  humidity:
                    weatherData.main.humidity,

                  wind: weatherData.wind.speed,

                  precipitation:
                    forecastData.list[0]?.pop
                      ? Math.round(
                          forecastData.list[0].pop *
                            100
                        )
                      : 0,

                  day: new Date().toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                    }
                  ),

                  condition:
                    weatherData.weather[0].main,

                  icon: "☀️",
                },

                forecast: forecastData.list
                  .slice(0, 7)
                  .map((item) => ({
                    day: new Date(
                      item.dt * 1000
                    ).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                      }
                    ),

                    high: Math.round(
                      item.main.temp_max
                    ),

                    low: Math.round(
                      item.main.temp_min
                    ),

                    icon: "☀️",
                  })),

                hourly: forecastData.list
                  .slice(0, 8)
                  .map((item) => ({
                    time: new Date(
                      item.dt * 1000
                    ).toLocaleTimeString([], {
                      hour: "numeric",
                    }),

                    temp: Math.round(
                      item.main.temp
                    ),
                  })),
              }}
            />
          )}
      </div>
    </div>
  );
}

export default App;
