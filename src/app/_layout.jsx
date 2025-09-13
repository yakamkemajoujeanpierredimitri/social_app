import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { AppProvider, useAuth } from '../context/authProvider';
import { DebugButton, DebugProvider } from '../context/debugContext';
import { VideoProvider } from '../context/fileProvider';

function RootLayoutNav() {
  const { state } = useAuth();
  const router = useRouter();
  const navigation = usePathname();

  useEffect(() => {
    const handleNavigation = async () => {
      const currentRoute = navigation;
      console.log('Current route:', currentRoute, 'Authenticated:', state.isAuthenticated);
      if (!state.isAuthenticated && currentRoute !== '/offline' && currentRoute !== '/auth/signup' && currentRoute !== '/auth') {
        router.replace('/auth');
      } else if (state.isAuthenticated && (currentRoute === '/auth' || currentRoute === '/auth/signup')) {
        router.replace('/(tabs)/Home');
      }
    };
    handleNavigation();
  }, [state.isAuthenticated, navigation]);

  // Determine when to show debug button
  const shouldShowDebugButton = state.isAuthenticated && 
    (navigation === '/(tabs)/Home' || 
     navigation === '/Home' || 
     navigation.includes('tabs') ||
     navigation.includes('watch'));

  return (
    <>
      <Stack 
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTitleAlign: 'center',
          headerTintColor: '#fff'
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

      {/* Debug button - shows on video-related screens */}
      <DebugButton show={shouldShowDebugButton} />
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <VideoProvider>
        <DebugProvider>
          <RootLayoutNav />
          <StatusBar barStyle={'light-content'} />
        </DebugProvider>
      </VideoProvider>
    </AppProvider>
  );
}