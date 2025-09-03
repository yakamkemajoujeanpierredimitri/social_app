import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/authProvider';
import { TokenService } from '../service/Security';

const HomeScreen = () => {
  const animationRef = useRef(null);
  const router  = useRouter();
  const {dispatch} = useAuth();
  const [isLoading , setisLoading] = useState(false);
  const [isvalid ,setisValid] = useState(false);
  useEffect(() => {
    animationRef.current?.play();
      HandleEntering();
  }, []);

    const HandleEntering  = async ()=>{
      setisLoading(true);
      try {
        const res = await TokenService.getToken('isvalid');
        if(res === null){
          return;
        }
        const time  = await TokenService.getToken('time');
        if(time === null){
          return;
        }
        console.log('time:', time);
        const diff  = moment(time).fromNow();
        console.log('diff:', diff);
        if(diff.includes('months') || diff.includes('years') ){
          return;
        }
        dispatch({
          type:'Valid'
        });
        setisValid(true);
        //router.push('/(tabs)/Home');
      } catch (error) {
        console.log(error);
      }finally{
        setisLoading(false);
      }
    }
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
        <Text style={styles.title}>Welcome to Yakani App</Text>
        {!isLoading && !isvalid && <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/auth')}
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