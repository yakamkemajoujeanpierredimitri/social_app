import { useRouter } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const UserList = ({ users, onClose }) => {
  const router = useRouter();
  const handleUserPress = (userId) => {
    onClose();
    router.push(`/profile/${userId}`);
  };
//console.log(users);
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => handleUserPress(item._id)}>
      <Image source={ item.Author?._id ?  { uri: item.Author.avatar } : { uri: item.Follower.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{item.Author?._id ?  item.Author.name : item.Follower.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width:"100%",
    height:'100%'
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  closeButtonText: {
    color: '#FFD700',
    fontSize: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width:"100%",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  name: {
    color: '#fff',
    fontSize: 18,
  },
});

export default UserList;