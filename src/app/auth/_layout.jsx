import { Stack } from 'expo-router';
const AuthLayout = ()=>{
return(
    
    <Stack>
        <Stack.Screen name='index' options={{headerShown:false}}/>
        <Stack.Screen name='signup' options={{headerShown:false}}/>
    </Stack>
);
}
export default AuthLayout;