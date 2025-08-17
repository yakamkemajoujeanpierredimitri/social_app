import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';



export default function MessageLayout() {
  return (
    <Stack 
    
    screenOptions={{
     headerStyle:{
      backgroundColor:"#000"
     }
    }}
    >
      <Stack.Screen 
        name="[id]" 
        options={{ 
          headerShown: false,
        }} 
      />
      
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#ffd700',
  },
  iconButton: {
    padding: 5,
  },
});