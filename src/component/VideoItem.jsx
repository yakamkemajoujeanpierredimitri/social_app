import { useIsFocused } from '@react-navigation/native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const VideoPlayer = ({ 
  videoUri, 
  isActive, 
  onPlaybackStatusUpdate,
  style 
}) => {
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isFocused = useIsFocused();

  // Create video player instance
  const player = useVideoPlayer(videoUri, player => {
    player.loop = true;
    player.muted = false;
  });

  useEffect(() => {
    // Listen to player status updates
    const subscription = player.addListener('playingChange', (newIsPlaying) => {
      setIsPlaying(newIsPlaying);
      if (onPlaybackStatusUpdate) {
        onPlaybackStatusUpdate({ isPlaying: newIsPlaying });
      }
    });

    return () => {
      subscription?.remove();
    };
  }, [player, onPlaybackStatusUpdate]);

  useEffect(() => {
    if (isActive && isFocused) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, isFocused, player]);

  const handlePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handlePress = () => {
    setShowControls(!showControls);
    setTimeout(() => setShowControls(false), 3000);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={[styles.container, style]}>
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          showsTimecodes={false}
          contentFit="cover"
        />
        
        {showControls && (
          <View style={styles.controlsOverlay}>
            <TouchableWithoutFeedback onPress={handlePlayPause}>
              <View style={styles.playButton}>
                <Text style={styles.playButtonText}>
                  {isPlaying ? '⏸️' : '▶️'}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 24,
  },
});

export default VideoPlayer;