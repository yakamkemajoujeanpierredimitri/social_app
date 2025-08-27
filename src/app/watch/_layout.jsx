
import { useNetInfo } from '@react-native-community/netinfo';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../context/authProvider';

const WatchLayout = () => {
    const router  = useRouter();
  const netinfo = useNetInfo();
  const {state} = useAuth();
  useEffect(()=>{
    if (netinfo.isConnected === false) {
      Alert.alert("No Internet Connection", "Please check your network settings.");
      router.navigate('/offline');
      return ;
    }
    if( state.isAuthenticated === false){
      router.navigate('/auth');
      return ;
    }
  }, [netinfo.isConnected , state.isAuthenticated]);
    return (
        <Stack>
            <Stack.Screen name="[id]" options={{ headerShown: false }} />
        </Stack>
    );
};

export default WatchLayout;
