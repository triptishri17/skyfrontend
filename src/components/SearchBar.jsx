import { useState } from "react";
import { Search, MapPin, LocateFixed, LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";

const SearchBar = ({ onSearch, onUseCurrentLocation, locating, isDark }) => {
  const [city, setCity] = useState("");

  const trendingCities = ["London", "Tokyo", "New York", "Paris", "Dubai"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setCity("");
    }
  };

  const inputBase =
    "w-full py-4 md:py-5 pl-12 md:pl-14 pr-[7.5rem] rounded-3xl text-base md:text-lg backdrop-blur-xl border transition-all duration-300 shadow-lg focus:outline-none focus:ring-2";

  const inputTheme = isDark
    ? "bg-white/10 border-white/15 text-white placeholder:text-white/40 focus:border-cyan-400/50 focus:ring-cyan-500/25"
    : "bg-[#f8fafc]/90 border-slate-300/35 text-slate-800 placeholder:text-slate-500 focus:border-blue-500/40 focus:ring-blue-500/20";

  const iconColor = isDark ? "text-white/45 group-focus-within:text-cyan-400" : "text-slate-500 group-focus-within:text-blue-600";

  const searchBtn = isDark
    ? "bg-cyan-500 hover:bg-cyan-400 text-white shadow-cyan-500/25"
    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20";

  const locateBtn = isDark
    ? "bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-400/25 text-cyan-100"
    : "bg-blue-500/10 hover:bg-blue-500/18 border-blue-500/25 text-blue-800";

  const chip = isDark
    ? "bg-white/6 border-white/10 text-white/70 hover:bg-white/12 hover:text-white"
    : "bg-[#eef4ff]/80 border-slate-300/25 text-slate-700 hover:bg-[#e0e7ff]/90 hover:text-slate-900";

  const trendingLabel = isDark ? "text-white/35" : "text-slate-500";

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative group max-w-2xl mx-auto">
        <div className={`absolute inset-y-0 left-4 md:left-5 flex items-center pointer-events-none transition-colors ${iconColor}`}>
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          placeholder="Search city (e.g. Tokyo, Mumbai)..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={`${inputBase} ${inputTheme}`}
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${searchBtn}`}
        >
          Search
        </motion.button>
      </form>

      <div className="flex justify-center mt-4">
        <motion.button
          type="button"
          onClick={onUseCurrentLocation}
          disabled={locating}
          whileHover={{ scale: locating ? 1 : 1.02 }}
          whileTap={{ scale: locating ? 1 : 0.98 }}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border backdrop-blur-xl text-sm font-semibold transition-all disabled:opacity-55 disabled:cursor-not-allowed ${locateBtn}`}
        >
          {locating ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
          {locating ? "Detecting location…" : "Use current location"}
        </motion.button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-6">
        <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${trendingLabel}`}>
          <MapPin className="w-3 h-3" /> Trending
        </span>
        {trendingCities.map((name) => (
          <motion.button
            key={name}
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSearch(name)}
            className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md transition-all ${chip}`}
          >
            {name}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
