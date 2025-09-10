import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

class GoogleAuth {
  constructor() {
    this.discovery = {
      authorizationEndpoint: 'https://accounts.google.com/oauth/authorize',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
    };
  }

  async authenticate(provider) {
    if (provider !== 'google') {
      throw new Error('Provider not supported');
    }

    try {
      // Configuration de la requête d'authentification
      const request = new AuthSession.AuthRequest({
        clientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID , // REMPLACE PAR TON CLIENT ID
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.Code,
        redirectUri: AuthSession.makeRedirectUri({
          scheme: 'socialapp', // REMPLACE PAR TON SCHEME
          useProxy: true, // true pour développement
        }),
        additionalParameters: {},
        extraParams: {
          access_type: 'offline',
        },
      });

      // Lancer l'authentification
      const result = await request.promptAsync(this.discovery);

      if (result.type === 'success') {
        // Échanger le code contre un token
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
            code: result.params.code,
            extraParams: {
              code_verifier: request.codeVerifier,
            },
            redirectUri: AuthSession.makeRedirectUri({
              scheme: 'socialapp',
              useProxy: true,
            }),
          },
          this.discovery
        );

        // Récupérer les informations utilisateur
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.accessToken}`
        );
        const userInfo = await userInfoResponse.json();

        return {
          user: {
            id: userInfo.id,
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
          },
          tokens: tokenResponse,
        };
      } else {
        throw new Error('Authentication cancelled or failed');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      throw error;
    }
  }
}

export const auth = new GoogleAuth();
