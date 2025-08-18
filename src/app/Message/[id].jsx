import { useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MessageSkeleton from '../../component/MessageSkeleton';
import { useAuth } from '../../context/authProvider';
import ChatService from '../../service/chatService';

const ChatScreen = () => {
  const { id: userId } = useLocalSearchParams();
  const { state, dispatch } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState(state.ricever);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setRecipient(state.ricever);
  }, [state.ricever]);

  useEffect(() => {
    if (state.socket) {
      state.socket.on('onlineusers', (onlineUsers) => {
        setIsOnline(onlineUsers.includes(userId));
      });
    }
    return () => {
      state.socket.off('onlineusers');
    }
  }, [state.socket, userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await ChatService.getChat(userId);
      if (res.data) {
        setMessages(res.data);
      }
      setIsLoading(false);
    };
    fetchMessages();

    if (state.socket) {
      state.socket.on('message', (message) => {
        if (message.sender?._id == userId) {
          setMessages((prevMessages) => [message, ...prevMessages]);
        }

      });
    }

    return () => {
      if (state.socket) {
        state.socket.off('message');
      }
    };
  }, [userId, state.socket]);

  const handleSend = async () => {
    if (newMessage.trim() === '') return;

    const messageData = new FormData();
    messageData.append('content', newMessage);
    const res = await ChatService.sendChat(userId, messageData);
    if (res.msg) {
      Alert.alert('Chat error', res.msg);
      return;
    }
    setNewMessage('');
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

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.sender?._id === state.user._id ? styles.myMessage : styles.theirMessage]}>
      <Text style={item.sender?._id === state.user._id ? styles.messageText : { color: '#fff', fontSize: 16 }}>{item.content}</Text>
      <Text style={styles.timestamp}>{formatTimestamp(item.createdAt)}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
      <View style={styles.header}>
        {recipient && (
          <>
            <Image source={{ uri: recipient?.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.headerName}>{recipient?.name}</Text>
              <Text style={styles.headerStatus}>{isOnline ? 'Online' : 'Offline'}</Text>
            </View>
          </>
        )}
      </View>
      {isLoading ? (
        <MessageSkeleton />
      ) : (
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          inverted
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1a1a1a',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerStatus: {
    color: '#999',
    fontSize: 14,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#f5dd4b',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#333',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#000',
    fontSize: 16,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#f5dd4b',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatScreen;