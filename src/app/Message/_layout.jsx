import { useNetInfo } from '@react-native-community/netinfo';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useAuth } from '../../context/authProvider';



export default function MessageLayout() {
    const router  = useRouter();
  const netinfo = useNetInfo();
  const {state} = useAuth();
  useEffect(()=>{
    if (netinfo.isConnected === false) {
      Alert.alert("No Internet Connection", "Please check your network settings.");
      router.push('/offline');
      return ;
    }
    if( state.isAuthenticated === false){
      router.push('/auth');
      return ;
    }
  }, [netinfo.isConnected , state.isAuthenticated]);
  return (
    <Stack 
    
    screenOptions={{
     headerStyle:{
      backgroundColor:"#000"
     }
    }}
    >
      <Stack.Screen 
        name="[id]" 
        options={{ 
          headerShown: false,
        }} 
      />
      
    </Stack>
  );
}

