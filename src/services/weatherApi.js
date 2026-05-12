import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://skybackend-ivc5.onrender.com/api/weather';

const api = axios.create({
  baseURL: API_URL,
});

const buildQuery = (location) => {
  if (location?.city) {
    return { city: location.city };
  }
  if (location?.lat != null && location?.lon != null) {
    return { lat: location.lat, lon: location.lon };
  }
  throw new Error('City or latitude/longitude is required');
};

export const getCurrentWeather = async (location) => {
  const response = await api.get('/current', { params: buildQuery(location) });
  return response.data;
};

export const getForecast = async (location) => {
  const response = await api.get('/forecast', { params: buildQuery(location) });
  return response.data;
};

/** Nearby cities from coordinates (OpenWeather find API) */
export const findCitiesByCoords = async ({ lat, lon, cnt = 5 }) => {
  const response = await api.get('/find', {
    params: { lat, lon, cnt, units: 'metric' },
  });
  return response.data;
};
