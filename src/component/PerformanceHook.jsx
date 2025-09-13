// hooks/useVideoCache.js
import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { networkQualityManager, performanceMonitor, videoCacheManager } from '../../lib/VideoCache';

export const useVideoCache = () => {
  const appState = useRef(AppState.currentState);

  // Initialize cache management
  useEffect(() => {
    // Check network quality on mount
    networkQualityManager.checkNetworkQuality();

    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground
        console.log('App has come to the foreground');
      } else if (nextAppState.match(/inactive|background/)) {
        // App has gone to the background - clear cache to save memory
        videoCacheManager.clearCache();
        console.log('App has gone to the background - cache cleared');
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  // Preload videos around current position
  const preloadAroundIndex = useCallback((posts, currentIndex, range = 2) => {
    videoCacheManager.preloadVideos(posts, currentIndex, range);
  }, []);

  // Get cache statistics
  const getCacheStats = useCallback(() => {
    return videoCacheManager.getStats();
  }, []);

  // Get performance metrics
  const getPerformanceMetrics = useCallback(() => {
    return performanceMonitor.getMetrics();
  }, []);

  // Clear cache manually
  const clearCache = useCallback(() => {
    videoCacheManager.clearCache();
  }, []);

  // Get network quality
  const getNetworkQuality = useCallback(() => {
    return networkQualityManager.getQuality();
  }, []);

  return {
    preloadAroundIndex,
    getCacheStats,
    getPerformanceMetrics,
    clearCache,
    getNetworkQuality,
  };
};