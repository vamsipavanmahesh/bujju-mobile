import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { FriendsManager } from '../../components/FriendsManager';
import ProfileDrawer from '../../components/ProfileDrawer';
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

  const [activeTab, setActiveTab] = useState<'actions' | 'friends'>('actions');
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  const renderHeader = () => (
    <View style={homeScreenStyles.headerContainer}>
      {user?.avatar_url && (
        <TouchableOpacity 
          style={homeScreenStyles.profilePicContainer}
          onPress={() => setShowProfileDrawer(true)}
        >
          <Image 
            source={{ uri: user.avatar_url }} 
            style={homeScreenStyles.headerAvatar} 
          />
        </TouchableOpacity>
      )}
      <Text style={homeScreenStyles.title}>Welcome back!</Text>
    </View>
  );

  const renderTabButtons = () => (
    <View style={homeScreenStyles.tabContainer}>
      <TouchableOpacity
        style={[
          homeScreenStyles.tabButton,
          activeTab === 'actions' && homeScreenStyles.activeTabButton,
        ]}
        onPress={() => setActiveTab('actions')}
      >
        <Text
          style={[
            homeScreenStyles.tabButtonText,
            activeTab === 'actions' && homeScreenStyles.activeTabButtonText,
          ]}
        >
          Actions
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          homeScreenStyles.tabButton,
          activeTab === 'friends' && homeScreenStyles.activeTabButton,
        ]}
        onPress={() => setActiveTab('friends')}
      >
        <Text
          style={[
            homeScreenStyles.tabButtonText,
            activeTab === 'friends' && homeScreenStyles.activeTabButtonText,
          ]}
        >
          Friends
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderActionsView = () => (
    <ScrollView style={homeScreenStyles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={homeScreenStyles.userContainer}>
        {user?.avatar_url && (
          <Image source={{ uri: user.avatar_url }} style={homeScreenStyles.avatar} />
        )}
        <Text style={homeScreenStyles.userName}>{user?.name}</Text>
        <Text style={homeScreenStyles.userEmail}>{user?.email}</Text>
        <Text style={homeScreenStyles.userId}>ID: {user?.id}</Text>
        
        <TouchableOpacity 
          style={homeScreenStyles.tokenButton} 
          onPress={toggleTokenVisibility}
        >
          <Text style={homeScreenStyles.buttonText}>
            {showTokens ? 'Hide Tokens' : 'Show Tokens'}
          </Text>
        </TouchableOpacity>
        
        {showTokens && (
          <View style={homeScreenStyles.tokenContainer}>
            <Text style={homeScreenStyles.tokenTitle}>Authentication Tokens</Text>
            
            <TouchableOpacity 
              style={homeScreenStyles.tokenViewButton}
              onPress={showJWTToken}
            >
              <Text style={homeScreenStyles.tokenButtonText}>View JWT Token</Text>
            </TouchableOpacity>
            
            {tokens && (
              <>
                <Text style={homeScreenStyles.tokenText}>
                  Access Token: {tokens.accessToken?.substring(0, 40)}...
                </Text>
                <Text style={homeScreenStyles.tokenText}>
                  ID Token: {tokens.idToken?.substring(0, 40)}...
                </Text>
              </>
            )}
            
            <Text style={homeScreenStyles.tokenNote}>
              Full tokens logged to console
            </Text>
          </View>
        )}
        
        <TouchableOpacity style={homeScreenStyles.signOutButton} onPress={signOut}>
          <Text style={homeScreenStyles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderFriendsView = () => (
    <FriendsManager isSignedIn={isSignedIn} />
  );

  const renderSignedInView = () => (
    <View style={homeScreenStyles.container}>
      {renderHeader()}
      {renderTabButtons()}
      {activeTab === 'actions' ? renderActionsView() : renderFriendsView()}
      
      <ProfileDrawer
        visible={showProfileDrawer}
        onClose={() => setShowProfileDrawer(false)}
        user={user!}
        showTokens={showTokens}
        onToggleTokens={toggleTokenVisibility}
        onShowJWTToken={showJWTToken}
        onSignOut={signOut}
        tokens={tokens}
      />
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

  if (!isSignedIn) {
    return (
      <View style={homeScreenStyles.container}>
        <Text style={homeScreenStyles.title}>Bujj Mobile</Text>
        {renderSignInView()}
      </View>
    );
  }

  return renderSignedInView();
}