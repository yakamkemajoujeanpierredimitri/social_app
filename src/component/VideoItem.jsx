// src/component/VideoItem.jsx - Simplified Version
import { useIsFocused } from '@react-navigation/native';
import { Image } from 'expo-image';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { placeholder } from '../assets/images';

const VideoPlayer = ({ 
  videoUri, 
  isActive, 
  pic,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(false);
  const screenFocused = useIsFocused();

  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    player.muted = true;
  });

  useEffect(() => {
    const subscription = player.addListener('statusChange', (status) => {
      if (status.status === 'readyToPlay') {
        setIsReady(true);
        setError(false);
      } else if (status.status === 'error') {
        setError(true);
        console.warn('Video error for:', videoUri);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [player, videoUri]);

  useEffect(() => {
    const shouldPlay = isActive && screenFocused && isReady && !error;
    
    if (shouldPlay) {
      player.muted = false;
      player.play();
    } else {
      if (player.playing) {
        player.pause();
      }
      player.muted = true;
    }
  }, [isActive, screenFocused, player, isReady, error]);

  useEffect(() => {
    return () => {
      player.release();
    };
  }, [player]);

  const handleVideoPress = () => {
    if (!player || !isReady) return;

    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: pic }}
          style={styles.image}
          contentFit="cover"
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
        {!isReady ? (
          <Image
            source={placeholder}
            style={styles.image}
            contentFit="cover"
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
   
    borderRadius: 10,
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

export default React.memo(VideoPlayer);
