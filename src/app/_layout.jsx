import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { AppProvider, useAuth } from '../context/authProvider';
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
      } else if (state.isAuthenticated && (currentRoute === '/auth' || currentRoute === '/auth/signup') && currentRoute !== '/(tabs)/Home') {
        router.replace('/(tabs)/Home');
      }
    };
    handleNavigation();
  }, [state.isAuthenticated, navigation]);

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
    
      <Stack.Screen name="index" options={{ headerShown: false }} />
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
