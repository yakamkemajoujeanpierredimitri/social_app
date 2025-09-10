import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

class GoogleAuth {
  constructor() {
    this.isConfigured = false;
    this.configure();
  }

  configure() {
    if (!this.isConfigured) {
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID, // Client ID Web de Google Console
        offlineAccess: true,
        hostedDomain: '',
        forceCodeForRefreshToken: true,
        accountName: '',
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID, // Optionnel: Client ID iOS
        googleServicePlistPath: '',
        openIdConnect: true,
        profileImageSize: 120,
      });
      this.isConfigured = true;
    }
  }

  async authenticate(provider) {
    if (provider !== 'google') {
      throw new Error('Provider not supported');
    }

    try {
      // Vérifier si Google Play Services sont disponibles
      await GoogleSignin.hasPlayServices();
      
      // Se connecter
      const userInfo = await GoogleSignin.signIn();
      
      console.log('Google Sign-In Success:', userInfo);

      return {
        user: {
          id: userInfo.user.id,
          name: userInfo.user.name,
          email: userInfo.user.email,
          picture: userInfo.user.photo,
        },
        tokens: {
          idToken: userInfo.idToken,
          accessToken: userInfo.accessToken,
        },
      };
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Sign in was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Sign in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Google Play Services not available');
      } else {
        throw new Error('Google Sign-In failed: ' + error.message);
      }
    }
  }

  async signOut() {
    try {
      await GoogleSignin.signOut();
      console.log('Google Sign-Out Success');
    } catch (error) {
      console.error('Google Sign-Out Error:', error);
    }
  }

  async isSignedIn() {
    return await GoogleSignin.isSignedIn();
  }

  async getCurrentUser() {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      return userInfo;
    } catch (error) {
      console.log('No current user:', error);
      return null;
    }
  }
}

export const auth = new GoogleAuth();
