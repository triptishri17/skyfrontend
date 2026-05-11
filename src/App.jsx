import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";

import SearchBar from "./components/SearchBar";
import WeatherPage from "./components/WeatherPage";
import { useWeather } from "./hooks/useWeather";

import {
  Cloud,
  Sun,
  Moon,
  Star,
  MapPin,
  LocateFixed,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_CITY = "London";

export default function App() {
  const {
    weatherData,
    forecastData,
    loading,
    error,
    fetchWeather,
    fetchWeatherByCoords,
  } = useWeather();

  // ==============================
  // THEME
  // ==============================
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const isDark = theme === "dark";

  // ==============================
  // FAVORITES
  // ==============================
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("weatherFavorites")) || [];
    } catch {
      return [];
    }
  });

  // ==============================
  // LOCATION
  // ==============================
  const [locationMessage, setLocationMessage] = useState("");
  const [locating, setLocating] = useState(false);

  const watchIdRef = useRef(null);

  // ==============================
  // SAVE THEME
  // ==============================
  useEffect(() => {
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // ==============================
  // SAVE FAVORITES
  // ==============================
  useEffect(() => {
    localStorage.setItem(
      "weatherFavorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  // ==============================
  // INITIAL WEATHER LOAD
  // ==============================
  useEffect(() => {
    requestCurrentLocation();

    return () => {
      if (
        watchIdRef.current !== null &&
        navigator.geolocation
      ) {
        navigator.geolocation.clearWatch(
          watchIdRef.current
        );
      }
    };
  }, []);

  // ==============================
  // GET CURRENT LOCATION WEATHER
  // ==============================
  const requestCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      fetchWeather(DEFAULT_CITY);
      return;
    }

    setLocating(true);
    setLocationMessage("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };

        try {
          await fetchWeatherByCoords(coords);

          setLocationMessage(
            "Showing weather for your current location."
          );
        } catch (err) {
          fetchWeather(DEFAULT_CITY);
        } finally {
          setLocating(false);
        }
      },

      async () => {
        setLocating(false);

        setLocationMessage(
          "Location denied. Showing London weather."
        );

        await fetchWeather(DEFAULT_CITY);
      },

      {
        enableHighAccuracy: false,
        timeout: 6000,
        maximumAge: 300000,
      }
    );
  }, [fetchWeather, fetchWeatherByCoords]);

  // ==============================
  // TOGGLE THEME
  // ==============================
  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "dark" ? "light" : "dark"
    );
  };

  // ==============================
  // FAVORITE TOGGLE
  // ==============================
  const handleToggleFavorite = (city) => {
    setFavorites((prev) => {
      if (prev.includes(city)) {
        return prev.filter((c) => c !== city);
      }

      return [...prev, city];
    });
  };

  // ==============================
  // IS FAVORITE
  // ==============================
  const isFavorite = useMemo(() => {
    if (!weatherData) return false;

    return favorites.includes(weatherData.name);
  }, [favorites, weatherData]);

  // ==============================
  // BACKGROUND
  // ==============================
  const dynamicBackground = useMemo(() => {
    if (!weatherData) {
      return isDark
        ? "from-slate-950 via-slate-900 to-black"
        : "from-blue-100 via-white to-slate-200";
    }

    const weather =
      weatherData.weather?.[0]?.main?.toLowerCase();

    if (weather?.includes("clear")) {
      return isDark
        ? "from-blue-950 via-slate-900 to-black"
        : "from-sky-200 via-blue-100 to-yellow-50";
    }

    if (weather?.includes("cloud")) {
      return isDark
        ? "from-slate-900 via-gray-900 to-black"
        : "from-slate-300 via-gray-100 to-white";
    }

    if (
      weather?.includes("rain") ||
      weather?.includes("drizzle")
    ) {
      return isDark
        ? "from-slate-950 via-blue-950 to-black"
        : "from-blue-200 via-slate-100 to-gray-200";
    }

    if (weather?.includes("snow")) {
      return isDark
        ? "from-slate-800 via-blue-950 to-black"
        : "from-white via-blue-50 to-slate-200";
    }

    if (weather?.includes("thunderstorm")) {
      return isDark
        ? "from-black via-purple-950 to-slate-950"
        : "from-gray-400 via-slate-200 to-white";
    }

    return isDark
      ? "from-slate-950 via-slate-900 to-black"
      : "from-blue-100 via-white to-slate-100";
  }, [weatherData, isDark]);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${dynamicBackground} transition-all duration-700`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}

        <header className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
          {/* LOGO */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="p-3 rounded-3xl bg-cyan-500/20 backdrop-blur-xl border border-cyan-400/20">
              <Cloud className="w-8 h-8 text-cyan-400" />
            </div>

            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                SKYCAST
              </h1>

              <p
                className={`text-sm ${
                  isDark
                    ? "text-white/50"
                    : "text-slate-600"
                }`}
              >
                Smart Weather Dashboard
              </p>
            </div>
          </motion.div>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            {/* FAVORITE CITIES */}
            <div className="hidden md:flex items-center gap-3">
              {favorites.slice(0, 3).map((city) => (
                <motion.button
                  key={city}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fetchWeather(city)}
                  className={`px-4 py-2 rounded-2xl border backdrop-blur-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                      : "bg-white/60 border-slate-200 text-slate-700 hover:bg-white"
                  }`}
                >
                  <MapPin size={15} />
                  {city}
                </motion.button>
              ))}
            </div>

            {/* THEME BUTTON */}
            <motion.button
              whileHover={{ scale: 1.08, rotate: 12 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleTheme}
              className={`p-4 rounded-2xl backdrop-blur-xl border transition-all ${
                isDark
                  ? "bg-white/10 border-white/10"
                  : "bg-white/70 border-slate-200"
              }`}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-700" />
              )}
            </motion.button>
          </div>
        </header>

        {/* ===================================== */}
        {/* SEARCH */}
        {/* ===================================== */}

        <div className="max-w-3xl mx-auto mb-8">
          <SearchBar
            onSearch={fetchWeather}
            onUseCurrentLocation={requestCurrentLocation}
            locating={locating}
          />
        </div>

        {/* ===================================== */}
        {/* LOCATION MESSAGE */}
        {/* ===================================== */}

        <AnimatePresence>
          {locationMessage && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className={`max-w-3xl mx-auto mb-8 rounded-2xl border px-4 py-3 flex items-center gap-3 backdrop-blur-xl ${
                isDark
                  ? "bg-white/5 border-white/10 text-white/80"
                  : "bg-white/70 border-slate-200 text-slate-700"
              }`}
            >
              <LocateFixed
                size={18}
                className="text-cyan-400"
              />

              <span>{locationMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===================================== */}
        {/* LOADING */}
        {/* ===================================== */}

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-[50vh]"
            >
              <div className="relative w-28 h-28">
                <div className="absolute inset-0 border-4 border-cyan-400/10 rounded-full"></div>

                <div className="absolute inset-0 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>

                <Cloud className="absolute inset-0 m-auto w-10 h-10 text-cyan-400 animate-pulse" />
              </div>

              <p className="mt-6 tracking-[0.3em] text-cyan-400 text-xs font-black uppercase">
                Loading Weather...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===================================== */}
        {/* ERROR */}
        {/* ===================================== */}

        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center rounded-[2rem] border border-red-500/20 bg-red-500/10 p-10 backdrop-blur-2xl"
          >
            <div className="text-5xl mb-5">🌩️</div>

            <h2 className="text-2xl font-black text-red-400 mb-3">
              Weather Error
            </h2>

            <p className="text-red-300/80">
              {error}
            </p>
          </motion.div>
        )}

        {/* ===================================== */}
        {/* WEATHER PAGE */}
        {/* ===================================== */}

        {!loading &&
          !error &&
          weatherData &&
          forecastData && (
            <motion.div
              key={weatherData.name}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* FAVORITE BUTTON */}
              <div className="flex justify-end mb-5">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() =>
                    handleToggleFavorite(
                      weatherData.name
                    )
                  }
                  className={`p-4 rounded-full border backdrop-blur-xl transition-all ${
                    isFavorite
                      ? "bg-yellow-400/20 border-yellow-400/40 text-yellow-400"
                      : isDark
                      ? "bg-white/5 border-white/10 text-white/50"
                      : "bg-white/60 border-slate-200 text-slate-500"
                  }`}
                >
                  <Star
                    size={22}
                    fill={
                      isFavorite
                        ? "currentColor"
                        : "none"
                    }
                  />
                </motion.button>
              </div>

              {/* MAIN WEATHER UI */}
              <WeatherPage
                weatherData={{
                  current: weatherData,
                  forecast: forecastData,
                }}
                theme={theme}
              />
            </motion.div>
          )}

        {/* ===================================== */}
        {/* EMPTY STATE */}
        {/* ===================================== */}

        {!loading &&
          !error &&
          !weatherData && (
            <div className="h-[40vh] flex flex-col items-center justify-center">
              <Cloud className="w-20 h-20 text-cyan-400/30 mb-4" />

              <p
                className={`text-lg font-bold ${
                  isDark
                    ? "text-white/40"
                    : "text-slate-500"
                }`}
              >
                Search a city to view weather
              </p>
            </div>
          )}
      </div>
    </div>
  );
}