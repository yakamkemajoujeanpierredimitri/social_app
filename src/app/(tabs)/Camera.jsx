import { Audio } from 'expo-av';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFile } from '../../context/fileProvider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CameraScreen = () => {
  const { dispatch } = useFile();
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [permentvideo, setPermentvideo] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef(null);
  const recordingTimer = useRef(null);
const router = useRouter();
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      
      setHasPermission(
        cameraStatus === 'granted' && 
        audioStatus === 'granted' && 
        mediaStatus === 'granted'
      );
    })();
  }, []);

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        setRecordingDuration(0);
        
        recordingTimer.current = setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);
        const video = await cameraRef.current.recordAsync({
          quality: Camera.Constants.VideoQuality['720p'],
          maxDuration: 60, // 60 seconds max
        });

        setPermentvideo(video);
      } catch (error) {
        console.error('Recording failed:', error);
        Alert.alert('Error', 'Failed to record video');
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      try {
        setIsRecording(false);
        clearInterval(recordingTimer.current);
        
        await cameraRef.current.stopRecording();
        dispatch({
          type: 'SET_RECORD_FILE',
          payload: { file: permentvideo }
        });
        router.navigate('/add');
      } catch (error) {
        console.error('Stop recording failed:', error);
      }
    }
  };

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
        });
        
        setCapturedPhoto(photo);
        dispatch({
          type: 'SET_CAPTURED_FILE',
          payload: { file: photo }
        });
        
        // Optional: Save to media library
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        router.navigate('/add');
       // Alert.alert('Success', 'Photo captured successfully!');
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to capture photo');
      }
    }
  };

  const toggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  if (hasPermission === null) {
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

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera, microphone, and media library access required
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        ratio="16:9"
        onCameraReady={handleCameraReady}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
          
          {isRecording && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                {Math.floor(recordingDuration / 60)}:
                {(recordingDuration % 60).toString().padStart(2, '0')}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.headerButton}
            onPress={toggleCameraType}
          >
            <Icon name="camera-reverse" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Recording Controls */}
        <View style={styles.controls}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
              disabled={isRecording}
            >
              <Icon name="camera" size={24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordingButton,
              ]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              {isRecording && (
                <View style={styles.recordingIndicator} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
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
    justifyContent: 'space-around',
    width: '80%',
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
    backgroundColor: '#fe2c55',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  recordingButton: {
    backgroundColor: '#ff0000',
    transform: [{ scale: 1.1 }],
  },
  recordingIndicator: {
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
});

export default CameraScreen;