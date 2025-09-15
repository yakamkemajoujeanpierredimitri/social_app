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
import CommentModal from './CommentModal';

const { height, width } = Dimensions.get('window');

const BottomFeature = ({ file, isActive, index }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saves, setSaves] = useState(0);
  const [issave, setIssave] = useState(false);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [countcomm , setComments] = useState(0);
  const { state: authState, dispatch } = useFile();

  useEffect(() => {
    if (isActive) {
      paly();
      console.log(file._id);
    }
  }, [isActive]);

  useEffect(() => {
    setLikeCount(authState.likes);
    setSaves(authState.saves);
  }, [authState.likes, authState.saves]);

  const paly = async () => {
    await FileService.getObservation(dispatch, file._id);
  };

  const handleLike = async () => {
    const newLikedState = !isLiked;
    const num = newLikedState ? likeCount +1 : likeCount -1;
    setLikeCount(num <0 ? 0: num);
    setIsLiked(newLikedState);
    if(newLikedState){
      await FileService.addObservation(dispatch,{likes:file._id});
    }
     
    
  };

  const handleSave = async () => {
    const newsave  = !issave;
    const num = newsave ? saves +1 : saves -1 ;
    setSaves(num<0? 0: num);
    setIssave(newsave);
    if(newsave){
      await FileService.addObservation(dispatch, {save:file._id});
    }
    
    
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share video:', file._id);
  };

  const handleComment = () => {
    setIsCommentModalVisible(true);
  };

  return (
    <>
      <View style={styles.rightContent}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleLike()}>
          <Icon
            name={isLiked ? 'heart' : 'heart-outline'}
            size={28}
            color={isLiked ? '#fe2c55' : '#fff'}
          />
          <Text style={styles.actionText}>{likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
          <Icon name="chatbubble-outline" size={28} color="#fff" />
          <Text style={styles.actionText}>{countcomm}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Icon name="share-outline" size={28} color="#fff" />
          <Text style={styles.actionText}>{0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => handleSave()}>
          <Icon name={!issave ? 'bookmark-outline' : 'bookmark'} size={28} color="#fff" />
          <Text style={styles.actionText}>{saves}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="eye" size={28} color="#fff" />
          <Text style={styles.actionText}>{authState.view}</Text>
        </TouchableOpacity>

        {file.music && (
          <View style={styles.musicDisc}>
            <Image
              source={{ uri: file.thumbnail }}
              style={styles.musicCover}
            />
          </View>
        )}
      </View>
      <CommentModal
        isVisible={isCommentModalVisible}
        onClose={() => setIsCommentModalVisible(false)}
        file={file}
        setnum={setComments}
      />
    </>
  );
};

const styles = StyleSheet.create({

  rightContent: {
    alignItems: 'center',
    justifyContent: "space-around",
    width: "100%",
    flexDirection:'row',
    marginTop:10
    
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
