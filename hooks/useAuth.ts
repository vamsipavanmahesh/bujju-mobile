import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { authService } from '../services/authService';
import { AuthState } from '../types/auth';
import { handleBackendAuthError, handleGoogleSignInError, isNetworkError } from '../utils/authErrors';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isSignedIn: false,
    isLoading: false,
    tokens: null,
  });

  const [showTokens, setShowTokens] = useState(false);

  useEffect(() => {
    console.log('=== INITIALIZING AUTHENTICATION ===');
    initializeAuth();
  }, []);

  /**
   * Initialize authentication - check for existing auth data
   */
  const initializeAuth = async () => {
    try {
      // Configure Google Sign-In
      authService.configureGoogleSignIn();
      
      // Check for stored authentication data
      await checkExistingAuthentication();
    } catch (error) {
      console.log('❌ Error initializing auth:', error);
    }
  };

  /**
   * Check for existing authentication data
   */
  const checkExistingAuthentication = async () => {
    try {
      console.log('🔍 Checking for existing authentication...');
      
      const storedAuthData = await authService.getStoredAuthData();
      
      if (storedAuthData) {
        console.log('💾 Found stored authentication data');
        
        // Set user as authenticated (token validity will be checked on API calls)
        console.log('✅ Using stored authentication data');
        setAuthState(prev => ({
          ...prev,
          user: storedAuthData.user,
          isSignedIn: true,
        }));
        
        // Get Google tokens if available
        const googleTokens = await authService.getGoogleTokens();
        if (googleTokens) {
          setAuthState(prev => ({ ...prev, tokens: googleTokens }));
        }
      } else {
        console.log('🔍 No stored authentication found, checking Google Sign-In status');
        await authService.getCurrentGoogleUser();
      }
    } catch (error) {
      console.log('❌ Error checking existing authentication:', error);
      await authService.clearStoredAuth();
    }
  };

  /**
   * Sign in with Google and authenticate with backend
   */
  const signIn = async () => {
    if (authState.isLoading) {
      console.log('⏳ Sign-in already in progress, ignoring request');
      return;
    }

    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Step 1: Sign in with Google
      const googleResult = await authService.signInWithGoogle();
      
      if (!googleResult) {
        // User cancelled
        Alert.alert('Cancelled', 'Sign in was cancelled');
        return;
      }

      const { user: googleUser, idToken } = googleResult;
      
      // Step 2: Authenticate with backend
      const backendAuthResponse = await authService.authenticateWithBackend(idToken);
      
      // Step 3: Store authentication data
      await authService.storeAuthData(backendAuthResponse);
      
      // Step 4: Update state
      setAuthState(prev => ({
        ...prev,
        user: backendAuthResponse.user,
        isSignedIn: true,
      }));
      
      // Step 5: Get additional Google tokens
      const googleTokens = await authService.getGoogleTokens();
      if (googleTokens) {
        setAuthState(prev => ({ ...prev, tokens: googleTokens }));
      }
      
      console.log('🎉 Authentication flow completed successfully!');
      Alert.alert(
        'Welcome!', 
        `Successfully signed in as ${backendAuthResponse.user.name}!\n\nJWT token stored securely.`
      );
      
    } catch (error: any) {
      console.log('❌ Sign in error:', error);
      
      if (isNetworkError(error)) {
        Alert.alert(
          'Network Error', 
          'Failed to connect to authentication server. Please check your internet connection and try again.'
        );
      } else if (error.status && error.data) {
        // Backend error
        const errorMessage = handleBackendAuthError(error.status, error.data);
        Alert.alert('Authentication Error', errorMessage);
      } else {
        // Google Sign-In error
        const errorMessage = handleGoogleSignInError(error);
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  /**
   * Sign out user
   */
  const signOut = async () => {
    try {
      await authService.signOut();
      
      // Reset state
      setAuthState({
        user: null,
        isSignedIn: false,
        isLoading: false,
        tokens: null,
      });
      setShowTokens(false);
      
      Alert.alert('Success', 'Signed out successfully');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out completely');
    }
  };

  /**
   * Get stored JWT token
   */
  const getStoredToken = async (): Promise<string | null> => {
    return await authService.getStoredToken();
  };

  /**
   * Toggle token visibility
   */
  const toggleTokenVisibility = () => {
    setShowTokens(prev => !prev);
  };

  /**
   * Show JWT token in alert
   */
  const showJWTToken = async () => {
    const jwtToken = await getStoredToken();
    if (jwtToken) {
      console.log('🔑 Current JWT Token:', jwtToken);
      Alert.alert('JWT Token', `${jwtToken.substring(0, 100)}...\n\n(Full token logged to console)`);
    }
  };

  return {
    // State
    ...authState,
    showTokens,
    
    // Actions
    signIn,
    signOut,
    toggleTokenVisibility,
    showJWTToken,
    getStoredToken,
  };
}; 