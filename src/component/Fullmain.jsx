import { useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import BottomFeature from './Bottom';
import VideoPlayer from './VideoItem';


const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const Fullmain = ({ file , isActive , index}) => {

    const [isFollowing, setIsFollowing] = useState(video.user.isFollowing || false);

    const handleFollow = async () => {

    }
         // Can't follow yourself



        return (
            <View style={styles.container}>
                {
                    file.path ?
                        <VideoPlayer
                            videoUri={file.path}
                            isActive={isActive}
                        /> :
                        <Image
                            source={{ uri: file.thumbnail }}
                        />
                }

                {/* Video Info Overlay */}
                <View style={styles.overlay}>
                    {/* Left side - User info and description */}
                    <View style={styles.leftContent}>
                        <View style={styles.userInfo}>
                            <Image
                                source={{ uri: file.sender.avatar }}
                                style={styles.avatar}
                            />
                            <View style={styles.userDetails}>
                                <Text style={styles.username}>@{file.sender.name}</Text>
                                {!isFollowing && file.sender._id !== authState.user._id && (
                                    <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
                                        <Text style={styles.followText}>Follow</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        <Text style={styles.description}>{video.description}</Text>

                        {video.hashtags && video.hashtags.length > 0 && (
                            <View style={styles.hashtagContainer}>
                                {video.hashtags.map((hashtag, index) => (
                                    <Text key={index} style={styles.hashtag}>
                                        #{hashtag}
                                    </Text>
                                ))}
                            </View>
                        )}
                    </View>

                    <BottomFeature
                        file={file}
                        isActive={isActive}
                        index={index}
                    />
                </View>
            </View>
        );
    };

    const styles = StyleSheet.create({
        container: {
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            position: 'relative',
        },
        overlay: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: 'row',
            paddingHorizontal: 15,
            paddingBottom: 50,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
        },
        leftContent: {
            flex: 1,
            paddingRight: 15,
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
            color: '#fe2c55',
            fontSize: 14,
            marginRight: 8,
            marginBottom: 4,
        },
        rightContent: {
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: 60,
        },
        actionButton: {
            alignItems: 'center',
            marginBottom: 20,
        },
        actionText: {
            color: '#fff',
            fontSize: 12,
            marginTop: 4,
        },
        musicDisc: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#333',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
        },
        musicCover: {
            width: 35,
            height: 35,
            borderRadius: 17.5,
        },
    });

    export default Fullmain
