import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { avatar } from '../assets/images';

const UserList = ({ users, onClose ,title}) => {
  const router = useRouter();
  const handleUserPress = (userId) => {
    onClose();
    router.push(`/profile/${userId}`);
  };
console.log(users);
const Empty = ()=>{
  return (
    <>
    <View style={styles.noCommentsContainer} >
      <Ionicons name='people' size={50} color={'#666'} />
      <Text style={styles.noCommentsText} > {`No ${title}`} </Text>
    </View>
    </>
  )
}

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => handleUserPress(item._id)}>
      <Image source={ item.Author?._id ? item.Author.avatar === '/avatar.png' ? avatar :    { uri: item.Author.avatar } : item.Follower.avatar==='/avatar.png' ? avatar : { uri: item.Follower.avatar || avatar }} style={styles.avatar} />
      <Text style={styles.name}>{item.Author?._id ?  item.Author.name : item.Follower.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
      <FlashList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        snapToAlignment="start"
          decelerationRate="fast"
          pagingEnabled={true}
          showsVerticalScrollIndicator={false}
          
          // Memory and performance optimization
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          windowSize={10}
          removeClippedSubviews={false}
          ListEmptyComponent={Empty}

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
    noCommentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noCommentsText: {
    color: '#666',
    fontSize: 18,
  },
});

export default UserList;