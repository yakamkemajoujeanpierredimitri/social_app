import * as SecureStore from 'expo-secure-store';
import moment from 'moment';
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'userToken',
  REFRESH_TOKEN: 'refreshToken'
};

export const TokenService = {
  setToken: async (key, value) => {
    try {
      const time = moment.defaultFormat();
      await SecureStore.setItemAsync(key, value);
      await SecureStore.setItemAsync('time',time);
      await SecureStore.setItemAsync('isvalid','true');
      return true;
    } catch (error) {
      console.error('TokenService.setToken error:', error);
      return false;
    }
  },

  getToken: async (key) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('TokenService.getToken error:', error);
      return null;
    }
  },

  removeToken: async (key) => {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (error) {
      console.error('TokenService.removeToken error:', error);
      return false;
    }
  },

  clearAllTokens: async () => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      await SecureStore.deleteItemAsync('time');
      await SecureStore.deleteItemAsync('isvalid');
      return true;
    } catch (error) {
      console.error('TokenService.clearAllTokens error:', error);
      return false;
    }
  }
};