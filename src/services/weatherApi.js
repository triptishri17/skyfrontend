import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/weather',
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
