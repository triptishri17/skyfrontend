import { Droplets, Wind, Gauge, Eye } from 'lucide-react';

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-4">
    <div className="p-3 bg-white/10 rounded-xl text-white">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-white/60">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  </div>
);

const DetailsCard = ({ data }) => {
  if (!data) return null;

  return (
    <div className="glass rounded-3xl p-6 mt-6">
      <h3 className="text-lg font-medium text-white mb-6">Weather Details</h3>
      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
        <DetailItem 
          icon={Droplets} 
          label="Humidity" 
          value={`${data.main.humidity}%`} 
        />
        <DetailItem 
          icon={Wind} 
          label="Wind" 
          value={`${data.wind.speed} m/s`} 
        />
        <DetailItem 
          icon={Gauge} 
          label="Pressure" 
          value={`${data.main.pressure} hPa`} 
        />
        <DetailItem 
          icon={Eye} 
          label="Visibility" 
          value={`${(data.visibility / 1000).toFixed(1)} km`} 
        />
      </div>
    </div>
  );
};

export default DetailsCard;
