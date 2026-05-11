import { MapPin } from 'lucide-react';

const WeatherCard = ({ data, onToggleFavorite, isFavorite }) => {
  if (!data) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
  const temp = Math.round(data.main.temp);
  const condition = data.weather[0].main;
  const description = data.weather[0].description;

  return (
    <div className="glass-dark rounded-3xl p-8 text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <button 
        onClick={() => onToggleFavorite(data.name)}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <svg 
          className={`w-6 h-6 ${isFavorite ? 'text-yellow-400 fill-current' : 'text-white/70'}`} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </button>

      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xl font-medium text-white/90 mb-2">
            <MapPin className="w-5 h-5" />
            <span>{data.name}, {data.sys.country}</span>
          </div>
          <h1 className="text-7xl font-bold tracking-tighter mb-2">
            {temp}°
          </h1>
          <p className="text-2xl font-light text-white/90 capitalize">
            {condition} <span className="text-sm text-white/60 ml-2">({description})</span>
          </p>
        </div>

        <div className="mt-6 md:mt-0 relative">
          {/* Subtle glow behind icon */}
          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150 transform -z-10 group-hover:scale-110 transition-transform duration-500"></div>
          <img 
            src={iconUrl} 
            alt={description} 
            className="w-40 h-40 object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
