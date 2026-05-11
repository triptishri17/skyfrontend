import WeatherDashboard from "../components/WeatherDashboard";

export default function WeatherPage({ weatherData, theme }) {
  if (!weatherData) return null;
  
  return <WeatherDashboard weatherData={weatherData} theme={theme} />;
}