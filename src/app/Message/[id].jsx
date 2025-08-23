import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MessageSkeleton from '../../component/MessageSkeleton';
import { useAuth } from '../../context/authProvider';
import ChatService from '../../service/chatService';

const ChatScreen = () => {
  const { id: userId } = useLocalSearchParams();
  const { state, dispatch } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [recipient, setRecipient] = useState(state.ricever);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageForModal, setImageForModal] = useState(null);
  const router = useRouter();
  const flatListRef = useRef(null);

  const onScrollToIndexFailed = info => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true });
    });
  };

  useEffect(() => {
    setRecipient(state.ricever);
    const fetchMessages = async () => {
      const res = await ChatService.getChat(userId);
      if (res.data) {
        setMessages(res.data);
      }
      setIsLoading(false);
    };
    fetchMessages();
  }, [state.ricever]);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => flatListRef.current.scrollToIndex({ index: messages.length - 1, animated: true }), 100);
    }
  }, [messages]);

  const Listenmessage = useCallback(() => {
    if (state.socket) {
      state.socket.on('msg', (message) => {
        if (message.sender?._id == userId) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });
    }
  }, [state.socket, userId])

  const StopListen = useCallback(() => {
    state.socket?.off('msg');
  }, [state.socket]);

  useEffect(() => {

    setIsOnline(state.onlineusers.includes(userId));
    Listenmessage();

    return () => {
      StopListen();
    }
  }, [state.onlineusers, Listenmessage, StopListen]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleSend = async () => {
    if (newMessage.trim() === '' && !selectedImage) return;
    setIsSending(true);
    const messageData = new FormData();
    if (newMessage.trim() !== '') {
      messageData.append('content', newMessage);
    }

    if (selectedImage) {
      messageData.append('file', {
        uri: selectedImage.uri,
        name: selectedImage.fileName,
        type: selectedImage.mimeType
      });
    }
    //console.log(messageData.get('file'));

    const res = await ChatService.sendChat(userId, messageData);
    if (res.msg) {
      Alert.alert('Chat error', res.msg);
      setIsSending(false);
      return;
    }
    setMessages((prevMessages) => [...prevMessages, res.data]);
    setNewMessage('');
    setSelectedImage(null);
    setIsSending(false);
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
      {item.content && <Text style={item.sender?._id === state.user._id ? styles.messageText : { color: '#fff', fontSize: 16 }}>{item.content}</Text>}
      {item.file && (
        <TouchableOpacity onPress={() => {
          setImageForModal(item.file);
          setModalVisible(true);
        }}>
          <Image source={{ uri: item.file }} style={styles.messageImage} />
        </TouchableOpacity>
      )}
      <Text style={styles.timestamp}>{formatTimestamp(item.createdAt)}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
      <View style={styles.header}>
        {recipient && (
          <>
            <TouchableOpacity onPress={() => {
              dispatch({ type: "SET_visitor", payload: { visitor: recipient } });
              router.navigate(`/Profiles/${recipient._id}`);
            }} >
              <Image source={{ uri: recipient?.avatar }} style={styles.avatar} /></TouchableOpacity>
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
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          onScrollToIndexFailed={onScrollToIndexFailed}
        />
      )}
      {selectedImage && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
          <TouchableOpacity onPress={() => setSelectedImage(null)} style={styles.removeImageButton}>
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
          <Feather name="paperclip" size={24} color="#fff" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>{isSending ? 'Sending...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Feather name="x" size={30} color="white" />
            </TouchableOpacity>
            <ScrollView maximumZoomScale={3} minimumZoomScale={1} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
              <Image source={{ uri: imageForModal }} style={styles.modalImage} />
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 5,
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
    alignItems: 'center',
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
  attachButton: {
    paddingHorizontal: 10,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1a1a1a',
  },
  previewImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 2,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalView: {
    width: '100%',
    height: '100%',
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: 'center'
  },
  modalImage: {
    width: '100%',
    aspectRatio:  1/ 1,
    resizeMode: 'fill',
    objectFit: 'contain'
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
});

export default ChatScreen;