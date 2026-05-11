import { useState } from 'react';
import { Search, MapPin, LocateFixed, LoaderCircle } from 'lucide-react';

const SearchBar = ({ onSearch, onUseCurrentLocation, locating }) => {
  const [city, setCity] = useState('');
  
  const trendingCities = ['London', 'Tokyo', 'New York', 'Paris', 'Dubai'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setCity('');
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative group max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/40 group-focus-within:text-cyan-400 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          placeholder="Search for a city (e.g. Jaipur, London)..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full py-5 px-14 rounded-[2rem] bg-white/10 backdrop-blur-3xl border border-white/20 text-white placeholder-white/30 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400/50 transition-all duration-500 shadow-2xl text-lg"
        />
        
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-sm transition-all duration-300 shadow-lg active:scale-95"
        >
          Search
        </button>
      </form>

      <div className="flex justify-center mt-4">
        <button
          type="button"
          // onClick={onUseCurrentLocation}
          disabled={locating}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 disabled:opacity-60 disabled:cursor-not-allowed border border-cyan-300/30 text-cyan-100 text-sm font-semibold transition-all duration-300 backdrop-blur-xl"
        >
          {locating ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
          {locating ? 'Detecting Location...' : 'Use Current Location'}
        </button>
      </div>

      {/* Trending Cities */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6 animate-in fade-in slide-in-from-top-4 duration-1000">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> Trending:
        </span>
        {trendingCities.map((name) => (
          <button
            key={name}
            onClick={() => onSearch(name)}
            className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-white/60 hover:text-white transition-all duration-300 backdrop-blur-md"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
