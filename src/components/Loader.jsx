import React from "react";
import { motion } from "framer-motion";
import { Cloud } from "lucide-react";

/**
 * Weather Loader Component
 */
const Loader = ({ isDark }) => {
  const containerBg = isDark
    ? "bg-white/5 border-white/10"
    : "bg-[#f8fafc]/90 border-slate-300/30";

  const cloudColor = isDark
    ? "text-cyan-400"
    : "text-blue-600";

  const textColor = isDark
    ? "text-cyan-300/90"
    : "text-blue-700";

  return (
    <motion.div
      className="flex min-h-[48vh] flex-col items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Main Glass Container */}
      <div
        className={`relative flex h-36 w-36 items-center justify-center rounded-3xl border backdrop-blur-2xl shadow-2xl ${containerBg}`}
      >
        {/* Rotating Halo */}
        <motion.div
          className="absolute inset-0 rounded-full bg-cyan-400/10"
          animate={{ rotate: 360 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Sun Glow */}
        <motion.div
          className={`absolute -top-5 h-14 w-14 rounded-full ${
            isDark
              ? "bg-amber-300/30"
              : "bg-yellow-300/50"
          } blur-xl`}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Floating Cloud */}
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Cloud
            className={`h-16 w-16 ${cloudColor} drop-shadow-xl`}
          />
        </motion.div>

        {/* Rain Pulse */}
        <motion.div
          className="absolute bottom-6 flex gap-2"
          animate={{
            opacity: [0.4, 1, 0.4],
            y: [0, 4, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          <div className="h-2 w-2 rounded-full bg-cyan-400" />
          <div className="h-2 w-2 rounded-full bg-blue-400" />
          <div className="h-2 w-2 rounded-full bg-sky-400" />
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.p
        className={`mt-8 text-xs font-black uppercase tracking-[0.35em] ${textColor}`}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
        }}
      >
        Fetching Weather Data...
      </motion.p>
    </motion.div>
  );
};

export default Loader;
