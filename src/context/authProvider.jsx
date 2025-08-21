import { createContext, useContext, useEffect, useReducer } from 'react';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import AuthService from "../service/authService";
import { VideoProvider } from './fileProvider';

const AuthContext = createContext();

const authInitialState = {
  user: null,
  isLoading: false,
  error: null,
  socket: null,
  isAuthenticated: false,
  visitor:null,
  ricever:null,
  onlineusers:[]
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'REGISTER_START':
      return { ...state, isLoading: true, error: null };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        isAuthenticated: true,
        error: null,
      }
    case 'SET_ONLINE_USERS':
      return{
        ...state,
        onlineusers:action.payload
      }
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        isAuthenticated: true,
        error: null,
      };

    case 'LOGIN_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case 'REGISTER_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isAuthenticated: false,
      };

    case 'LOGOUT':
      return {
        ...authInitialState,
      };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
      };
    case 'SET_SOCKET':
      return {
        ...state,
        socket: action.payload.socket,
      };
    case "Check_finish":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user || null,
      };
    case "Check_start":
      return {
        ...state,
        isLoading: true,
      };
    case'SET_visitor':
      return{
        ...state,
        visitor:action.payload.visitor
      }
     case'SET_Guest':
      return{
        ...state,
        ricever:action.payload.ricever
      }
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, authInitialState);


  const Login = async (data) => {
    dispatch({ type: 'LOGIN_START' });
    const res = await AuthService.login(data);
    if (res?.msg) {
      console.log(res.msg);
      dispatch({
        type: "LOGIN_ERROR",
        payload: res.msg
      });
      return;
    }
    delete res.data.accessToken;
    delete res.data.refreshToken;
    Connect(res.data._id);
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: { user: res.data }
    });
  }
  const Register = async (data) => {
    dispatch({ type: 'REGISTER_START' });
    const res = await AuthService.register(data);
    if (res?.msg) {
      console.log(res.msg);
      dispatch({
        type: "REGISTER_ERROR",
        payload: res.msg
      });
      return;
    }
    delete res.data.accessToken;
    delete res.data.refreshToken;
    Connect(res.data._id);
    dispatch({
      type: "REGISTER_SUCCESS",
      payload: { user: res.data }
    });
  }
  const Logout = async () => {
    await AuthService.logout();
    dispatch({ type: 'LOGOUT' });
    if(state.socket){
       state.socket.disconnect();
    }
   
  }
  const Connect = (id)=>{
    const res = io(process.env.EXPO_PUBLIC_CLIENT_URL,{
        query: {
        userID: id,
      },
    });
    res.connect();
    res.on('onlineusers',(users)=>{
       dispatch({
      type:'SET_ONLINE_USERS',
      payload:users
    });
    });
    dispatch({
      type:'SET_SOCKET',
      payload:{socket:res}
    });
  }

  // Check for stored token on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (state.isAuthenticated) return;
      dispatch({
        type: "Check_start"
      });
      const res = await AuthService.checkAuth();
      if (res?.msg) {
        console.log(res.msg);
        dispatch({
          type: "Check_finish",
          payload: { user: null }
        });
        return;
      }
      Connect(res.data._id);
      dispatch({
        type: "Check_finish",
        payload: { user: res.data }
      });
    };

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch, Login, Register, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export const AppProvider = ({ children }) => {
  return(
    <AuthProvider>
      <VideoProvider>
        {children}
      </VideoProvider>
    </AuthProvider>
  )
};