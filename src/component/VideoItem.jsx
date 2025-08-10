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
  style 
}) => {
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isFocused = useIsFocused();

  // Create video player instance
  const player = useVideoPlayer(videoUri, player => {
    player.loop = true;
    player.play();
  });

  

  useEffect(() => {
    if (isActive && isFocused) {
      player.play();
    } else {
      player.pause();
    }
    console.log(`isactive=${isActive} && isfocuse=${isFocused} `);
  }, [isActive, isFocused, player]);

  const handlePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handlePress = () => {
    setShowControls(!showControls);
    setTimeout(() => setShowControls(false), 3000);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress} style={styles.container} >
      <View style={styles.video}>
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen={true}
          allowsPictureInPicture={true}
          showsTimecodes={false}
          contentFit="cover"
          nativeControls={true}
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
    width: '100%' ,
    height: SCREEN_HEIGHT,
    paddingBottom:20,
    flex:1,
    alignItems:'center'

  },
  video: {
    marginTop:50,
    height:'80%',
    width:'100%'
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