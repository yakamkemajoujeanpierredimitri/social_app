import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { AppProvider, useAuth } from '../context/authProvider';

function RootLayoutNav() {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleNavigation = async () => {
      const currentRoute = router.pathname;
      if (!state.isAuthenticated && currentRoute !== '/offline' && currentRoute !== '/auth/signup') {
        router.replace('/auth');
      } else if (state.isAuthenticated) {
        router.replace('/(tabs)/Home');
      }
    };
    handleNavigation();
  }, [state.isAuthenticated, router.pathname]);

  return (
    <Stack 
    
    screenOptions={{
      headerStyle:{
        backgroundColor:'#000',
        
      },
      headerTitleAlign:'center',
      headerTintColor:'#fff'
    }}
    >

      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="add" options={{ headerShown: false }} />
      <Stack.Screen name="watch" options={{ headerShown: false }} />
      <Stack.Screen name="Message" options={{ headerShown: true }} />
      <Stack.Screen name="Profiles" options={{ headerShown: true }} />
      <Stack.Screen name="offline" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {

  return (
    
    <AppProvider>
      <>
        <RootLayoutNav />
        <StatusBar barStyle={'light-content'} />
      </>
    </AppProvider>
    
    
  );
}
