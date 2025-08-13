import { useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../context/authProvider';
import BottomFeature from './Bottom';
import VideoPlayer from './VideoItem';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const Fullmain = ({ file , isActive , index}) => {

    const [isFollowing, setIsFollowing] = useState(false);
    const {state:authState}  = useAuth();
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
                            pic={file.thumbnail}
                        /> :
                        <Image
                            source={{ uri: file.thumbnail }}
                            style={styles.image}
                        />
                }

                {/* Video Info Overlay */}
                <BottomFeature
                        file={file}
                        isActive={isActive}
                        index={index}
                    />
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

                        <Text style={styles.description}>{file.title}</Text>

                       
                            <View style={styles.hashtagContainer}>
                                
                                    <Text  style={styles.hashtag}>
                                        #{file.prompt}
                                    </Text>
                             
                            </View>
                     
                    </View>

                   
                </View> 
                
            </View>
        );
    };

    const styles = StyleSheet.create({
        container: {
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
           flexDirection:"column",
           justifyContent:"center",
           padding:10,
           flexDirection:"column"

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
            alignSelf:'flex-end',
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
      image:{
        objectFit:"contain",
        width:"100%",
        height:420,
        marginBottom:10,
        borderRadius:10
      }
    });

    export default Fullmain
