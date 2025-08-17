import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../context/authProvider';
import ChatService from '../../../service/chatService';

const DiscussionsScreen = () => {
  const { state , dispatch} = useAuth();
  const [recentChats, setRecentChats] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRecentChats = async () => {
      const res = await ChatService.Lastmessage();
      console.log(res.data);
      if (res.data) {
        setRecentChats(res.data);
      }
    };
    fetchRecentChats();
  }, []);

  const handleChatPress = (chat) => {
    dispatch({ type: 'SET_Guest', payload: { ricever: chat } });
    router.push(`/Message/${chat._id}`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={recentChats}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item.sender?._id === state.user?._id ? item.receiver :item.sender )}>
            <Image source={ item.sender?._id === state.user?._id ? { uri: item.receiver.avatar} :{ uri: item.sender.avatar}} style={styles.profileImage} />
            <View style={styles.chatInfo}>
              <Text style={styles.profileName}>{item.sender?._id === state.user?._id ? item.receiver.name : item.sender.name}</Text>
              <Text style={styles.lastMessage}>{item.content|| "image..."}</Text>
            </View>
            <Text style={styles.timestamp}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  profileName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    color: '#999',
    fontSize: 14,
  },
  timestamp: {
    color: '#999',
    fontSize: 12,
  },
});

export default DiscussionsScreen;
