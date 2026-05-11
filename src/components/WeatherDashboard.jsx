import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Dot } from "recharts";
import { Droplets, Wind, Sunrise, Sunset, Eye, Thermometer } from "lucide-react";

const getOfficialIcon = (iconCode) => `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

const STAR_POINTS = [
  { x: 8, y: 12, s: 2 }, { x: 16, y: 25, s: 1 }, { x: 24, y: 8, s: 2 }, { x: 33, y: 17, s: 1 }, { x: 41, y: 6, s: 2 },
  { x: 52, y: 12, s: 1 }, { x: 61, y: 28, s: 2 }, { x: 69, y: 10, s: 1 }, { x: 77, y: 18, s: 2 }, { x: 86, y: 11, s: 1 },
  { x: 93, y: 24, s: 2 }, { x: 12, y: 42, s: 1 }, { x: 21, y: 56, s: 2 }, { x: 30, y: 48, s: 1 }, { x: 39, y: 67, s: 2 },
  { x: 47, y: 52, s: 1 }, { x: 58, y: 44, s: 2 }, { x: 66, y: 63, s: 1 }, { x: 74, y: 55, s: 2 }, { x: 83, y: 47, s: 1 },
  { x: 91, y: 60, s: 2 }, { x: 6, y: 74, s: 1 }, { x: 17, y: 86, s: 2 }, { x: 28, y: 78, s: 1 }, { x: 35, y: 90, s: 2 },
  { x: 46, y: 83, s: 1 }, { x: 57, y: 92, s: 2 }, { x: 68, y: 79, s: 1 }, { x: 79, y: 88, s: 2 }, { x: 90, y: 81, s: 1 },
];

const RAIN_COLUMNS = Array.from({ length: 36 }, (_, i) => ({
  left: (i * 2.8) % 100,
  delay: (i % 9) * 0.22,
  duration: 1 + ((i % 5) * 0.22),
}));

const SNOW_FLAKES = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 3.5) % 100,
  drift: ((i % 7) - 3) * 3,
  delay: (i % 8) * 0.4,
  duration: 4 + (i % 5),
}));

const CLOUD_BLOBS = [
  { top: 8, width: 300, height: 110, speed: 28, opacity: 0.15 },
  { top: 22, width: 420, height: 130, speed: 38, opacity: 0.16 },
  { top: 40, width: 360, height: 115, speed: 34, opacity: 0.14 },
  { top: 62, width: 280, height: 96, speed: 26, opacity: 0.12 },
];

const FOG_BANDS = [
  { top: 12, width: 380, height: 120, speed: 26, blur: "blur-3xl" },
  { top: 35, width: 460, height: 140, speed: 34, blur: "blur-[60px]" },
  { top: 58, width: 520, height: 170, speed: 42, blur: "blur-[70px]" },
];

const NightStars = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {STAR_POINTS.map((star, idx) => (
      <motion.span
        key={`${star.x}-${star.y}`}
        className="absolute rounded-full bg-white/90"
        style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.s, height: star.s }}
        animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.15, 1] }}
        transition={{ duration: 2.4 + (idx % 5) * 0.45, repeat: Infinity, ease: "easeInOut", delay: (idx % 4) * 0.2 }}
      />
    ))}
    <motion.div
      className="absolute right-[12%] top-[10%] w-28 h-28 rounded-full bg-blue-200/30 blur-[36px]"
      animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.95, 1.05, 0.95] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

const SunnyAtmosphere = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute -top-20 -left-16 w-[28rem] h-[28rem] rounded-full bg-yellow-300/35 blur-[90px]"
      animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    {[0, 60, 120, 180, 240, 300].map((deg) => (
      <motion.div
        key={deg}
        className="absolute left-1/2 top-[-55%] h-[210%] w-[80%] -translate-x-1/2 bg-gradient-to-b from-yellow-300/20 to-transparent origin-top"
        initial={{ rotate: deg }}
        animate={{ rotate: deg + 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      />
    ))}
  </div>
);

const CloudyAtmosphere = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {CLOUD_BLOBS.map((blob, idx) => (
      <motion.div
        key={idx}
        className="absolute -left-[30%] rounded-full bg-white/20 blur-3xl"
        style={{ top: `${blob.top}%`, width: blob.width, height: blob.height, opacity: blob.opacity }}
        animate={{ left: ["-30%", "120%"] }}
        transition={{ duration: blob.speed, repeat: Infinity, ease: "linear", delay: -idx * 4 }}
      />
    ))}
  </div>
);

const RainyAtmosphere = ({ withLightning = false }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {withLightning && (
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.3, 0, 0.2, 0, 0, 0] }}
        transition={{ duration: 5, repeat: Infinity, times: [0, 0.64, 0.67, 0.7, 0.73, 0.76, 0.85, 1] }}
      />
    )}
    {RAIN_COLUMNS.map((col, idx) => (
      <motion.div
        key={idx}
        className="absolute top-[-10%] w-[2px] h-5 rounded-full bg-cyan-200/35"
        style={{ left: `${col.left}%` }}
        animate={{ y: ["0%", "120vh"] }}
        transition={{ duration: col.duration, repeat: Infinity, ease: "linear", delay: col.delay }}
      />
    ))}
  </div>
);

const SnowAtmosphere = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {SNOW_FLAKES.map((flake, idx) => (
      <motion.div
        key={idx}
        className="absolute -top-5 w-2 h-2 rounded-full bg-white/80 blur-[1px]"
        style={{ left: `${flake.left}%` }}
        animate={{ y: ["0%", "120vh"], x: [0, flake.drift, 0], rotate: [0, 180, 360] }}
        transition={{ duration: flake.duration, repeat: Infinity, ease: "linear", delay: flake.delay }}
      />
    ))}
  </div>
);

const FogAtmosphere = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute inset-0 bg-slate-200/20 backdrop-blur-sm"
      animate={{ opacity: [0.2, 0.5, 0.2] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    {FOG_BANDS.map((band, idx) => (
      <motion.div
        key={idx}
        className={`absolute -left-[38%] rounded-full bg-white/30 ${band.blur}`}
        style={{ top: `${band.top}%`, width: band.width, height: band.height }}
        animate={{ left: ["-38%", "120%"] }}
        transition={{ duration: band.speed, repeat: Infinity, ease: "linear", delay: -idx * 3 }}
      />
    ))}
  </div>
);

const resolveWeatherType = (mainWeather = "", isNight = false) => {
  const value = mainWeather.toLowerCase();
  if (isNight) return "night";
  if (value.includes("thunderstorm")) return "storm";
  if (value.includes("rain") || value.includes("drizzle")) return "rain";
  if (value.includes("snow")) return "snow";
  if (value.includes("mist") || value.includes("haze") || value.includes("fog") || value.includes("smoke")) return "fog";
  if (value.includes("cloud")) return "cloud";
  if (value.includes("clear")) return "clear";
  return "default";
};

const getWeatherPalette = (weatherType, theme) => {
  const isDark = theme === "dark";

  const palettes = {
    night: {
      bg: isDark ? "from-[#020617] via-[#111827] to-[#1e1b4b]" : "from-[#dbeafe] via-[#bfdbfe] to-[#c7d2fe]",
      textPrimary: isDark ? "text-white" : "text-slate-900",
      textSecondary: isDark ? "text-slate-300/80" : "text-slate-700/80",
      card: isDark ? "bg-white/8 border-white/15" : "bg-white/65 border-white/70",
      cardHover: isDark ? "hover:bg-white/15" : "hover:bg-white/80",
      glow: isDark ? "shadow-[0_0_80px_rgba(99,102,241,0.35)]" : "shadow-[0_0_60px_rgba(129,140,248,0.28)]",
      accent: "#93c5fd",
      atmosphere: <NightStars />,
    },
    clear: {
      bg: isDark ? "from-[#1e3a8a] via-[#0ea5e9] to-[#f59e0b]" : "from-[#fde68a] via-[#7dd3fc] to-[#fb923c]",
      textPrimary: isDark ? "text-white" : "text-slate-900",
      textSecondary: isDark ? "text-white/70" : "text-slate-700/80",
      card: isDark ? "bg-white/12 border-white/20" : "bg-white/70 border-white/80",
      cardHover: isDark ? "hover:bg-white/20" : "hover:bg-white/85",
      glow: isDark ? "shadow-[0_0_80px_rgba(251,191,36,0.32)]" : "shadow-[0_0_70px_rgba(251,146,60,0.35)]",
      accent: "#f59e0b",
      atmosphere: <SunnyAtmosphere />,
    },
    cloud: {
      bg: isDark ? "from-[#0f172a] via-[#334155] to-[#475569]" : "from-[#e2e8f0] via-[#cbd5e1] to-[#94a3b8]",
      textPrimary: isDark ? "text-white" : "text-slate-900",
      textSecondary: isDark ? "text-slate-300/85" : "text-slate-700/85",
      card: isDark ? "bg-white/10 border-white/15" : "bg-white/70 border-white/85",
      cardHover: isDark ? "hover:bg-white/15" : "hover:bg-white/85",
      glow: isDark ? "shadow-[0_0_70px_rgba(148,163,184,0.28)]" : "shadow-[0_0_55px_rgba(100,116,139,0.28)]",
      accent: "#94a3b8",
      atmosphere: <CloudyAtmosphere />,
    },
    rain: {
      bg: isDark ? "from-[#020617] via-[#0f172a] to-[#1d4ed8]" : "from-[#dbeafe] via-[#93c5fd] to-[#60a5fa]",
      textPrimary: isDark ? "text-white" : "text-slate-900",
      textSecondary: isDark ? "text-cyan-100/80" : "text-slate-700/85",
      card: isDark ? "bg-blue-950/35 border-blue-200/20" : "bg-white/72 border-blue-100/80",
      cardHover: isDark ? "hover:bg-blue-900/50" : "hover:bg-white/88",
      glow: isDark ? "shadow-[0_0_80px_rgba(59,130,246,0.35)]" : "shadow-[0_0_60px_rgba(59,130,246,0.25)]",
      accent: "#38bdf8",
      atmosphere: <RainyAtmosphere />,
    },
    storm: {
      bg: isDark ? "from-[#1e1b4b] via-[#312e81] to-[#0f172a]" : "from-[#ddd6fe] via-[#c4b5fd] to-[#a5b4fc]",
      textPrimary: isDark ? "text-white" : "text-slate-900",
      textSecondary: isDark ? "text-violet-200/80" : "text-slate-700/85",
      card: isDark ? "bg-violet-950/30 border-violet-200/20" : "bg-white/72 border-violet-100/80",
      cardHover: isDark ? "hover:bg-violet-900/48" : "hover:bg-white/86",
      glow: isDark ? "shadow-[0_0_85px_rgba(139,92,246,0.35)]" : "shadow-[0_0_62px_rgba(139,92,246,0.28)]",
      accent: "#a78bfa",
      atmosphere: <RainyAtmosphere withLightning />,
    },
    snow: {
      bg: isDark ? "from-[#0f172a] via-[#1e3a8a] to-[#334155]" : "from-[#ecfeff] via-[#dbeafe] to-[#e2e8f0]",
      textPrimary: isDark ? "text-white" : "text-slate-900",
      textSecondary: isDark ? "text-cyan-100/80" : "text-slate-700/80",
      card: isDark ? "bg-cyan-950/24 border-cyan-100/25" : "bg-white/80 border-white/90",
      cardHover: isDark ? "hover:bg-cyan-900/40" : "hover:bg-white/94",
      glow: isDark ? "shadow-[0_0_84px_rgba(186,230,253,0.32)]" : "shadow-[0_0_62px_rgba(147,197,253,0.28)]",
      accent: "#bae6fd",
      atmosphere: <SnowAtmosphere />,
    },
    fog: {
      bg: isDark ? "from-[#111827] via-[#374151] to-[#1f2937]" : "from-[#e5e7eb] via-[#d1d5db] to-[#9ca3af]",
      textPrimary: isDark ? "text-white" : "text-slate-900",
      textSecondary: isDark ? "text-slate-300/80" : "text-slate-700/80",
      card: isDark ? "bg-slate-900/35 border-slate-200/20" : "bg-white/72 border-white/85",
      cardHover: isDark ? "hover:bg-slate-800/45" : "hover:bg-white/88",
      glow: isDark ? "shadow-[0_0_75px_rgba(148,163,184,0.3)]" : "shadow-[0_0_58px_rgba(148,163,184,0.25)]",
      accent: "#cbd5e1",
      atmosphere: <FogAtmosphere />,
    },
    default: {
      bg: isDark ? "from-[#0f172a] via-[#1e293b] to-[#312e81]" : "from-[#e0e7ff] via-[#c7d2fe] to-[#bfdbfe]",
      textPrimary: isDark ? "text-white" : "text-slate-900",
      textSecondary: isDark ? "text-white/75" : "text-slate-700/80",
      card: isDark ? "bg-white/10 border-white/15" : "bg-white/75 border-white/90",
      cardHover: isDark ? "hover:bg-white/16" : "hover:bg-white/90",
      glow: isDark ? "shadow-[0_0_75px_rgba(129,140,248,0.32)]" : "shadow-[0_0_58px_rgba(96,165,250,0.28)]",
      accent: "#60a5fa",
      atmosphere: null,
    },
  };

  return palettes[weatherType] || palettes.default;
};

const CustomTooltip = ({ active, payload, label, palette }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-2xl border p-4 backdrop-blur-2xl ${palette.card}`}>
      <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${palette.textSecondary}`}>{label}</p>
      <p className={`mt-2 text-2xl font-black ${palette.textPrimary}`}>{payload[0].value}°</p>
      <p className={`text-xs font-bold mt-1 ${palette.textSecondary}`}>{payload[0].payload.condition}</p>
      <p className={`text-xs mt-1 ${palette.textSecondary}`}>Feels like {payload[0].payload.feelsLike}°</p>
    </div>
  );
};

export default function WeatherDashboard({ weatherData, theme }) {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  const currentData = weatherData?.current ?? {};
  const forecastList = weatherData?.forecast?.list ?? [];
  const city = currentData?.name ?? "Unknown";

  const dailyForecasts = useMemo(() => {
    if (!forecastList.length) return [];
    const grouped = forecastList.reduce((acc, item) => {
      const dateKey = new Date(item.dt * 1000).toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    }, {});

    return Object.values(grouped).slice(0, 7).map((entries) => {
      const rep = entries.find((entry) => new Date(entry.dt * 1000).getHours() >= 12) || entries[Math.floor(entries.length / 2)] || entries[0];
      return {
        ...rep,
        entries,
        main: {
          ...rep.main,
          temp_min: Math.round(Math.min(...entries.map((entry) => entry.main.temp_min))),
          temp_max: Math.round(Math.max(...entries.map((entry) => entry.main.temp_max))),
          humidity: Math.round(entries.reduce((sum, entry) => sum + entry.main.humidity, 0) / entries.length),
        },
      };
    });
  }, [forecastList]);

  const safeSelectedDayIdx = Math.min(selectedDayIdx, Math.max(dailyForecasts.length - 1, 0));
  const selectedDay = dailyForecasts[safeSelectedDayIdx] || currentData;
  const isNight = selectedDay?.weather?.[0]?.icon?.endsWith("n");
  const weatherType = resolveWeatherType(selectedDay?.weather?.[0]?.main, isNight);
  const palette = useMemo(() => getWeatherPalette(weatherType, theme), [theme, weatherType]);

  const hourlyData = useMemo(() => {
    if (!selectedDay?.dt) return [];
    const dayEntries = selectedDay?.entries?.length
      ? selectedDay.entries
      : forecastList.filter((item) => new Date(item.dt * 1000).toDateString() === new Date(selectedDay.dt * 1000).toDateString());

    return dayEntries.map((item) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      temp: Math.round(item.main.temp),
      condition: item.weather[0].main,
      icon: item.weather[0].icon,
      pop: Math.round((item.pop ?? 0) * 100),
      feelsLike: Math.round(item.main.feels_like),
    }));
  }, [forecastList, selectedDay]);

  return (
    <div className="w-full relative py-8 px-4 md:px-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedDay?.dt ?? "current"}-${theme}-${weatherType}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          className={`fixed inset-0 -z-10 bg-gradient-to-br ${palette.bg} transition-all duration-1000`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_45%),radial-gradient(circle_at_85%_30%,rgba(255,255,255,0.12),transparent_40%)]" />
          {palette.atmosphere}
        </motion.div>
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-8">
        <motion.section layout className={`relative overflow-hidden rounded-[2.2rem] md:rounded-[3rem] border ${palette.card} ${palette.glow} backdrop-blur-3xl`}>
          <div className="p-6 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div key={`hero-${selectedDay?.dt ?? "now"}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center gap-3">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2.5 h-2.5 rounded-full" style={{ background: palette.accent, boxShadow: `0 0 14px ${palette.accent}` }} />
                <span className={`text-[10px] font-black uppercase tracking-[0.35em] ${palette.textSecondary}`}>
                  {city} • {safeSelectedDayIdx === 0 ? "Today" : "Forecast"}
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <h2 className={`text-[5.8rem] md:text-[8.5rem] leading-none font-thin tracking-tight ${palette.textPrimary}`}>
                  {Math.round(selectedDay?.main?.temp ?? currentData?.main?.temp ?? 0)}
                  <span className="text-[2.6rem] md:text-[3.5rem] opacity-35 align-top">°</span>
                </h2>
                <div className="pb-4 md:border-l md:pl-5 md:border-white/20">
                  <p className={`text-2xl md:text-4xl uppercase tracking-wider font-light ${palette.textPrimary}`}>{selectedDay?.weather?.[0]?.main || "Weather"}</p>
                  <p className={`mt-1 text-sm font-bold uppercase tracking-[0.2em] ${palette.textSecondary}`}>
                    {selectedDay?.dt ? new Date(selectedDay.dt * 1000).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) : ""}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-2">
                {[
                  { label: "Humidity", value: `${selectedDay?.main?.humidity ?? currentData?.main?.humidity ?? 0}%`, icon: <Droplets size={16} /> },
                  { label: "Wind", value: `${Math.round((selectedDay?.wind?.speed ?? currentData?.wind?.speed ?? 0) * 3.6)} km/h`, icon: <Wind size={16} /> },
                  { label: "Visibility", value: `${((selectedDay?.visibility ?? currentData?.visibility ?? 0) / 1000).toFixed(1)} km`, icon: <Eye size={16} /> },
                  { label: "Pressure", value: `${selectedDay?.main?.pressure ?? currentData?.main?.pressure ?? 0} hPa`, icon: <Thermometer size={16} /> },
                ].map((stat) => (
                  <div key={stat.label} className={`rounded-2xl border p-3 md:p-4 ${palette.card}`}>
                    <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] ${palette.textSecondary}`}>
                      {stat.icon}
                      <span>{stat.label}</span>
                    </div>
                    <p className={`mt-2 text-base md:text-lg font-semibold ${palette.textPrimary}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div key={`icon-${selectedDay?.dt ?? "now"}`} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-[100px] opacity-65" style={{ background: palette.accent }} />
                <img
                  src={getOfficialIcon(selectedDay?.weather?.[0]?.icon || currentData?.weather?.[0]?.icon || "01d")}
                  alt="Weather condition"
                  className="relative z-10 w-48 h-48 md:w-72 md:h-72 drop-shadow-[0_24px_38px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:scale-105"
                />
              </div>
            </motion.div>
          </div>

          <div className="border-t border-white/15 p-5 md:p-8">
            <div className="flex overflow-x-auto gap-3 md:gap-4 pb-1 no-scrollbar">
              {dailyForecasts.map((day, idx) => {
                const isActive = safeSelectedDayIdx === idx;
                return (
                  <motion.button
                    key={day.dt}
                    onClick={() => setSelectedDayIdx(idx)}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex-shrink-0 w-32 md:w-36 rounded-3xl border px-4 py-5 transition-all ${
                      isActive
                        ? `bg-white/85 text-slate-900 border-white ring-2 ring-offset-1 ring-offset-transparent shadow-xl`
                        : `${palette.card} ${palette.cardHover} ${palette.textPrimary}`
                    }`}
                  >
                    <p className={`text-[10px] font-black uppercase tracking-[0.22em] ${isActive ? "text-slate-500" : palette.textSecondary}`}>
                      {new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: "short" })}
                    </p>
                    <img src={getOfficialIcon(day?.weather?.[0]?.icon || "01d")} alt="Forecast icon" className="w-12 h-12 mx-auto my-2" />
                    <div className="flex items-end justify-center gap-2">
                      <span className="text-xl font-black">{Math.round(day?.main?.temp_max ?? 0)}°</span>
                      <span className={`text-xs font-bold ${isActive ? "text-slate-500" : palette.textSecondary}`}>{Math.round(day?.main?.temp_min ?? 0)}°</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <motion.section layout className={`xl:col-span-2 rounded-[2rem] md:rounded-[2.6rem] border ${palette.card} p-6 md:p-10 backdrop-blur-3xl`}>
            <div className="flex justify-between items-center mb-7">
              <h3 className={`text-xs font-black uppercase tracking-[0.34em] ${palette.textSecondary}`}>Temperature Flow</h3>
              <span className={`text-[11px] font-bold uppercase tracking-[0.24em] ${palette.textSecondary}`}>Realtime Curve</span>
            </div>
            <div className="w-full min-h-[300px] relative overflow-hidden">
              {hourlyData?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={hourlyData ?? []}>
                    <defs>
                      <linearGradient id="weatherCurveFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={palette.accent} stopOpacity={0.42} />
                        <stop offset="95%" stopColor={palette.accent} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 11, fontWeight: 700 }} dy={16} />
                    <YAxis hide domain={["auto", "auto"]} />
                    <Tooltip content={<CustomTooltip palette={palette} />} />
                    <Area
                      type="monotone"
                      dataKey="temp"
                      stroke={palette.accent}
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#weatherCurveFill)"
                      animationDuration={1000}
                      dot={<Dot r={4} fill={palette.accent} stroke="#ffffff" strokeWidth={2} />}
                      activeDot={{ r: 8, fill: palette.accent, stroke: "#fff", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className={`h-[300px] w-full rounded-2xl border ${palette.card} animate-pulse`}>
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
              )}
            </div>
          </motion.section>

          <motion.section layout className={`rounded-[2rem] md:rounded-[2.6rem] border ${palette.card} p-6 backdrop-blur-3xl`}>
            <h3 className={`text-xs font-black uppercase tracking-[0.34em] mb-6 ${palette.textSecondary}`}>Hourly Forecast</h3>
            <div className="space-y-3 max-h-[26rem] overflow-y-auto pr-1 custom-scrollbar">
              {hourlyData.map((hour, idx) => (
                <motion.div
                  key={`${hour.time}-${idx}`}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className={`rounded-2xl border px-4 py-3 transition-all ${palette.card} ${palette.cardHover}`}
                >
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${palette.textSecondary}`}>{hour.time}</span>
                      <img src={getOfficialIcon(hour.icon)} alt={hour.condition} className="w-10 h-10" />
                      <div>
                        <p className={`text-lg font-bold ${palette.textPrimary}`}>{hour.temp}°</p>
                        <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${palette.textSecondary}`}>{hour.condition}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${palette.textPrimary}`}>{hour.pop}%</p>
                      <p className={`text-[10px] uppercase tracking-[0.18em] ${palette.textSecondary}`}>Precip</p>
                      <p className={`text-[10px] uppercase tracking-[0.18em] ${palette.textSecondary}`}>Feels {hour.feelsLike}°</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              label: "Sunrise",
              value: currentData?.sys?.sunrise
                ? new Date(currentData.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "--:--",
              icon: <Sunrise size={18} />,
            },
            {
              label: "Sunset",
              value: currentData?.sys?.sunset
                ? new Date(currentData.sys.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "--:--",
              icon: <Sunset size={18} />,
            },
            { label: "Condition", value: selectedDay?.weather?.[0]?.main || "Unknown", icon: <Droplets size={18} /> },
            { label: "Feels Like", value: `${Math.round(selectedDay?.main?.feels_like ?? currentData?.main?.feels_like ?? 0)}°`, icon: <Thermometer size={18} /> },
          ].map((detail) => (
            <motion.article
              key={detail.label}
              whileHover={{ y: -4 }}
              className={`rounded-3xl border p-5 md:p-6 backdrop-blur-3xl ${palette.card} ${palette.cardHover}`}
            >
              <div className={`flex items-center justify-between text-xs uppercase tracking-[0.2em] font-bold ${palette.textSecondary}`}>
                <span>{detail.label}</span>
                <span>{detail.icon}</span>
              </div>
              <p className={`mt-4 text-2xl md:text-3xl font-black ${palette.textPrimary}`}>{detail.value}</p>
            </motion.article>
          ))}
        </section>
      </div>

    </div>
  );
}