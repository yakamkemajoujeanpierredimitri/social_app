import * as SecureStore from 'expo-secure-store';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken'
};

export const TokenService = {
  setToken: async (key, value) => {
    try {
      await SecureStore.setItemAsync(key, value);
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
      return true;
    } catch (error) {
      console.error('TokenService.clearAllTokens error:', error);
      return false;
    }
  }
};