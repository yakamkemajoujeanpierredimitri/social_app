import { Ionicons } from '@expo/vector-icons';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CustomHeader = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isProfiles = pathname.includes('Profiles');

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
        <Ionicons name="arrow-back" size={24} color="#ffd700" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{isProfiles ? 'Profiles' : 'Discussions'}</Text>
      <TouchableOpacity onPress={() => router.push(isProfiles ? '/(tabs)/Message/Discussions' : '/(tabs)/Message/Profiles')} style={styles.iconButton}>
        <Ionicons name={isProfiles ? "chatbubble-ellipses-outline" : "people-outline"} size={24} color="#ffd700" />
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
      <Stack.Screen name="Profiles"  />
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
});
