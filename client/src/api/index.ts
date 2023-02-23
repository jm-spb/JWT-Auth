import axios, { AxiosRequestHeaders } from 'axios';
import { IAuthResponse } from '../types';

const api = axios.create({
  withCredentials: true,
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const headers = config.headers as AxiosRequestHeaders;
  headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;
    if (error?.response?.status === 401 && !prevRequest?._sent) {
      prevRequest._sent = true;
      try {
        const response = await axios.get<IAuthResponse>(
          `${process.env.REACT_APP_API_URL}/api/refresh`,
          { withCredentials: true }
        );
        // prevRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
        localStorage.setItem('token', response.data.accessToken);
        return api.request(prevRequest);
      } catch (error) {
        console.log('Unauthorized');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
