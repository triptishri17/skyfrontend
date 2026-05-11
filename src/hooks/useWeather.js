import { useState } from 'react';
import { getCurrentWeather, getForecast } from '../services/weatherApi';

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchByLocation = async (location) => {
    setLoading(true);
    setError(null);
    try {
      const [current, forecast] = await Promise.all([
        getCurrentWeather(location),
        getForecast(location),
      ]);
      setWeatherData(current);
      setForecastData(forecast);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch weather data');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (city) => fetchByLocation({ city });

  const fetchWeatherByCoords = async ({ lat, lon }) => {
    return fetchByLocation({ lat, lon });
  };

  return { weatherData, forecastData, loading, error, fetchWeather, fetchWeatherByCoords };
};
