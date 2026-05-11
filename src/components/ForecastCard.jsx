import { format } from 'date-fns';

const ForecastCard = ({ data }) => {
  if (!data || !data.list) return null;

  // Filter out to get one reading per day (e.g., around 12:00:00)
  const dailyData = data.list.filter((item) => item.dt_txt.includes('12:00:00'));

  return (
    <div className="mt-8">
      <h3 className="text-xl font-medium text-white mb-4 pl-2">5-Day Forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {dailyData.map((day) => (
          <div 
            key={day.dt} 
            className="glass rounded-2xl p-4 flex flex-col items-center justify-center text-white hover:bg-white/20 transition-colors duration-300"
          >
            <span className="text-sm font-medium text-white/80">
              {format(new Date(day.dt * 1000), 'EEE')}
            </span>
            <img 
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
              alt={day.weather[0].description}
              className="w-12 h-12 my-2"
            />
            <span className="text-lg font-bold">
              {Math.round(day.main.temp)}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastCard;
