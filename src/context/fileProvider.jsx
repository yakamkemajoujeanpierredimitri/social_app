import { createContext, useContext, useReducer } from 'react';
//import AsyncStorage from '@react-native-async-storage/async-storage';


// Video Context
const VideoContext = createContext();

const videoInitialState = {
  file: null,
  currentPage: null,
  isLoading: false,
  isUploadingVideo: false,
  uploadProgress: 0,
  error: null,
  refreshing: false,
  recordfile:null,
  likes:0,
  view:0,
  saves:0,
};

const videoReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_VIDEO_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'FETCH_VIDEO_SUCCESS':
      const { file } = action.payload;
      return {
        ...state,
        isLoading: false,
        refreshing: false,
        file,
      };
    
    case 'FETCH_VIDEO_ERROR':
      return {
        ...state,
        isLoading: false,
        refreshing: false,
        error: action.payload,
      };
    
    case 'LIKE_VIDEO':
      return {
        ...state,
        likes:action.payload.success ? state.likes +1 : state.likes,
      }; 
     case 'SAVES_VIDEO':
      return {
        ...state,
        saves:action.payload.success ? state.saves +1 : state.saves,
      }; 
    case 'UPLOAD_VIDEO_START':
      return {
        ...state,
        isUploadingVideo: true,
        uploadProgress: 0,
        error: null,
      };
    
    case 'UPLOAD_VIDEO_PROGRESS':
      return {
        ...state,
        uploadProgress: action.payload,
      };
    
    case 'UPLOAD_VIDEO_SUCCESS':
      return {
        ...state,
        isUploadingVideo: false,
        uploadProgress: 100,
      };
    
    case 'UPLOAD_VIDEO_ERROR':
      return {
        ...state,
        isUploadingVideo: false,
        uploadProgress: 0,
        error: action.payload,
      };
    
    case 'CLEAR_VIDEO':
      return {
        ...state,
        file: null,
        currentPage: 1,
      };
      case 'SET_Page':
      return {
        ...state,
        currentPage:action.payload.n
      }; 
      case 'SET_PROP':
        const {likesCount, savesCount, seeCounts} = action.payload;
      return {
        ...state,
        saves:savesCount,
        likes:likesCount,
        view:seeCounts
      }; 
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'SET_REFRESHING':
      return { ...state, refreshing: action.payload };
    case 'SET_RECORD_FILE':
      return{
        recordfile:action.payload.file
      }
      case 'DELETE_VIDEO_SUCCESS':
      return {
        ...state,
        file: null,
        isLoading:false
      };
    
    case 'DELETE_VIDEO_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    
    default:
      return state;
  }
};

export const VideoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(videoReducer, videoInitialState);

  return (
    <VideoContext.Provider value={{ state, dispatch }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useFile = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useFile must be used within a VideoProvider');
  }
  return context;
};