import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { API_CONFIG } from '../config/api';
import { BackendAuthResponse, GoogleUserInfo, User } from '../types/auth';
import { tempStorage } from './tempStorage';

class AuthService {
  /**
   * Configure Google Sign-In
   */
  configureGoogleSignIn() {
    console.log('=== CONFIGURING GOOGLE SIGN-IN ===');
    
    try {
      GoogleSignin.configure({
        webClientId: '691822913111-5blrq6gl7v71snfnhl7okh2atsnu9faq.apps.googleusercontent.com',
        iosClientId: '691822913111-5blrq6gl7v71snfnhl7okh2atsnu9faq.apps.googleusercontent.com',
        offlineAccess: true,
        hostedDomain: '',
        forceCodeForRefreshToken: true,
      });
      console.log('✅ Google Sign-In configured successfully');
    } catch (error) {
      console.log('❌ Error configuring Google Sign-In:', error);
    }
  }

  /**
   * Check if user has stored authentication data
   */
  async getStoredAuthData(): Promise<{ token: string; user: User } | null> {
    try {
      const storedToken = await tempStorage.getItemAsync(API_CONFIG.STORAGE_KEYS.JWT_TOKEN);
      const storedUserData = await tempStorage.getItemAsync(API_CONFIG.STORAGE_KEYS.USER_DATA);
      
      if (storedToken && storedUserData) {
        return {
          token: storedToken,
          user: JSON.parse(storedUserData)
        };
      }
      return null;
    } catch (error) {
      console.log('❌ Error getting stored auth data:', error);
      return null;
    }
  }

  /**
   * Verify JWT token with backend
   */
  async verifyToken(token: string): Promise<boolean> {
    try {
      console.log('🔒 Verifying JWT token with backend...');
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TOKEN_VERIFY}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const isValid = response.ok;
      console.log(`Token verification result: ${isValid ? 'VALID' : 'INVALID'}`);
      return isValid;
    } catch (error) {
      console.log('❌ Error verifying token:', error);
      return false;
    }
  }

  /**
   * Clear stored authentication data
   */
  async clearStoredAuth(): Promise<void> {
    try {
      await tempStorage.deleteItemAsync(API_CONFIG.STORAGE_KEYS.JWT_TOKEN);
      await tempStorage.deleteItemAsync(API_CONFIG.STORAGE_KEYS.USER_DATA);
      console.log('🧹 Cleared stored authentication data');
    } catch (error) {
      console.log('❌ Error clearing stored auth:', error);
    }
  }

  /**
   * Get current Google user (if any)
   */
  async getCurrentGoogleUser() {
    try {
      console.log('🔍 Checking Google Sign-In status...');
      const currentUser = await GoogleSignin.getCurrentUser();
      console.log('Current Google user:', currentUser);
      return currentUser;
    } catch (error) {
      console.log('ℹ️ No current Google user found:', error);
      return null;
    }
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<{ user: GoogleUserInfo; idToken: string } | null> {
    try {
      console.log('🚀 Starting Google Sign-In process...');
      
      // Check Play Services
      await GoogleSignin.hasPlayServices();
      console.log('✅ Play Services available');
      
      // Sign in with Google
      const result = await GoogleSignin.signIn();
      console.log('📱 Google Sign-In result received');
      
      // Check if user cancelled
      if (result.type === 'cancelled') {
        console.log('🚫 User cancelled Google sign-in');
        return null;
      }

      // Check if sign-in was successful
      if (result.type !== 'success' || !result.data) {
        console.log('❌ Google sign-in failed or no data received');
        throw new Error('Google sign-in failed');
      }
      
      console.log('=== GOOGLE SIGN-IN SUCCESS ===');
      const { user, idToken } = result.data;
      
      console.log('Google User Info:', {
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
      });
      
      if (!idToken) {
        console.log('❌ No ID token received from Google');
        throw new Error('Failed to get authentication token from Google');
      }
      
      console.log('🔑 Google ID Token received (length:', idToken.length, ')');
      
      return { user, idToken };
    } catch (error) {
      console.log('❌ Google sign-in error:', error);
      throw error;
    }
  }

  /**
   * Authenticate with backend using Google ID token
   */
  async authenticateWithBackend(idToken: string): Promise<BackendAuthResponse> {
    try {
      console.log('🌐 Authenticating with backend...');
      console.log('API Endpoint:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GOOGLE_AUTH}`);
      
      const requestBody = {
        auth: {
          id_token: idToken
        }
      };
      
      console.log('📤 Sending authentication request to backend');
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GOOGLE_AUTH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('📥 Backend response status:', response.status);
      console.log('📥 Backend response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseData = await response.json();
      console.log('📥 Backend response data:', JSON.stringify(responseData, null, 2));
      
      if (!response.ok) {
        throw {
          status: response.status,
          data: responseData
        };
      }
      
      console.log('✅ Backend authentication successful!');
      return responseData as BackendAuthResponse;
    } catch (error) {
      console.log('❌ Backend authentication error:', error);
      throw error;
    }
  }

  /**
   * Store authentication data (temporarily in memory)
   */
  async storeAuthData(authResponse: BackendAuthResponse): Promise<void> {
    try {
      console.log('💾 Storing authentication data (temporary storage)...');
      
      await tempStorage.setItemAsync(API_CONFIG.STORAGE_KEYS.JWT_TOKEN, authResponse.token);
      await tempStorage.setItemAsync(API_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(authResponse.user));
      
      console.log('✅ Authentication data stored successfully in temporary storage');
      console.log('⚠️ Note: Data will be lost when app is closed (temporary storage)');
    } catch (error) {
      console.log('❌ Error storing authentication data:', error);
      throw error;
    }
  }

  /**
   * Get additional Google tokens
   */
  async getGoogleTokens() {
    try {
      const googleTokens = await GoogleSignin.getTokens();
      console.log('🔑 Additional Google tokens retrieved');
      return googleTokens;
    } catch (error) {
      console.log('⚠️ Error getting additional Google tokens:', error);
      return null;
    }
  }

  /**
   * Sign out from Google and clear stored data
   */
  async signOut(): Promise<void> {
    try {
      console.log('🚪 Starting sign-out process...');
      
      // Sign out from Google
      await GoogleSignin.signOut();
      console.log('✅ Signed out from Google');
      
      // Clear stored authentication data
      await this.clearStoredAuth();
      console.log('✅ Cleared stored authentication data');
      
      console.log('🎉 Sign-out completed successfully');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      throw error;
    }
  }

  /**
   * Get stored JWT token
   */
  async getStoredToken(): Promise<string | null> {
    try {
      return await tempStorage.getItemAsync(API_CONFIG.STORAGE_KEYS.JWT_TOKEN);
    } catch (error) {
      console.log('❌ Error getting stored token:', error);
      return null;
    }
  }

  /**
   * Debug method to see all stored data
   */
  debugStorage() {
    tempStorage.getAllItems();
  }
}

export const authService = new AuthService(); 