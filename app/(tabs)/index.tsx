import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

interface User {
  name: string;
  email: string;
  photo?: string;
}

export default function HomeScreen() {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const [tokens, setTokens] = useState<any>(null);

  useEffect(() => {
    console.log('=== CONFIGURING GOOGLE SIGN-IN ===');
    
    // Configure Google Sign-In with correct Client IDs
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

    // Check if user is already signed in
    checkSignedIn();
  }, []);

  const checkSignedIn = async () => {
    try {
      console.log('🔍 Checking if user is already signed in...');
      console.log('GoogleSignin object:', GoogleSignin);
      console.log('isSignedIn function:', GoogleSignin.isSignedIn);
      
      const isSignedIn = await GoogleSignin.isSignedIn();
      console.log('Is signed in:', isSignedIn);
      
      if (isSignedIn) {
        const userInfo = await GoogleSignin.signInSilently();
        setUserInfo(userInfo.user);
        setIsSignedIn(true);
        console.log('✅ User already signed in:', userInfo.user);
      }
    } catch (error) {
      console.log('Check signed in error:', error);
    }
  };

  const signIn = async () => {
    try {
      console.log('🚀 Starting Google Sign-In...');
      console.log('GoogleSignin object:', GoogleSignin);
      
      if (typeof GoogleSignin.hasPlayServices !== 'function') {
        console.log('❌ GoogleSignin not properly initialized');
        Alert.alert('Error', 'Google Sign-In not properly configured. Please rebuild the app.');
        return;
      }
      
      await GoogleSignin.hasPlayServices();
      console.log('✅ Play Services available');
      
      const result = await GoogleSignin.signIn();
      console.log('📱 Sign-in result received');
      
      // Check if user cancelled
      if (result.type === 'cancelled') {
        console.log('🚫 User cancelled sign-in');
        Alert.alert('Cancelled', 'Sign in was cancelled');
        return;
      }

      // Check if sign-in was successful
      if (result.type !== 'success' || !result.data) {
        console.log('❌ Sign-in failed or no data received');
        Alert.alert('Error', 'Sign-in failed');
        return;
      }
      
      // Print all OAuth details
      console.log('=== GOOGLE SIGN-IN SUCCESS ===');
      console.log('Full result object:', JSON.stringify(result, null, 2));
      
      // Extract data from result
      const { user, idToken, serverAuthCode, scopes } = result.data;
      
      // User information
      console.log('\n=== USER INFO ===');
      console.log('User ID:', user.id);
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('Photo URL:', user.photo);
      console.log('Family Name:', user.familyName);
      console.log('Given Name:', user.givenName);
      
      // ID Token and Server Auth Code
      console.log('\n=== TOKENS ===');
      console.log('ID Token:', idToken);
      if (serverAuthCode) {
        console.log('Server Auth Code:', serverAuthCode);
      }
      
      // Scopes granted
      if (scopes) {
        console.log('\n=== GRANTED SCOPES ===');
        console.log('Scopes:', scopes);
      }
      
      // Get additional tokens
      try {
        const tokens = await GoogleSignin.getTokens();
        setTokens(tokens);
        console.log('\n=== ADDITIONAL TOKENS ===');
        console.log('Access Token:', tokens.accessToken);
        console.log('Tokens object:', JSON.stringify(tokens, null, 2));
      } catch (tokenError) {
        console.log('Error getting additional tokens:', tokenError);
      }
      
      setUserInfo(user);
      setIsSignedIn(true);
      Alert.alert('Success', `Welcome ${user.name}!\nCheck console for OAuth details.`);
    } catch (error) {
      console.log('Sign in error:', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'Sign in was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('In Progress', 'Sign in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Play Services not available');
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo(null);
      setIsSignedIn(false);
      setTokens(null);
      setShowTokens(false);
      Alert.alert('Success', 'Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bujj Mobile - Google Sign-In</Text>
      
      {isSignedIn ? (
        <View style={styles.userContainer}>
          {userInfo?.photo && (
            <Image source={{ uri: userInfo.photo }} style={styles.avatar} />
          )}
          <Text style={styles.userName}>{userInfo?.name}</Text>
          <Text style={styles.userEmail}>{userInfo?.email}</Text>
          
          <TouchableOpacity 
            style={styles.tokenButton} 
            onPress={() => setShowTokens(!showTokens)}
          >
            <Text style={styles.buttonText}>
              {showTokens ? 'Hide Tokens' : 'Show OAuth Tokens'}
            </Text>
          </TouchableOpacity>
          
          {showTokens && tokens && (
            <View style={styles.tokenContainer}>
              <Text style={styles.tokenTitle}>OAuth Tokens:</Text>
              <Text style={styles.tokenText}>
                Access Token: {tokens.accessToken?.substring(0, 50)}...
              </Text>
              <Text style={styles.tokenText}>
                ID Token: {tokens.idToken?.substring(0, 50)}...
              </Text>
              <Text style={styles.tokenNote}>
                (Full tokens logged to console)
              </Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.signInButton} onPress={signIn}>
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  userContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  signInButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
  },
  signOutButton: {
    backgroundColor: '#db4437',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  tokenButton: {
    backgroundColor: '#34A853',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  tokenContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  tokenTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  tokenText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  tokenNote: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
