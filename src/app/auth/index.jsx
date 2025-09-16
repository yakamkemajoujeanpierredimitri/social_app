import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
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
import { auth } from '../../../lib/auth'; // Import modifié
import { useAuth } from '../../context/authProvider';

const LoginScreen = () => {
  const { state, Login, dispatch, LoginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const animationRef = useRef(null);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Allow navigation to signup page
      if (e.data.action.type === 'NAVIGATE' && e.data.action.payload.name === 'signup') {
        return;
      }

      if (!state.isAuthenticated) {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
      }
    });

    return unsubscribe;
  }, [navigation, state.isAuthenticated]);
  
 const HandleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await auth.authenticate('google');
      if (result?.user) {
        const { name, email, id } = result.user;
        const res = await LoginWithGoogle({ name, email, id });
        if (res?.msg) {
          Alert.alert('Login Failed', res?.msg);
          return;
        } 
        if (res?.success === true) {
          router.push('/(tabs)/Home');
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      Alert.alert('Error', error.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const res = await Login({ email, password });
    if (res?.msg) {
      Alert.alert('Login Failed', res?.msg);
      return;
    } 
    if (res?.success === true) {
      router.push('/(tabs)/Home');
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
        <Text style={styles.title}>Welcome Back</Text>
        
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
          style={[styles.loginButton, state.isLoading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={state.isLoading || loading}
        >
          <Text style={styles.loginButtonText}>
            {state.isLoading || loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

   <TouchableOpacity
          style={[styles.loginButton, styles.googleButton]}
          onPress={HandleGoogleLogin}
          disabled={state.isLoading || loading}
        >
          <FontAwesome name="google" size={20} color="#fff" style={styles.googleIcon} />
          <Text style={styles.loginButtonText}>
            {loading ? 'Connecting...' : 'Sign in with Google'}
          </Text>
        </TouchableOpacity>

       

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => {
            dispatch({ type: 'CLEAR_ERROR' });
            router.push('/auth/signup');
          }}
        >
          <Text style={styles.registerText}>
            Don&apos;t have an account? Sign up
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
  loginButton: {
    backgroundColor: '#fe2c55',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  googleIcon: {
    marginRight: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerLink: {
    alignSelf: 'center',
  },
  registerText: {
    color: '#fe2c55',
    fontSize: 16,
  },
});

export default LoginScreen;