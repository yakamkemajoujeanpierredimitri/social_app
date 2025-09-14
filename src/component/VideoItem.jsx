// src/component/VideoItem.jsx - Improved Version
import { useIsFocused } from '@react-navigation/native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { performanceMonitor, videoCacheManager } from '../../lib/VideoCache';

const { height, width } = Dimensions.get('window');

const VideoPlayer = ({ 
  videoUri, 
  isActive, 
  pic,
  preload = false,
  index,
  isFocused = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(false);
  const screenFocused = useIsFocused();
  const playerRef = useRef(null);
  const loadStartTime = useRef(Date.now());
  const newcreate  = useVideoPlayer(videoUri,(player) => {
        player.loop = true;
        player.muted = !isActive; // Only unmute active videos
        
        player.addEventListener('statusChange', (status) => {
          if (status === 'readyToPlay') {
            const loadTime = Date.now() - loadStartTime.current;
            performanceMonitor.recordLoadTime(videoUri, loadTime);
            setIsReady(true);
            setError(false);
          } else if (status === 'error') {
            performanceMonitor.recordError('Video load error');
            setIsReady(false);
            setError(true);
            console.warn('Video error for:', videoUri);
          } else if (status === 'loading') {
            setIsReady(false);
          }
        });
        player.addEventListener('playbackStatusUpdate', (status) => {
          if (status.isBuffering) {
            performanceMonitor.recordBufferEvent();
          }
        });
      });
  // Create or get cached video player
  const getOrCreatePlayer = useCallback(() => {
    // Try to get from cache first
    const cachedPlayer = videoCacheManager.getPlayer(videoUri);
    if (cachedPlayer) {
      return cachedPlayer;
    }
    
    // Create new player if not in cache
    
    try {
      // Add to cache
      videoCacheManager.setPlayer(videoUri, newcreate);
      return null ;
    } catch (err) {
      console.error('Failed to create video player:', err);
      setError(true);
      return null;
    }
  }, [videoUri, isActive]);

  const player = getOrCreatePlayer();
  playerRef.current = player || newcreate;

  // Handle preloading
  useEffect(() => {
    if (preload && !isActive && player && isReady) {
      // Preload by seeking to first frame without playing
      try {
        player.seeKBy(0);
      } catch (err) {
        console.warn('Error preloading video:', err);
      }
    }
  }, [preload, isActive, player, isReady]);

  // Handle playback state
  useEffect(() => {
    if (!player) return;

    const shouldPlay = isActive && isFocused && screenFocused && isReady && !error;
    
    if (shouldPlay) {
      player.muted = false;
      player.play();
      setIsPlaying(true);
    } else {
      player.pause();
      if (!isActive) {
        player.muted = true; // Mute inactive videos
      }
      setIsPlaying(false);
    }
  }, [isActive, isFocused, screenFocused, player, isReady, error]);

  // Handle tap to play/pause (optional)
  const handleVideoPress = useCallback(() => {
    if (!player || !isActive) return;
    
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else if (isReady) {
      player.play();
      setIsPlaying(true);
    }
  }, [player, isActive, isPlaying, isReady]);

  // Cleanup
  useEffect(() => {
    return () => {
      // Don't release the player here as it's managed by the cache
      // Just pause if it's not active
      if (playerRef.current && !isActive) {
        try {
          playerRef.current.pause();
        } catch (err) {
          console.warn('Error pausing video on cleanup:', err);
        }
      }
    };
  }, [isActive]);

  // Show placeholder if error or not ready
  if (error || !player || (!isReady && !preload)) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: pic }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setError(true)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.touchable} 
        onPress={handleVideoPress}
        activeOpacity={1}
      >
        {!isReady || (!isPlaying && !preload) ? (
          <Image
            source={{ uri: pic }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <VideoView
            style={styles.video}
            player={player}
            allowsFullscreen={false}
            allowsPictureInPicture={false}
            contentFit="cover"
            nativeControls={false}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  touchable: {
    width: "100%",
    height: 350,
  },
  video: {
    width: "100%",
    height: 350,
  },
  image: {
    height: 350,
    width: "100%",
  },
});

export default VideoPlayer;