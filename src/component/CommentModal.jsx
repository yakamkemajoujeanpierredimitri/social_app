import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CommService from '../service/comService';

const CommentModal = ({ isVisible, onClose, file }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (isVisible) {
      fetchComments();
    }
  }, [isVisible]);

  const fetchComments = async () => {
    const res = await CommService.getComm(file._id);
    if (res.data) {
      setComments(res.data);
    }
  };

  const handlePostComment = async () => {
    if (newComment.trim() === '') return;
    const res = await CommService.sendComm(file._id, { content: newComment });
    if (res.data) {
      setComments([res.data, ...comments]);
      setNewComment('');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.commentContainer}>
      <Text style={styles.commentUser}>{item.sender.name}</Text>
      <Text style={styles.commentText}>{item.content}</Text>
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
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close-circle" size={24} color="#fff" />
          </TouchableOpacity>
          <FlatList
            data={comments}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
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
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  commentContainer: {
    marginBottom: 15,
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
});

export default CommentModal;
