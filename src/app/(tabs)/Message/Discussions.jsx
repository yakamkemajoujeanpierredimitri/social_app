import { useRouter } from 'expo-router';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { avatar } from '../../../assets/images';
import MessageSkeleton from '../../../component/MessageSkeleton';
import { useAuth } from '../../../context/authProvider';
import ChatService from '../../../service/chatService';

const DiscussionsScreen = () => {
  const { state, dispatch } = useAuth();
  const [recentChats, setRecentChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchRecentChats = async () => {
      const res = await ChatService.Lastmessage();
      if (res.data) {
        setRecentChats(res.data);
      }
      setIsLoading(false);
    };
    fetchRecentChats();
  }, []);
useEffect(() => {
    setOnlineUsers(state.onlineusers);
  }, [state.onlineusers]);

  const handleChatPress = (chat) => {
    dispatch({ type: 'SET_Guest', payload: { ricever: chat } });
    router.push(`/Message/${chat._id}`);
  };

  const formatTimestamp = (timestamp) => {
    const now = moment();
    const postTime = moment(timestamp);
    const diffSeconds = now.diff(postTime, 'seconds');
    const diffMinutes = now.diff(postTime, 'minutes');
    const diffHours = now.diff(postTime, 'hours');
    const diffDays = now.diff(postTime, 'days');

    if (diffSeconds < 60) {
      return `${diffSeconds}s`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return postTime.format('MMM D');
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <MessageSkeleton />
      ) : (
        <FlatList
          data={recentChats}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item.sender?._id === state.user?._id ? item.receiver : item.sender)}>
              <Image source={(item.sender?.avatar || item.receiver?.avatar) && (item.sender?.avatar !=="/avatar.png" || item.receiver?.avatar !=='/avatar.png') ?  item.sender?._id === state.user?._id ?  { uri: item.receiver.avatar } : { uri: item.sender.avatar } : avatar} style={ [styles.profileImage , { marginRight: onlineUsers.includes(item.sender?._id === state.user?._id ? item.receiver._id : item.sender._id) ? 1 : 15 }]} />
              {onlineUsers.includes(item.sender?._id === state.user?._id ? item.receiver._id : item.sender._id) && <Text style={styles.badge} ></Text>}
              <View style={styles.chatInfo}>
                <Text style={styles.profileName}>{item.sender?._id === state.user?._id ? item.receiver.name : item.sender.name}</Text>
                <Text style={styles.lastMessage}>{item.content || "image..."}</Text>
              </View>
              <Text style={styles.timestamp}>{formatTimestamp(item.createdAt)}</Text>
            </TouchableOpacity>
          )}
        />
      )}
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
   badge: {

    backgroundColor: "yellow",
    borderRadius: 10,
    width: 10,
    height: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginRight:15
  },
});

export default DiscussionsScreen;
