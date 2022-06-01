import axios, { AxiosRequestHeaders } from 'axios';

const api = axios.create({
  withCredentials: true,
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const headers = config.headers as AxiosRequestHeaders;
  headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});

export default api;
