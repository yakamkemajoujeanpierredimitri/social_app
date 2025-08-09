import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/authProvider';

const HomeScreen = () => {
  const animationRef = useRef(null);
  const router  = useRouter();
  const {state} = useAuth();
  useEffect(() => {
    animationRef.current?.play();
    if(state.isAuthenticated){
      router.navigate('/(tabs)/Home');
    }
  }, []);
useEffect(()=>{
if(!state.isLoading && state.isAuthenticated){
   router.navigate('/(tabs)/Home');
}
},[state.isLoading])
  return (
    <View style={styles.container}>
      {/* Lottie Animation Background */}
      <LottieView
        ref={animationRef}
        source={require('../assets/animation/message.json')} // Replace with your Lottie JSON file
        autoPlay
        loop
        resizeMode="cover"
        style={styles.animation}
      />
      
      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to My App</Text>
        {!state.isLoading && !state.user && <TouchableOpacity 
          style={styles.button}
          onPress={() => router.navigate('/auth')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>}
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  animation: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  button: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;