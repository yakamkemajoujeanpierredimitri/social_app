import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { AppProvider } from '../context/authProvider';
export default function RootLayout() {
  
  return (
    
    <AppProvider>
      <>
    <Stack 
    
    screenOptions={{
      headerStyle:{
        backgroundColor:'#000',
        
      },
      headerTitleAlign:'center',
      headerTintColor:'#fff'
    }}
    >

      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="add" options={{ headerShown: false }} />
      <Stack.Screen name="watch" options={{ headerShown: false }} />
      <Stack.Screen name="Message" options={{ headerShown: true }} />
      <Stack.Screen name="Profiles" options={{ headerShown: true }} />
      <Stack.Screen name="offline" options={{ headerShown: false }} />
    </Stack>
    <StatusBar barStyle={'light-content'} />
    </>
    </AppProvider>
    
    
  );
}
