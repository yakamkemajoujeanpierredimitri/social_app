import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { useAuth } from '../../context/authProvider';
import UserService from '../../service/userService';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Profile = () => {
  const { state, dispatch } = useAuth();
  const { visitor } = state;
  const router = useRouter();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'saves'
  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchFollowData = async () => {
      const followersRes = await UserService.getVisitorFollowers(visitor._id);
      if (followersRes.data) {
        setFollowers(followersRes.data);
      }
      const followingRes = await UserService.getVisitorFollowing(visitor._id);
      if (followingRes.data) {
        setFollowing(followingRes.data);
      }
    };

    const fetchPostsData = async () => {
      setPostsLoading(true);
      const userPostsRes = await UserService.getVisitorpost(visitor._id);
      if (userPostsRes.data) {
        //const postsWithMediaId = userPostsRes.data.filter(post => post.mediaId);
        const postsWithoutMediaId = userPostsRes.data.filter(post => !post.mediaId);
        setUserPosts([...postsWithoutMediaId]);
      }
      const savedPostsRes = await UserService.getVisitorSaves(visitor._id);

      if (savedPostsRes.data) {

        setSavedPosts(savedPostsRes.data);
      }
      setPostsLoading(false);
    };
    const checkFollowing = async () => {
      const res = await UserService.getFollowing();
      if (res.msg) {
        console.log(res.msg);
        return;
      }
      setIsFollowing(res.data.some(followedUser => followedUser.Author?._id === visitor._id));
      //console.log(res.data.some(followedUser => followedUser.Author?._id === file.sender._id));
    };
    
    checkFollowing();
    fetchFollowData();
    fetchPostsData();

  }, []);
  // Re-fetch if user data changes
  const handleTabChange = (tab) => {
    LayoutAnimation.easeInEaseOut();
    setActiveTab(tab);
  };


  const handleFollow = async () => {
    if (isFollowing) {
            const res = await UserService.unfollow({ Author: visitor._id });
      if (res.msg) {
        Alert.alert("Error", res.msg);
        return;
      }
      setIsFollowing(false);
    } else {
            const res = await UserService.follow({ Author: visitor._id });
      if (res.msg) {
        Alert.alert("Error", res.msg);
        return;
      }
      setIsFollowing(true);
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

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: visitor?.avatar || 'https://via.placeholder.com/150' }} style={styles.avatar} />
        <Text style={styles.name}>{visitor?.name}</Text>
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.stat} >
            <Text style={styles.statNumber}>{followers.length}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stat} >
            <Text style={styles.statNumber}>{following.length}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.editProfileButton} onPress={() => {
          dispatch({ type: "SET_Guest", payload: { ricever: visitor } });
          router.navigate(`/Message/${visitor._id}`);
        }}>
          <Text style={styles.editProfileButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editProfileButton} onPress={() => handleFollow()}>
          <Text style={styles.editProfileButtonText}> {isFollowing ? "Unfollow" : "Follow"} </Text>
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
    height: 200
  },
  loadingIndicator: {
    marginTop: 50,
  },

  imagethum: {
    width: "100%",
    height: "100%",
    objectFit: 'cover'
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  control: {
    textAlign: "center",
    zIndex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  editProfileButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 5,
    margin:5
  },
  editProfileButtonText: {
    color: '#0e0d0dff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;