import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../context/authProvider';


const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { state, Register ,dispatch} = useAuth();
  const animationRef = useRef(null);
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    const res = await Register({ name, email, password });

    if ( res?.msg) {
      Alert.alert('Registration Failed',  res?.msg);
    } 
    if(res?.success === true){
      router.navigate('/(tabs)/Home');
    }
    
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.animationContainer}>
        <LottieView
          ref={animationRef}
          source={require('../../assets/animation/login.json')}
          style={styles.animation}
          autoPlay
          loop
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#666"
        />

        <TouchableOpacity
          style={[styles.registerButton, state.isLoading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={state.isLoading}
        >
          <Text style={styles.registerButtonText}>
            {state.isLoading ? 'Creating Account...' : 'Register'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => {
            dispatch({ type: 'CLEAR_ERROR' });
            router.navigate('/auth');
          }}
        >
          <Text style={styles.loginText}>
            Already have an account? Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  animationContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
  formContainer: {
    flex: 0.6,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    color: '#fff',
    marginBottom: 20,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#fe2c55',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginLink: {
    alignSelf: 'center',
  },
  loginText: {
    color: '#fe2c55',
    fontSize: 16,
  },
});

export default RegisterScreen;
