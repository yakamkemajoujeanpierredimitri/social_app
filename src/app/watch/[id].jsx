
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Fullmain from '../../component/Fullmain';
import { useFile } from '../../context/fileProvider';
import FileService from '../../service/fileService';
import { AntDesign } from '@expo/vector-icons';

const WatchPage = () => {
    const { id } = useLocalSearchParams();
    const { state, dispatch } = useFile();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (id) {
            FileService.getFile(dispatch, id).finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        )
    }

    if (state.error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{state.error}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
            {state.file && <Fullmain file={state.file} isActive={true} />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#fff',
        fontSize: 16,
    },
    cancelButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    }
});

export default WatchPage;
