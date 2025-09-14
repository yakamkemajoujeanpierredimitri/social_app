import { useRouter } from 'expo-router';
import { memo, useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../context/authProvider';
import { useFile } from '../context/fileProvider';
import FileService from '../service/fileService';
import UserService from '../service/userService';
import BottomFeature from './Bottom';
import VideoPlayer from './VideoItem';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const Fullmain = memo(({ file, isActive, index, shouldPreload = false , isFocused }) => {
    const router = useRouter();
    const { state: authState, dispatch } = useAuth();
    const { dispatch: filedispatch, state: fileState } = useFile();
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const checkFollowing = async () => {
            try {
                const res = await UserService.getFollowing();
                if (res.msg) {
                    console.log(res.msg);
                    return;
                }
                setIsFollowing(res.data.some(followedUser => followedUser.Author?._id === file.sender._id));
            } catch (error) {
                console.error('Error checking following status:', error);
            }
        };
        
        if (file?.sender?._id) {
            checkFollowing();
        }
    }, [file?.sender?._id]);

    const handleFollow = async () => {
        try {
            if (isFollowing) {
                const res = await UserService.unfollow({ Author: file.sender._id });
                if (res.msg) {
                    Alert.alert("Error", res.msg);
                    return;
                }
                setIsFollowing(false);
            } else {
                const res = await UserService.follow({ Author: file.sender._id });
                if (res.msg) {
                    Alert.alert("Error", fileState.error);
                    return;
                }
                setIsFollowing(true);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to update follow status");
        }
    };

    const handleDelete = async () => {
        try {
            const res = await FileService.deleteFile(filedispatch, file._id);
            if (fileState.error) {
                Alert.alert("Error", fileState.error);
                return;
            }
            router.back();
        } catch (error) {
            Alert.alert("Error", "Failed to delete file");
        }
    };

    const navigateToProfile = () => {
        dispatch({ type: "SET_visitor", payload: { visitor: file.sender } });
        router.navigate(`/Profiles/${file.sender._id}`);
    };

    return (
        <View style={styles.container}>
            {file.path ? (
                <VideoPlayer
                    videoUri={file.path}
                    isActive={isActive}
                    pic={file.thumbnail}
                    preload={shouldPreload}
                    index={index}
                    isFocused={isFocused}
                />
            ) : (
                <Image
                    source={{ uri: file.thumbnail }}
                    style={styles.image}
                    resizeMode="contain"
                    loadingIndicatorSource={require('../assets/images/placeholder.png')} // Add placeholder
                />
            )}

            <BottomFeature
                file={file}
                isActive={isActive}
                index={index}
            />
            
            <View style={styles.overlay}>
                <View style={styles.leftContent}>
                    <View style={styles.userInfo}>
                        <TouchableOpacity onPress={navigateToProfile}>
                            <Image
                                source={{ uri: file.sender.avatar }}
                                style={styles.avatar}
                            />
                        </TouchableOpacity>
                        <View style={styles.userDetails}>
                            <Text style={styles.username}>
                                @{file.sender.name === authState.user?.name ? 'You' : file.sender.name}
                            </Text>
                            {!isFollowing && authState.user?._id !== file.sender._id && (
                                <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
                                    <Text style={styles.followText}>
                                        {isFollowing ? "Unfollow" : "Follow"}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <Text style={styles.description} numberOfLines={3}>
                        {file.title}
                    </Text>

                    <View style={styles.hashtagContainer}>
                        <Text style={styles.hashtag}>
                            #{file.prompt}
                        </Text>
                    </View>
                </View>
                
                {authState.user?._id === file.sender._id && (
                    <TouchableOpacity 
                        style={styles.deleteButton} 
                        onPress={handleDelete}
                        disabled={fileState.isLoading}
                    >
                        <Text style={styles.deleteButtonText}>
                            {fileState.isLoading ? 'Deleting...' : 'Delete'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
});
Fullmain.displayName = 'Fullmain';

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        flexDirection: "column",
        justifyContent: "center",
        padding: 10
    },
    overlay: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingBottom: 50,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
    },
    leftContent: {
        flex: 1,
        paddingRight: 15,
        alignSelf: 'flex-end',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#fff',
    },
    userDetails: {
        marginLeft: 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    username: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    followButton: {
        marginLeft: 10,
        backgroundColor: '#fe2c55',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 15,
    },
    followText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    description: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    hashtagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    hashtag: {
        color: '#e6ecede2',
        fontSize: 14,
        marginRight: 8,
        marginBottom: 4,
    },
    image: {
        width: "100%",
        height: 420,
        marginBottom: 10,
        borderRadius: 10
    },
    deleteButton: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        opacity: 0.8,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default Fullmain;