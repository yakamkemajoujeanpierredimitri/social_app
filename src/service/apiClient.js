import axios from 'axios';
import { TokenService } from './Security';

const API_BASE_URL = process.env.EXPO_PUBLIC_CLIENT_URL;
console.log(API_BASE_URL);
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await TokenService.getToken('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await TokenService.removeToken('userToken');
      // Navigate to login screen
    }
    return Promise.reject(error);
  }
);

export default apiClient;