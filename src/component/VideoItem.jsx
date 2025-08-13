import { useIsFocused } from '@react-navigation/native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  View
} from 'react-native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const VideoPlayer = ({ 
  videoUri, 
  isActive, 
  pic
}) => {
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const isFocused = useIsFocused();

  // Create video player instance
  const player = useVideoPlayer(videoUri, player => {
    player.loop = true;
    player.play();
  });

  

  useEffect(() => {
    if (isActive && isFocused) {
      setIsPlaying(true);
      player.play();
      
    } else {
      player.pause();
      setIsPlaying(false);
    }
    console.log(`isactive=${isActive} && isfocuse=${isFocused} `);
  }, [isActive, isFocused, player]);


  return (
   
      <View>
        {
          !isPlaying ? (
            <Image
            source={{uri:pic}}
            style={styles.image}
            />
          ) : <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen={true}
          allowsPictureInPicture={true}
          contentFit="contain"
          nativeControls={true}
        />
        }
       
    
      </View>
  
  );
};

const styles = StyleSheet.create({

video:{
borderRadius:10,
width:"100%",
height:350
},
 
  image:{
    height:300,
    width:"100%",
    borderRadius:10,
    objectFit:'contain',

  }
});

export default VideoPlayer;