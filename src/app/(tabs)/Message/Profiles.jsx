import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { avatar } from '../../../assets/images';
import { useAuth } from '../../../context/authProvider';
import UserService from '../../../service/userService';

const ProfilesScreen = () => {
  const { state, dispatch } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [showOnline, setShowOnline] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await UserService.getAllusers();
      if (res.data) {
        setUsers(res.data);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {

    setOnlineUsers(state.onlineusers);

  }, [state.onlineusers]);

  const handleProfilePress = (user) => {
    dispatch({ type: 'SET_Guest', payload: { ricever: user } });
    router.push(`/Message/${user._id}`);
  };

  const filteredUsers = users
    .filter(user => user.name.toLowerCase().includes(search.toLowerCase()))
    .filter(user => !showOnline || onlineUsers.includes(user._id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Online</Text>
          <Switch
            value={showOnline}
            onValueChange={setShowOnline}
            trackColor={{ false: '#767577', true: '#f5dd4b' }}
            thumbColor={showOnline ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
      </View>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.profileItem} onPress={() => handleProfilePress(item)}>
            <Image source={item?.avatar && item.avatar !== "/avatar.png"?{ uri: item.avatar }:avatar} style={[styles.profileImage , { marginRight: onlineUsers.includes(item._id) ? 1 : 15 }]} />
            {onlineUsers.includes(item._id) && <Text style={styles.badge} ></Text>}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{item.name}</Text>
              <Text style={styles.profileStatus}>{onlineUsers.includes(item._id) ? 'Online' : 'Offline'}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => {
          return (
            <Text style={styles.notfound} >No users</Text>
          )
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignContent: "center",
    justifyContent: "center",
    padding: 20
  },
  header: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    color: '#fff',
    marginRight: 5,
  },
  profileItem: {
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
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileStatus: {
    color: '#999',
    fontSize: 14,
  },
  notfound: {
    color: '#fff',
    fontSize: 30,
    textAlign: 'center'

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

export default ProfilesScreen;
