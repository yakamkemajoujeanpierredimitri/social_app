import { useIsFocused } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFile } from '../../context/fileProvider';



const CameraScreen = () => {
  const { dispatch } = useFile();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState('back');
  const [cameraMode,setCameraMode] = useState('video');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [capturedVideo, setCapturedVideo] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasMediaPermission, setHasMediaPermission] = useState(null);
  const player =useVideoPlayer(capturedVideo);
  const cameraRef = useRef(null);
  const recordingTimer = useRef(null);
  const router = useRouter();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      (async () => {
        const { status: audioStatus } = await Audio.requestPermissionsAsync();
        const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
        
        setHasAudioPermission(audioStatus === 'granted');
        setHasMediaPermission(mediaStatus === 'granted');
      })();
    }
  }, [isFocused]);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    };
  }, []);

  const startRecording = async () => {
    setCameraMode('video');
    if (cameraRef.current && isCameraReady) {
      try {
        setIsRecording(true);
        setRecordingDuration(0);
        
        recordingTimer.current = setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);

        // Start recording (the video will be handled in stopRecording)
        const video = await cameraRef.current.recordAsync({
          maxDuration: 60, // 60 seconds max
        });
        setCapturedVideo(video);
          const name  = video.uri.split('/').pop();
           dispatch({
            type: 'SET_RECORD_FILE',
            payload: { file: {uri:video.uri, mimeType:`video/${name.split('.').pop()}` ,fileName:name} }
          });
          //console.log({uri:video.uri, mimeType:`video/${name.split('.').pop()}` ,fileName:name});
          //await MediaLibrary.saveToLibraryAsync(video.uri);
        //return video;
      } catch (error) {
        console.error('Recording failed:', error);
        Alert.alert('Error', 'Failed to start recording');
        setIsRecording(false);
        clearInterval(recordingTimer.current);
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      try {
        setIsRecording(false);
        clearInterval(recordingTimer.current);
        
        // Stop recording and get the video file
         await cameraRef.current.stopRecording();
        
          // Optional: Save to media library
          
         // router.navigate('/add');
        
      } catch (error) {
        console.error('Stop recording failed:', error);
        Alert.alert('Error', 'Failed to stop recording');
      }
    }
  };

  const takePicture = async () => {
    setCameraMode('picture');
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64:false, // Set to false to improve performance unless you specifically need base64
        });
      
        setCapturedPhoto(photo);
        dispatch({
          type: 'SET_RECORD_FILE',
          payload: { file: {...photo,
            mimeType:`image/${photo.format.replace('.','')}`,
            fileName: photo.uri.split('/').pop(),
          } }
        });
        // Optional: Save to media library
        //await MediaLibrary.saveToLibraryAsync(photo.uri);
        //router.navigate('/add');
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to capture photo');
      }
    }
  };

  const toggleCameraType = () => {
    setCameraType(
      cameraType === 'back'
        ? 'front'
        : 'back'
    );
  };
const ToogleCameraMode = () => {
  setCameraMode(
    cameraMode === 'video'
      ? 'picture'
      : 'video'
  );
}
  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  const handleGoBack = () => {
    // Stop recording if in progress before going back
    if (isRecording) {
      stopRecording();
    } else {
      router.back();
    }
  };

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../../assets/animation/load2.json')}
          style={styles.loadingAnimation}
          autoPlay
          loop
        />
        <Text style={styles.loadingText}>Requesting permissions...</Text>
      </View>
    );
  }

  if (!permission.granted || !hasAudioPermission || !hasMediaPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera, microphone, and media library access required
        </Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            if (!permission.granted) {
              requestPermission();
            }
            // Re-request other permissions
            (async () => {
              const { status: audioStatus } = await Audio.requestPermissionsAsync();
              const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
              
              setHasAudioPermission(audioStatus === 'granted');
              setHasMediaPermission(mediaStatus === 'granted');
            })();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (capturedPhoto) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedPhoto.uri }} style={styles.camera} />
        <View style={styles.previewControls}>
          <TouchableOpacity style={styles.previewButton} onPress={() => setCapturedPhoto(null)}>
            <Text style={styles.previewButtonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.previewButton} onPress={() => router.navigate('/add')}>
            <Text style={styles.previewButtonText}>Use Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  if (capturedVideo) {
    return (
      <View style={styles.container}>
        <VideoView
        player={player}
       allowsPictureInPicture
       allowsFullscreen
       nativeControls
       style={styles.camera}
        />
        <View style={styles.previewControls}>
          <TouchableOpacity style={styles.previewButton} onPress={() => setCapturedVideo(null)}>
            <Text style={styles.previewButtonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.previewButton} onPress={() => router.navigate('/add')}>
            <Text style={styles.previewButtonText}>Use video</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        mode={cameraMode}
        onCameraReady={handleCameraReady}
      />
      
      {/* Header Overlay */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleGoBack}
        >
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>
        
        {isRecording && (
          <View style={styles.timerContainer}>
            <View style={styles.recordingDot} />
            <Text style={styles.timerText}>
              {Math.floor(recordingDuration / 60)}:
              {(recordingDuration % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.headerButton}
          onPress={toggleCameraType}
          disabled={isRecording} // Disable camera flip during recording
        >
          <Icon name="camera-reverse" size={24} color={isRecording ? "#666" : "#fff"} />
        </TouchableOpacity>
      </View>

      {/* Recording Controls Overlay */}
      <View style={styles.controls}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
             styles.captureButton,
              isRecording && styles.disabledButton
            ]}
            onPress={ToogleCameraMode}
            disabled={isRecording || !isCameraReady}
          >
            {cameraMode !== 'picture' ? (
              <Icon name="camera" size={24} color={isRecording ? "#666" : "#fff"} />
            ) : (
              <Icon name="videocam" size={24} color={isRecording ? "#666" : "#fff"} />
            )}
          </TouchableOpacity>
          {
            cameraMode !== 'video' ? 
         
          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.disabledButton
            ]}
            onPress={takePicture}
            disabled={isRecording || !isCameraReady }
          >
            <Icon name="camera" size={24} color={isRecording ? "#666" : "#fff"} />
          </TouchableOpacity>
          :
          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordingButton,
              !isCameraReady && styles.disabledButton
            ]}
            onPress={isRecording ? stopRecording : startRecording}
            disabled={!isCameraReady }
          >
            {isRecording ? (
              <View style={styles.recordingIndicator} />
            ) : (
              <View style={styles.recordDot} />
            )}
          </TouchableOpacity> }
              
          <TouchableOpacity/>
          {/* Placeholder for symmetry */}
          
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingAnimation: {
    width: 100,
    height: 100,
  },
  loadingText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  permissionText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#fe2c55',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  recordingDot: {
    width: 8,
    height: 8,
    backgroundColor: '#ff0000',
    borderRadius: 4,
    marginRight: 8,
  },
  timerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    paddingHorizontal: 20,
  },
  captureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  recordingButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    transform: [{ scale: 1.1 }],
  },
  recordingIndicator: {
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  recordDot: {
    width: 20,
    height: 20,
    backgroundColor: '#fe2c55',
    borderRadius: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  previewControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  previewButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  previewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export  default CameraScreen;