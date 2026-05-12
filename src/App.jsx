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

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const isDark = theme === "dark";

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("weatherFavorites")) || [];
    } catch {
      return [];
    }
  });

  const [locationMessage, setLocationMessage] = useState("");
  const [locating, setLocating] = useState(false);

  const watchIdRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(
      "weatherFavorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

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
        } catch {
          fetchWeather(DEFAULT_CITY);
        } finally {
          setLocating(false);
        }
      },

      async () => {
        setLocating(false);

        setLocationMessage(
          "Location denied. Showing London. You can search or use location anytime."
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

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "dark" ? "light" : "dark"
    );
  };

  const handleToggleFavorite = (city) => {
    setFavorites((prev) => {
      if (prev.includes(city)) {
        return prev.filter((c) => c !== city);
      }

      return [...prev, city];
    });
  };

  const isFavorite = useMemo(() => {
    if (!weatherData) return false;

    return favorites.includes(weatherData.name);
  }, [favorites, weatherData]);

  /** Subtle weather tint — never pure white; stacks on sky gradient */
  const weatherTint = useMemo(() => {
    if (!weatherData) {
      return isDark
        ? "bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-600/5"
        : "bg-gradient-to-br from-sky-400/12 via-transparent to-blue-400/10";
    }

    const w =
      weatherData.weather?.[0]?.main?.toLowerCase() || "";

    if (w.includes("clear")) {
      return isDark
        ? "bg-gradient-to-tr from-amber-500/10 via-transparent to-cyan-500/10"
        : "bg-gradient-to-tr from-amber-300/20 via-sky-200/15 to-blue-200/20";
    }
    if (w.includes("cloud")) {
      return isDark
        ? "bg-gradient-to-br from-slate-400/8 via-transparent to-slate-600/10"
        : "bg-gradient-to-br from-slate-400/15 via-sky-100/20 to-slate-300/15";
    }
    if (w.includes("rain") || w.includes("drizzle")) {
      return isDark
        ? "bg-gradient-to-br from-blue-600/12 via-transparent to-slate-900/20"
        : "bg-gradient-to-br from-blue-400/18 via-sky-200/20 to-slate-300/12";
    }
    if (w.includes("snow")) {
      return isDark
        ? "bg-gradient-to-br from-cyan-400/10 via-transparent to-slate-800/15"
        : "bg-gradient-to-br from-cyan-200/25 via-sky-100/25 to-slate-200/15";
    }
    if (w.includes("thunderstorm")) {
      return isDark
        ? "bg-gradient-to-br from-violet-600/15 via-transparent to-slate-950/25"
        : "bg-gradient-to-br from-violet-300/20 via-slate-200/15 to-blue-200/15";
    }

    return isDark
      ? "bg-gradient-to-br from-cyan-500/6 via-transparent to-blue-700/8"
      : "bg-gradient-to-br from-sky-300/14 via-transparent to-blue-300/12";
  }, [weatherData, isDark]);

  const shellClass = isDark ? "app-shell-dark" : "app-shell-light";
  const headerCard = isDark ? "app-card-dark" : "app-card-light";

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-700 ${shellClass} ${isDark ? "text-slate-100" : "text-slate-800"}`}
    >
      {/* Animated ambient glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className={`absolute -top-40 -right-32 h-[28rem] w-[28rem] rounded-full blur-[120px] ${isDark ? "bg-cyan-500/25" : "bg-sky-400/35"}`}
          animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute -bottom-32 -left-24 h-[26rem] w-[26rem] rounded-full blur-[110px] ${isDark ? "bg-blue-600/20" : "bg-blue-400/25"}`}
          animate={{ opacity: [0.25, 0.45, 0.25], scale: [1.05, 1, 1.05] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className={`absolute top-1/2 left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] ${isDark ? "bg-indigo-500/15" : "bg-cyan-300/20"}`}
          animate={{ opacity: [0.2, 0.38, 0.2] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div
        className={`pointer-events-none fixed inset-0 -z-10 transition-opacity duration-700 ${weatherTint}`}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-6 md:py-10">
        <header
          className={`mb-8 md:mb-10 rounded-3xl border p-4 md:p-5 ${headerCard}`}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div
                className={`rounded-2xl border p-3 backdrop-blur-xl ${isDark ? "border-cyan-400/25 bg-cyan-500/15" : "border-blue-500/20 bg-blue-500/10"}`}
              >
                <Cloud
                  className={`h-8 w-8 md:h-9 md:w-9 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
                />
              </div>
              <div>
                <h1
                  className={`text-3xl font-black tracking-tight md:text-4xl ${isDark ? "bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent" : "bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent"}`}
                >
                  SKYCAST
                </h1>
                <p
                  className={`mt-0.5 text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}
                >
                  Premium weather dashboard
                </p>
              </div>
            </motion.div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              {favorites.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {favorites.slice(0, 5).map((city) => (
                    <motion.button
                      key={city}
                      type="button"
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => fetchWeather(city)}
                      className={`inline-flex items-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-semibold backdrop-blur-xl transition-all md:text-sm ${isDark ? "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/30 hover:bg-white/10" : "border-slate-300/35 bg-[#eef4ff]/80 text-slate-800 hover:border-blue-400/35 hover:bg-[#e0e7ff]/90"}`}
                    >
                      <MapPin size={14} className="opacity-70" />
                      {city}
                    </motion.button>
                  ))}
                </div>
              )}

              <motion.button
                type="button"
                whileHover={{ scale: 1.06, rotate: 8 }}
                whileTap={{ scale: 0.94 }}
                onClick={toggleTheme}
                className={`self-start rounded-2xl border p-3.5 backdrop-blur-xl transition-all sm:self-center ${isDark ? "border-white/10 bg-white/8 text-amber-300" : "border-slate-300/40 bg-[#f8fafc]/90 text-blue-700 shadow-sm"}`}
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </motion.button>
            </div>
          </div>
        </header>

        <div className="mx-auto mb-6 max-w-3xl md:mb-8">
          <SearchBar
            onSearch={fetchWeather}
            onUseCurrentLocation={requestCurrentLocation}
            locating={locating}
            isDark={isDark}
          />
        </div>

        <AnimatePresence>
          {locationMessage && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className={`mx-auto mb-6 flex max-w-3xl items-start gap-3 rounded-2xl border px-4 py-3 backdrop-blur-xl md:mb-8 ${isDark ? "border-white/10 bg-white/6 text-slate-200" : "border-slate-300/35 bg-[#f8fafc]/88 text-slate-700 shadow-sm"}`}
            >
              <LocateFixed
                size={18}
                className={`mt-0.5 shrink-0 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
              />
              <span className="text-sm leading-relaxed">{locationMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[48vh] flex-col items-center justify-center px-4"
            >
              <div
                className={`relative flex h-36 w-36 items-center justify-center rounded-3xl border backdrop-blur-2xl ${isDark ? "border-white/10 bg-white/5" : "border-slate-300/30 bg-[#f8fafc]/90 shadow-lg"}`}
              >
                <div className="absolute inset-3 rounded-2xl border-2 border-cyan-400/15" />
                <div className="absolute inset-3 rounded-2xl border-2 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                <Cloud
                  className={`relative h-11 w-11 ${isDark ? "text-cyan-400" : "text-blue-600"} animate-pulse`}
                />
              </div>
              <p
                className={`mt-8 text-xs font-black uppercase tracking-[0.35em] ${isDark ? "text-cyan-300/90" : "text-blue-700"}`}
              >
                Syncing atmosphere…
              </p>
              <p
                className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
              >
                Fetching live conditions for you
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mx-auto max-w-md rounded-3xl border p-8 text-center backdrop-blur-2xl ${isDark ? "border-red-400/25 bg-red-950/40 text-red-100" : "border-red-300/40 bg-[#fef2f2]/95 text-red-900 shadow-md"}`}
          >
            <div className="mb-4 text-4xl">🌩️</div>
            <h2 className="mb-2 text-xl font-black">Couldn’t load weather</h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-red-200/85" : "text-red-800/90"}`}>
              {error}
            </p>
          </motion.div>
        )}

        {!loading &&
          !error &&
          weatherData &&
          forecastData && (
            <motion.div
              key={weatherData.name}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-5 flex justify-end">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() =>
                    handleToggleFavorite(weatherData.name)
                  }
                  className={`rounded-full border p-3.5 backdrop-blur-xl transition-all ${isFavorite ? "border-amber-400/45 bg-amber-400/15 text-amber-300 shadow-lg shadow-amber-500/10" : isDark ? "border-white/10 bg-white/6 text-slate-400 hover:border-white/20 hover:text-slate-200" : "border-slate-300/40 bg-[#f8fafc]/90 text-slate-500 hover:border-amber-300/50 hover:text-amber-700"}`}
                >
                  <Star
                    size={22}
                    fill={
                      isFavorite ? "currentColor" : "none"
                    }
                  />
                </motion.button>
              </div>

              <WeatherPage
                weatherData={{
                  current: weatherData,
                  forecast: forecastData,
                }}
                theme={theme}
              />
            </motion.div>
          )}

        {!loading &&
          !error &&
          !weatherData && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mx-auto flex min-h-[38vh] max-w-lg flex-col items-center justify-center rounded-3xl border px-8 py-12 text-center backdrop-blur-2xl ${isDark ? "border-white/10 bg-white/5 text-slate-300" : "border-slate-300/35 bg-[#f8fafc]/92 text-slate-600 shadow-md"}`}
            >
              <Cloud
                className={`mb-5 h-16 w-16 ${isDark ? "text-cyan-500/40" : "text-blue-500/45"}`}
              />
              <p className={`text-lg font-bold ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                No weather data yet
              </p>
              <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Search a city or use your current location to see the full dashboard.
              </p>
            </motion.div>
          )}
      </div>
    </div>
  );
}
