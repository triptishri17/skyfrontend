import { Sunrise, Sunset } from 'lucide-react';
import { format } from 'date-fns';

const SunriseSunset = ({ data }) => {
  if (!data) return null;

  const sunrise = new Date(data.sys.sunrise * 1000);
  const sunset = new Date(data.sys.sunset * 1000);

  return (
    <div className="glass rounded-3xl p-6 mt-6">
      <h3 className="text-lg font-medium text-white mb-6">Sun & Moon</h3>
      <div className="flex justify-around items-center">
        <div className="flex flex-col items-center">
          <Sunrise className="w-10 h-10 text-yellow-300 mb-2" />
          <span className="text-white font-semibold text-lg">{format(sunrise, 'p')}</span>
          <span className="text-white/60 text-sm">Sunrise</span>
        </div>
        <div className="w-px h-16 bg-white/20"></div>
        <div className="flex flex-col items-center">
          <Sunset className="w-10 h-10 text-orange-400 mb-2" />
          <span className="text-white font-semibold text-lg">{format(sunset, 'p')}</span>
          <span className="text-white/60 text-sm">Sunset</span>
        </div>
      </div>
    </div>
  );
};

export default SunriseSunset;
