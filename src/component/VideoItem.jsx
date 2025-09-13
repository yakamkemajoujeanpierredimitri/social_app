import { useIsFocused } from '@react-navigation/native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  View
} from 'react-native';
import { performanceMonitor, videoCacheManager } from '../../lib/VideoCache';
const { height, width } = Dimensions.get('window');



const VideoPlayer = ({ 
  videoUri, 
  isActive, 
  pic,
  preload = false,
  index
}) => {
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const isFocused = useIsFocused();
  const playerRef = useRef(null);

  // Create or get cached video player
  const getPlayer = () => {
    // Try to get from cache first
    const cachedPlayer = videoCacheManager.getPlayer(videoUri);
    if (cachedPlayer) {
      return cachedPlayer;
    }
    
    // Create new player if not in cache
    const loadStartTime = Date.now();
    const player = useVideoPlayer(videoUri, player => {
      player.loop = true;
      player.muted = false;
      
      // Track load time for performance monitoring
      const loadTime = Date.now() - loadStartTime;
      performanceMonitor.recordLoadTime(videoUri, loadTime);
      
      player.addEventListener('statusChange', (status) => {
        if (status === 'readyToPlay') {
          setIsReady(true);
        } else if (status === 'error') {
          performanceMonitor.recordError('Video load error');
          setIsReady(false);
        }
      });

      player.addEventListener('playbackStatusUpdate', (status) => {
        if (status.isBuffering) {
          performanceMonitor.recordBufferEvent();
        }
      });
    });
    
    // Add to cache
    videoCacheManager.setPlayer(videoUri, player);
    return player;
  };

  const player = getPlayer();
  playerRef.current = player;

  // Preload nearby videos
  useEffect(() => {
    if (preload && !isActive) {
      // Preload by seeking to first frame without playing
      player.seekTo(0);
    }
  }, [preload, videoUri]);

  useEffect(() => {
    const handlePlayback = async () => {
      if (isActive && isFocused && isReady) {
        setIsPlaying(true);
        player.play();
      } else {
        player.pause();
        setIsPlaying(false);
      }
    };

    handlePlayback();
  }, [isActive, isFocused, player, isReady]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current && !isActive) {
        // Keep in cache but pause
        playerRef.current.pause();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {!isPlaying || !isReady ? (
        <Image
          source={{uri: pic}}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          contentFit="contain"
          nativeControls={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  video: {
    borderRadius: 10,
    width: "100%",
    height: 350
  },
  image: {
    height: 350,
    width: "100%",
    borderRadius: 10,
  }
});

export default VideoPlayer;