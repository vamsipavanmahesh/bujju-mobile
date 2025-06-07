import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { homeScreenStyles } from '../../styles/homeScreen';

export default function HomeScreen() {
  const {
    user,
    isSignedIn,
    isLoading,
    tokens,
    showTokens,
    signIn,
    signOut,
    toggleTokenVisibility,
    showJWTToken,
  } = useAuth();

  const renderSignedInView = () => (
    <View style={homeScreenStyles.userContainer}>
      {user?.avatar_url && (
        <Image source={{ uri: user.avatar_url }} style={homeScreenStyles.avatar} />
      )}
      <Text style={homeScreenStyles.userName}>{user?.name}</Text>
      <Text style={homeScreenStyles.userEmail}>{user?.email}</Text>
      <Text style={homeScreenStyles.userId}>User ID: {user?.id}</Text>
      
      <TouchableOpacity 
        style={homeScreenStyles.tokenButton} 
        onPress={toggleTokenVisibility}
      >
        <Text style={homeScreenStyles.buttonText}>
          {showTokens ? 'Hide Tokens' : 'Show JWT & OAuth Tokens'}
        </Text>
      </TouchableOpacity>
      
      {showTokens && (
        <View style={homeScreenStyles.tokenContainer}>
          <Text style={homeScreenStyles.tokenTitle}>Authentication Tokens:</Text>
          
          <TouchableOpacity 
            style={homeScreenStyles.tokenViewButton}
            onPress={showJWTToken}
          >
            <Text style={homeScreenStyles.tokenButtonText}>View JWT Token</Text>
          </TouchableOpacity>
          
          {tokens && (
            <>
              <Text style={homeScreenStyles.tokenText}>
                Google Access Token: {tokens.accessToken?.substring(0, 50)}...
              </Text>
              <Text style={homeScreenStyles.tokenText}>
                Google ID Token: {tokens.idToken?.substring(0, 50)}...
              </Text>
            </>
          )}
          
          <Text style={homeScreenStyles.tokenNote}>
            (Full tokens logged to console)
          </Text>
        </View>
      )}
      
      <TouchableOpacity style={homeScreenStyles.signOutButton} onPress={signOut}>
        <Text style={homeScreenStyles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSignInView = () => (
    <View style={homeScreenStyles.signInContainer}>
      <Text style={homeScreenStyles.description}>
        Sign in with Google to authenticate with the backend API
      </Text>
      
      <TouchableOpacity 
        style={[homeScreenStyles.signInButton, isLoading && homeScreenStyles.disabledButton]} 
        onPress={signIn}
        disabled={isLoading}
      >
        <Text style={homeScreenStyles.buttonText}>
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={homeScreenStyles.container}>
      <Text style={homeScreenStyles.title}>Bujj Mobile - Backend Auth</Text>
      
      {isSignedIn ? renderSignedInView() : renderSignInView()}
    </View>
  );
}
