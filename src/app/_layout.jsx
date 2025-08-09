import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { AppProvider } from '../context/authProvider';
export default function RootLayout() {
  
  return (
    
    <AppProvider>
      <>
    <Stack>

      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="add" options={{ headerShown: false }} />
    </Stack>
    <StatusBar barStyle={'light-content'} />
    </>
    </AppProvider>
    
    
  );
}
