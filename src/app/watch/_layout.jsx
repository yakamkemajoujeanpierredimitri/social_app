
import { Stack } from 'expo-router';

const WatchLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="[id]" options={{ headerShown: false }} />
        </Stack>
    );
};

export default WatchLayout;
