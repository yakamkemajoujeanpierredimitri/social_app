// utils/videoCacheManager.js
import { useVideoPlayer } from 'expo-video';
import { useEffect } from "react";
class VideoCacheManager {
  constructor() {
    this.cache = new Map();
    this.maxCacheSize = 10; // Maximum number of videos to keep in cache
    this.accessHistory = new Map(); // Track access times for LRU eviction
  }

  // Add or update video player in cache
  setPlayer(videoUri, player) {
    // If cache is full, remove least recently used
    if (this.cache.size >= this.maxCacheSize && !this.cache.has(videoUri)) {
      this.evictLRU();
    }
    
    this.cache.set(videoUri, player);
    this.accessHistory.set(videoUri, Date.now());
  }

  // Get video player from cache
  getPlayer(videoUri) {
    if (this.cache.has(videoUri)) {
      this.accessHistory.set(videoUri, Date.now());
      return this.cache.get(videoUri);
    }
    return null;
  }

  // Remove least recently used video
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
          player.release?.(); // Release video resources
        } catch (error) {
          console.warn('Error releasing video player:', error);
        }
      }
      this.cache.delete(oldestKey);
      this.accessHistory.delete(oldestKey);
    }
  }

  

  // Clear all cached videos
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
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Singleton instance
export const videoCacheManager = new VideoCacheManager();

// Network Quality Manager for adaptive streaming
class NetworkQualityManager {
  constructor() {
    this.quality = 'auto'; // 'low', 'medium', 'high', 'auto'
    this.listeners = [];
  }

  // Monitor network conditions
  async checkNetworkQuality() {
    try {
      // Simple network test - in real app, use more sophisticated method
      const start = Date.now();
      const response = await fetch('https://httpbin.org/bytes/1024', {
        cache: 'no-cache'
      });
      const duration = Date.now() - start;
      
      if (duration < 500) {
        this.setQuality('high');
      } else if (duration < 1000) {
        this.setQuality('medium');
      } else {
        this.setQuality('low');
      }
    } catch (error) {
      this.setQuality('low'); // Default to low on error
    }
  }

  setQuality(quality) {
    if (this.quality !== quality) {
      this.quality = quality;
      this.listeners.forEach(listener => listener(quality));
    }
  }

  getQuality() {
    return this.quality;
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }
}

export const networkQualityManager = new NetworkQualityManager();

// Performance Monitor
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
// ...existing code...

export const useVideoPreloader = (posts, currentIndex, range = 2) => {
  useEffect(() => {
    const preloadVideos = async () => {
      const start = Math.max(0, currentIndex - range);
      const end = Math.min(posts.length - 1, currentIndex + range);

      for (let i = start; i <= end; i++) {
        if (i !== currentIndex && posts[i]?.path) {
          if (!videoCacheManager.cache.has(posts[i].path)) {
            try {
              const player = useVideoPlayer(posts[i].path, player => {
                player.muted = true;
              });
              videoCacheManager.setPlayer(posts[i].path, player);
            } catch (error) {
              console.warn('Preload failed for:', posts[i].path, error);
            }
          }
        }
      }
    };

    preloadVideos();
  }, [posts, currentIndex, range]);
};