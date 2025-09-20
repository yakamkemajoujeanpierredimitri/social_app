import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Image, LayoutAnimation, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
import { avatar } from '../../assets/images';
import MessageSkeleton from '../../component/MessageSkeleton';
import UserList from '../../component/UserList';
import { useAuth } from '../../context/authProvider';
import UserService from '../../service/userService';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Profile = () => {
  const { state, dispatch ,Logout } = useAuth();
  const { user} = state;
  const router = useRouter();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [userList, setUserList] = useState([]);
  const [userListTitle, setUserListTitle] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [newAvatar, setNewAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'saves'
  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    const fetchFollowData = async () => {
      const followersRes = await UserService.getFollowers();
      if (followersRes.data) {
        setFollowers(followersRes.data);
      }
      const followingRes = await UserService.getFollowing();
      if (followingRes.data) {
        setFollowing(followingRes.data);
      }
    };

    const fetchPostsData = async () => {
      setPostsLoading(true);
      const userPostsRes = await UserService.userPosts();
      if (userPostsRes.data) {
        const postsWithMediaId = userPostsRes.data.filter(post => post.mediaId);
        const postsWithoutMediaId = userPostsRes.data.filter(post => !post.mediaId);
        setUserPosts([...postsWithMediaId, ...postsWithoutMediaId]);
      }
      const savedPostsRes = await UserService.savePosts(); 
       
      if (savedPostsRes.data) {
      
        setSavedPosts(savedPostsRes.data);
      }
      setPostsLoading(false);
    };

    fetchFollowData();
    fetchPostsData();
    
  }, [user]);
  useEffect(()=>{
    state.socket?.on('uncensore',(id)=>{
      const newposts = userPosts.map((item)=>{
        if(item._id  === id){
          item.mediaId = null;
          return item;
        }
        return item;
      });
      setUserPosts(newposts);
    });
    return()=>state.socket?.off('uncensore');
  },[state.socket]); // Re-fetch if user data changes

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setNewAvatar(result.assets[0]);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    let updatedUser = { ...user };

    if (newAvatar) {
      const formData = new FormData();
      formData.append('avatar', {
        uri: newAvatar.uri,
        type: newAvatar.type || 'image/jpeg',
        name: newAvatar.fileName || 'avatar.jpg',
      });
      const avatarRes = await UserService.userAvatar(formData);
      if (avatarRes.data) {
        updatedUser = avatarRes.data;
      }
    }

    if (newName && newName !== user.name) {
      const userRes = await UserService.userUpdate({ name: newName });
      if (userRes.data) {
        updatedUser = userRes.data;
      }
    }

    dispatch({
      type: 'SET_USER',
      payload: { user: updatedUser },
    });

    setLoading(false);
    setModalVisible(false);
  };

  const handleTabChange = (tab) => {
    LayoutAnimation.easeInEaseOut();
    setActiveTab(tab);
  };

  const showFollowers = () => {
    setUserList(followers);
    setUserListTitle('Followers');
    setModalVisible(true);
  };

  const showFollowing = () => {
    setUserList(following);
    setUserListTitle('Following');
    setModalVisible(true);
  };
  const LoggingOut = async ()=>{
    const res = await Logout();
    if(res?.msg){
      console.log(res.msg);
      return;
    }
    if(res?.success === true){
       router.navigate('/auth');
    }
   
  }

  const renderPostItem = ({ item }) => (
    <View style={styles.postItem}>
      {item.mediaId ? (
        <View style={styles.postItem}>
          <Image source={{ uri: item.thumbnail }} style={styles.imagethum} />
          <BlurView intensity={100} style={styles.blurContainer}>
            <Text style={styles.control}>Controlling...</Text>
          </BlurView>
        </View>
      ) : (
        <TouchableOpacity onPress={() => router.navigate(`/watch/${item._id}`)}>
          <Image source={{ uri: item.thumbnail }} style={styles.imagethum} />
        </TouchableOpacity>
      )}
    </View>
  );
  if(user === null){
    return(
      <View  style={styles.container} >
         <MessageSkeleton/>
      </View>
     
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={user?.avatar && user?.avatar !== "/avatar.png"?{ uri: user?.avatar }:avatar} style={styles.avatar} />
        <Text style={styles.name}>{user?.name}</Text>
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.stat} onPress={showFollowers}>
            <Text style={styles.statNumber}>{followers.length}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stat} onPress={showFollowing}>
            <Text style={styles.statNumber}>{following.length}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection:'row',gap:10}}>
           <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.editButton} onPress={() => LoggingOut()}>
          <Text style={styles.editButtonText}>logout</Text>
        </TouchableOpacity> 
        </View>
      
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'posts' && styles.activeTabButton]}
          onPress={() => handleTabChange('posts')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'posts' && styles.activeTabButtonText]}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'saves' && styles.activeTabButton]}
          onPress={() => handleTabChange('saves')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'saves' && styles.activeTabButtonText]}>Saves</Text>
        </TouchableOpacity>
      </View>

      {postsLoading ? (
        <ActivityIndicator size="large" color="#FFD700" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={activeTab === 'posts' ? userPosts : savedPosts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item._id} // Assuming each post has a unique _id
          contentContainerStyle={styles.postsList}
          numColumns={2} // Displaying posts in a grid of 2 columns
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View  style={styles.userList} >
            <UserList users={userList} onClose={() => setModalVisible(false)} title={userListTitle} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={pickImage}>
              <Image source={{ uri: newAvatar?.uri || user?.avatar || 'https://via.placeholder.com/150' }} style={styles.modalAvatar} />
              <Text style={styles.changeAvatarText}>Change Profile Picture</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="New Name"
              placeholderTextColor="#666"
              value={newName}
              onChangeText={setNewName}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setEditModalVisible(false)} color="#000" />
              <Button title="Save" onPress={handleUpdateProfile} disabled={loading} color="#FFD700" />
            </View>
            {loading && <ActivityIndicator size="large" color="#FFD700" style={styles.loadingIndicator} />}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  stat: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
    paddingVertical: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  activeTabButton: {
    backgroundColor: '#FFD700',
  },
  tabButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabButtonText: {
    color: '#000',
  },
  postsList: {
    padding: 5,
  },
  postItem: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    height:200
  },
  loadingIndicator: {
    marginTop: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  changeAvatarText: {
    color: '#FFD700',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#FFD700',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  imagethum:{
    width:"100%",
    height:"100%",
    objectFit:'cover'
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  control:{
    textAlign:"center",
    zIndex:1,
    color:'#fff',
    fontSize:20,
    fontWeight: 'bold',
  },
  LoadingText:{
    textAlign:'center',
    margin:20,
    fontSize:20,
    color:"#fff"
  },
  userList:{
    width:"95%",
    height:'70%',
    

  }
});

export default Profile;