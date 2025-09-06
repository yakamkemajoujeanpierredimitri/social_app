import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
const AuthLayout = ()=>{
    useEffect(()=>{
        GoogleSignin.configure({
            webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
            iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
            androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
            profileImageSize: 120
        });
    },[]);
return(
    
    <Stack>
        <Stack.Screen name='index' options={{headerShown:false}}/>
        <Stack.Screen name='signup' options={{headerShown:false}}/>
    </Stack>
);
}
export default AuthLayout;