import { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFile } from '../context/fileProvider';
import FileService from '../service/fileService';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const BottomFeature = ({ file, isActive, index }) => {
  const [isLiked, setIsLiked] = useState( false);
  const [likeCount, setLikeCount] = useState(video.likes || 0);
  const [saves, setSaves] = useState(0);
  const { state: authState } = useFile();
useEffect(()=>{
    const paly = async ()=>{
        await FileService.getObservation(file._id);
    }
paly();
},[]);
useEffect(()=>{
    setLikeCount(authState.likes);
    setSaves(authState.saves);

},[authState.likes, authState.saves])

  const handleLike = async () => {
    const newLikedState = !isLiked;
    await FileService.addObservation(file._id,{likes:1});
    setIsLiked(newLikedState);
  };
    const handleSave = async () => {
    await FileService.addObservation(file._id,{save:1});
  };

 

  const handleShare = () => {
    // Implement share functionality
    console.log('Share video:', video._id);
  };

  const handleComment = () => {
    // Navigate to comments screen
    console.log('Open comments for video:', video._id);
  };

  return (
  
        
        <View style={styles.rightContent}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Icon
              name={isLiked ? 'heart' : 'heart-outline'}
              size={28}
              color={isLiked ? '#fe2c55' : '#fff'}
            />
            <Text style={styles.actionText}>{likeCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
            <Icon name="chatbubble-outline" size={28} color="#fff" />
            <Text style={styles.actionText}>{video.comments || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Icon name="share-outline" size={28} color="#fff" />
            <Text style={styles.actionText}>{video.shares || 0}</Text>
          </TouchableOpacity>
  <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
            <Icon name="mark" size={28} color="#fff" />
            <Text style={styles.actionText}>{saves}</Text>
          </TouchableOpacity>
           <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
            <Icon name="eye" size={28} color="#fff" />
            <Text style={styles.actionText}>{authState.view}</Text>
          </TouchableOpacity>
          {/* Spinning disc for music */}
          {file.thumbnail && (
            <View style={styles.musicDisc}>
              <Image
                source={{ uri: file.thumbnail }}
                style={styles.musicCover}
              />
            </View>
          )}
        </View>
   
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 50,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
  },
  leftContent: {
    flex: 1,
    paddingRight: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userDetails: {
    marginLeft: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  followButton: {
    marginLeft: 10,
    backgroundColor: '#fe2c55',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  followText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hashtag: {
    color: '#fe2c55',
    fontSize: 14,
    marginRight: 8,
    marginBottom: 4,
  },
  rightContent: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 60,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  musicDisc: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  musicCover: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
});

export default BottomFeature;
