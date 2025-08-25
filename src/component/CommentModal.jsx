import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/authProvider';
import CommService from '../service/comService';

const CommentModal = ({ isVisible, onClose, file ,setnum }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const {state} = useAuth();
  useEffect(() => {
    if (isVisible) {
      fetchComments();
    }
  }, [isVisible]);
useEffect(()=>{
  Listenmessage();
  return ()=>StopListen();
},[Listenmessage,StopListen]);
  const Listenmessage = useCallback(()=>{
     if (state.socket) {
      state.socket.on('comments', (message) => {
        if (message.post === file._id) {
          setComments((prevMessages) => [...prevMessages, message]);
        }
      });
    }
  }, [state.socket]);

  const StopListen= useCallback(()=>{
     state.socket?.off('comments');
  }, [state.socket]);
  const fetchComments = async () => {
    const res = await CommService.getComm(file._id);
    if (res.data) {
      setComments(res.data);
      setnum(res.data.length);
      console.log(res.data.length);
    }
  };

  const handlePostComment = async () => {
    if (newComment.trim() === '') return;
    const data = new FormData();
    data.append('content', newComment);
    const res = await CommService.sendComm(file._id, data);
    if (res.data) {
      setComments([res.data, ...comments]);
      setNewComment('');
    }
  };

  const renderItem = ({ item }) => (
    <View style={ state.user._id  === item.sender._id ? styles.commentContainerUser : styles.commentContainer}>
      <Text style={styles.commentUser}>@{item.sender.name}</Text>
      <Text style={styles.commentText}>{item.content}</Text>
    </View>
  );
  const NoItem = () => (
    <View style={styles.noCommentsContainer}>
      <Ionicons name="chatbubble-ellipses" size={50} color="#666" />
      <Text style={styles.noCommentsText}>No comments yet</Text>
    </View>
  );
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView style={styles.modalContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.modalContent}>
          <Text style={styles.title} >Comments</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close-circle" size={24} color="#fff" />
          </TouchableOpacity>
          <FlatList
            data={comments}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={() => <NoItem />}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment..."
              placeholderTextColor="#666"
            />
            <TouchableOpacity style={styles.sendButton} onPress={handlePostComment}>
              <Ionicons name="send" size={24} color="#ffd700" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    
  },
  modalContent: {
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '60%',
    borderTopWidth:1,
    borderTopColor:'#ccc'
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  commentContainer: {
    marginBottom: 15,
    alignSelf:'flex-start'
  },
    commentContainerUser: {
    marginBottom: 15,
    alignSelf:'flex-end'
  },
  commentUser: {
    color: '#ffd700',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#fff',
    marginRight: 10,
  },
  sendButton: {
    padding: 5,
  },
  title:{
    color:'#fff',
    textAlign:'center',
    fontSize:25,
    fontWeight:'bold'
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

export default CommentModal;
