//import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "./apiClient";
import { TokenService } from "./Security";

const AuthService = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/user/login?app=true', credentials);
      await TokenService.setToken('userToken', response.data.accessToken);
      //await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      return {data: response.data};
    } catch (error) {
      console.error('AuthService.login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      return {msg:errorMessage};
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post('/user/signup?app=true', userData);
      await TokenService.setToken('userToken', response.data.accessToken);
      return {data: response.data};
    } catch (error) {
      console.error('AuthService.register error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      return {msg:errorMessage};
    }
  },
  logout: async () => {
    try {
      await TokenService.clearAllTokens();
      //await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error( error);
      const errorMessage = error.response?.data?.message || 'Logout failed';
      return {msg:errorMessage};
    }
  },
  checkAuth: async()=>{
    try {
        const res = await apiClient.get('/user?app=true');
        return {data: res.data};
    } catch (error) {
      console.error('AuthService.checkAuth error:', error);
      const errorMessage = error.response?.data?.message || 'Check authentication failed';
      return {msg:errorMessage};
        
    }
  }
};

export default AuthService;
