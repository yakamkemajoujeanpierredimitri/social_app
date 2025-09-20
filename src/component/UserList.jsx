import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { avatar } from '../assets/images';
import { useAuth } from '../context/authProvider';

const UserList = ({ users, onClose, title }) => {
  const router = useRouter();
  const {dispatch} = useAuth();
  const handleUserPress = (user) => {
    onClose();
    dispatch({ type: "SET_visitor", payload: { visitor: user } });
    router.push(`/Profiles/${user?._id}`);
  };

  const Empty = () => (
    <View style={styles.noCommentsContainer}>
      <Ionicons name="people" size={50} color="#666" />
      <Text style={styles.noCommentsText}>{`No ${title}`}</Text>
    </View>
  );

  const renderItem = ({ item }) => {
    const user = item.Author?._id ? item.Author :  item.Follower;
    if (!user) return null;

    return (
      <TouchableOpacity style={styles.userItem} onPress={() => handleUserPress(user)}>
        <Image
          source={user.avatar === '/avatar.png' ? avatar : { uri: user.avatar }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>@{user.name.toLowerCase().replace(/\s/g, '')}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#000', '#121212', '#242424']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>
      <FlashList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={Empty}
        estimatedItemSize={100}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  listContent: {
    paddingVertical: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    color: '#999',
    fontSize: 14,
  },
  noCommentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  noCommentsText: {
    color: '#666',
    fontSize: 18,
    marginTop: 10,
  },
});

export default UserList;
