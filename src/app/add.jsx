import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFile } from '../context/fileProvider';
import FileService from '../service/fileService';

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const {state}= useFile();
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [media, setMedia] = useState(state.recordfile);
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  const [status, setStatus] = useState({});
  const videoRef = useRef(null);
  const player  = useVideoPlayer(media);
 const [uploadProgress, setUploadProgress] = useState(0);
  // Request media library permissions
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your media library to select photos/videos');
      }
    })();
    console.log(state.recordfile);
    if (state.recordfile) {
        setMedia(state.recordfile);
        setMediaType(state.recordfile.type);
    }
  }, []);
    useEffect(() => {
    if (mediaType === 'video' && media) {
      //player.source = {uri:media.uri} ;
        player.isLooping = true;
      player.play();
      
    }
  }, [media, mediaType]);

  useEffect(()=>{
    setUploadProgress(state.uploadProgress);
  },[state.uploadProgress]);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setMedia(result.assets[0]);
        setMediaType(result.assets[0].type === 'image' ? 'image' : 'video');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image/video');
      console.error(error);
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaType(null);
    player.pause();
  };

  const handlePost = async () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter a title');
      return;
    }

    if (!media) {
      Alert.alert('Required', 'Please select a photo or video');
      return;
    }
    const n = prompt.split('#');
    if(n.length <2 || !prompt.trim()){
         Alert.alert('Required', 'Please select a photo or video');
      return;
    }  // Here you would typically upload the media and post data to your backend
     console.log( media);
    const postData = new FormData();
    postData.append('title',title);
    postData.append('prompt',prompt);
    postData.append('file',{
        uri:media.uri,
        type:mediaType,
        name:media.fileName
    })

   // console.log('Posting:', media);
    const res = await FileService.uploadFile(postData);
    Alert.alert('Success', 'Post created successfully!');
    navigation.navigate('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* Header with close button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() =>{
            player.pause();
           navigation.goBack() 
        } } style={styles.closeButton}>
          <Icon name="close" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
         <TouchableOpacity 
          onPress={handlePost} 
          style={styles.postButton}
          disabled={state.isUploadingVideo}
        >
          <Text style={[styles.postButtonText, state.isUploadingVideo && styles.disabledButton]}>
            {state.isUploadingVideo ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>
        {state.isUploadingVideo && (
        <View style={styles.progressBarContainer}>
         <Text style={styles.postButtonText} > {`${uploadProgress}¨%`}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Title Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="Post title..."
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* Media Picker and Preview */}
        <View style={styles.mediaSection}>
          {media ? (
            <View style={styles.mediaPreviewContainer}>
              {mediaType === 'image' ? (
                <Image source={{ uri: media.uri }} style={styles.mediaPreview} />
              ) : (
                <VideoView
                  style={styles.mediaPreview}
                 player={player}
                 allowsFullscreen
                 allowsPictureInPicture
                 nativeControls
                />
              )}
              <TouchableOpacity onPress={removeMedia} style={styles.removeMediaButton}>
                <Icon name="close-circle" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={pickImage} style={styles.mediaPicker}>
              <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                style={styles.gradient}
              >
                <Icon name="images" size={50} color="#fff" />
                <Text style={styles.mediaPickerText}>Add Photo/Video</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Prompt Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.textInput, styles.promptInput]}
            placeholder="Add your prompts here..."
            placeholderTextColor="#999"
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding:20
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  postButton: {
    padding: 5,
  },
  postButtonText: {
    color: '#4c669f',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mediaSection: {
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  mediaPicker: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaPickerText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  mediaPreviewContainer: {
    position: 'relative',
  },
  mediaPreview: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  removeMediaButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  promptInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  disabledButton: {
    color: '#ccc',
  },
  progressBarContainer: {
    height: 3,
    width: '100%',
    backgroundColor: '#e0e0e0',
  }
});

export default CreatePostScreen;