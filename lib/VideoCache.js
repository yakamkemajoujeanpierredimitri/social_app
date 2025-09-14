// lib/VideoCache.js - Improved Version
import { useVideoPlayer } from 'expo-video';
import { useEffect, useRef } from "react";

class VideoCacheManager {
  constructor() {
    this.cache = new Map();
    this.maxCacheSize = 10;
    this.accessHistory = new Map();
    this.loadingPromises = new Map(); // Track loading promises to avoid duplicates
  }

  // Create player with proper error handling
  async createPlayer(videoUri) {
    // Check if already loading
    if (this.loadingPromises.has(videoUri)) {
      return this.loadingPromises.get(videoUri);
    }

    const loadingPromise = new Promise((resolve, reject) => {
      try {
        const player = useVideoPlayer(videoUri, (player) => {
          player.loop = true;
          player.muted = true; // Start muted for preloading
          
          player.addEventListener('statusChange', (status) => {
            if (status === 'readyToPlay') {
              resolve(player);
            } else if (status === 'error') {
              reject(new Error('Video failed to load'));
            }
          });
        });
      } catch (error) {
        reject(error);
      }
    });

    this.loadingPromises.set(videoUri, loadingPromise);
    
    try {
      const player = await loadingPromise;
      this.setPlayer(videoUri, player);
      return player;
    } catch (error) {
      console.warn('Failed to create player for:', videoUri, error);
      return null;
    } finally {
      this.loadingPromises.delete(videoUri);
    }
  }

  setPlayer(videoUri, player) {
    if (this.cache.size >= this.maxCacheSize && !this.cache.has(videoUri)) {
      this.evictLRU();
    }
    
    this.cache.set(videoUri, player);
    this.accessHistory.set(videoUri, Date.now());
  }

  getPlayer(videoUri) {
    if (this.cache.has(videoUri)) {
      this.accessHistory.set(videoUri, Date.now());
      return this.cache.get(videoUri);
    }
    return null;
  }

  evictLRU() {
    let oldestTime = Date.now();
    let oldestKey = null;

    for (const [key, time] of this.accessHistory) {
      if (time < oldestTime) {
        oldestTime = time;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      const player = this.cache.get(oldestKey);
      if (player) {
        try {
          player.release?.();
        } catch (error) {
          console.warn('Error releasing video player:', error);
        }
      }
      this.cache.delete(oldestKey);
      this.accessHistory.delete(oldestKey);
    }
  }

  clearCache() {
    for (const [key, player] of this.cache) {
      try {
        player.release?.();
      } catch (error) {
        console.warn('Error releasing player:', error);
      }
    }
    this.cache.clear();
    this.accessHistory.clear();
    this.loadingPromises.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      keys: Array.from(this.cache.keys()),
      loading: Array.from(this.loadingPromises.keys())
    };
  }
}

export const videoCacheManager = new VideoCacheManager();

// Fixed useVideoPreloader hook
export const useVideoPreloader = (posts, currentIndex, range = 2) => {
  const preloadingRef = useRef(new Set());

  useEffect(() => {
    const preloadVideos = async () => {
      if (!posts || posts.length === 0) return;

      const start = Math.max(0, currentIndex - range);
      const end = Math.min(posts.length - 1, currentIndex + range);

      // Clear old preloads that are out of range
      const currentPreloads = new Set();

      for (let i = start; i <= end; i++) {
        if (i !== currentIndex && posts[i]?.path) {
          const videoUri = posts[i].path;
          currentPreloads.add(videoUri);

          // Only preload if not already cached and not currently preloading
          if (!videoCacheManager.cache.has(videoUri) && !preloadingRef.current.has(videoUri)) {
            preloadingRef.current.add(videoUri);
            
            try {
              await videoCacheManager.createPlayer(videoUri);
            } catch (error) {
              console.warn('Preload failed for:', videoUri, error);
            } finally {
              preloadingRef.current.delete(videoUri);
            }
          }
        }
      }

      // Clean up preloads that are no longer needed
      preloadingRef.current.forEach(uri => {
        if (!currentPreloads.has(uri)) {
          preloadingRef.current.delete(uri);
        }
      });
    };

    preloadVideos();
  }, [posts, currentIndex, range]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      preloadingRef.current.clear();
    };
  }, []);
};

// Performance Monitor (unchanged)
export class VideoPerformanceMonitor {
  constructor() {
    this.metrics = {
      loadTimes: [],
      bufferEvents: 0,
      errors: 0,
      totalWatchTime: 0
    };
  }

  recordLoadTime(uri, loadTime) {
    this.metrics.loadTimes.push({ uri, loadTime, timestamp: Date.now() });
  }

  recordBufferEvent() {
    this.metrics.bufferEvents++;
  }

  recordError(error) {
    this.metrics.errors++;
    console.warn('Video error:', error);
  }

  getAverageLoadTime() {
    if (this.metrics.loadTimes.length === 0) return 0;
    const total = this.metrics.loadTimes.reduce((sum, item) => sum + item.loadTime, 0);
    return total / this.metrics.loadTimes.length;
  }

  getMetrics() {
    return {
      ...this.metrics,
      averageLoadTime: this.getAverageLoadTime()
    };
  }
}

export const performanceMonitor = new VideoPerformanceMonitor();