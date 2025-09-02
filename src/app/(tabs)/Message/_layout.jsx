import { Ionicons } from '@expo/vector-icons';
import { useNetInfo } from '@react-native-community/netinfo';
import { Stack, usePathname, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../context/authProvider';

const CustomHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { state } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const isProfiles = pathname.includes('Profiles');
  const netinfo = useNetInfo();
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
  useEffect(() => {
    Listenmessage();
    return () => {
      StopListen();
    };
  }, [Listenmessage, StopListen]);

  const Listenmessage = useCallback(() => {
    if (state.socket) {
      state.socket?.on('msg', (message) => {
      setUnreadCount((prevCount) => prevCount + 1);
      });
    }
  }, [state.socket]);

  const StopListen = useCallback(() => {
    state.socket?.off('msg');
  }, [state.socket]);

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
        <Ionicons name="arrow-back" size={24} color="#ffd700" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{isProfiles ? 'Profiles' : 'Discussions'}</Text>
      <TouchableOpacity onPress={() => router.push(isProfiles ? '/(tabs)/Message/Discussions' : '/(tabs)/Message/Profiles')} style={styles.iconButton}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons name={isProfiles ? "chatbubble-ellipses-outline" : "people-outline"} size={24} color="#ffd700" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default function MessageLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <CustomHeader />,
        headerShown: true,
      }}
    >
      <Stack.Screen name="Profiles" />
      <Stack.Screen name="Discussions" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#ffd700',
  },
  iconButton: {
    padding: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: 'red',
    borderRadius: 10,
    width: 13,
    height: 13,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf:'flex-start'
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
});