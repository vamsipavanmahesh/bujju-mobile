import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ConnectionsManager } from '../../components/ConnectionsManager';
import ProfileDrawer from '../../components/ProfileDrawer';
import { useAuth } from '../../hooks/useAuth';
import { useOnboarding } from '../../hooks/useOnboarding';
import { homeScreenStyles } from '../../styles/homeScreen';

export default function HomeScreen() {
  const router = useRouter();
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

  const { checkOnboardingStatus } = useOnboarding();
  const [activeTab, setActiveTab] = useState<'actions' | 'connections'>('actions');
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false);

  // Check onboarding status when user is signed in
  useEffect(() => {
    const checkOnboarding = async () => {
      // Only check if user is signed in, not currently loading auth, haven't checked yet, and not currently checking
      if (isSignedIn && !isLoading && !onboardingChecked && !isCheckingOnboarding && user) {
        try {
          setIsCheckingOnboarding(true);
          console.log('🔄 Checking onboarding status on app load...');
          console.log('User ID:', user.id, 'Email:', user.email);
          
          const result = await checkOnboardingStatus();
          
          if (result.needsSetup) {
            console.log('📱 Redirecting to notification time setup...');
            router.replace('/notification-time-setup');
          } else {
            console.log('✅ Onboarding already completed');
          }
        } catch (error) {
          console.log('❌ Error during onboarding check:', error);
          // On error, assume onboarding is needed to be safe
          console.log('⚠️ Due to error, redirecting to notification setup as safety measure');
          router.replace('/notification-time-setup');
        } finally {
          setOnboardingChecked(true);
          setIsCheckingOnboarding(false);
        }
      }
    };

    checkOnboarding();
  }, [isSignedIn, isLoading, onboardingChecked, isCheckingOnboarding, user]);

  // Reset onboarding check status when user signs out
  useEffect(() => {
    if (!isSignedIn) {
      console.log('🔄 User signed out, resetting onboarding check status');
      setOnboardingChecked(false);
      setIsCheckingOnboarding(false);
    }
  }, [isSignedIn]);

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
          activeTab === 'connections' && homeScreenStyles.activeTabButton,
        ]}
        onPress={() => setActiveTab('connections')}
      >
        <Text
          style={[
            homeScreenStyles.tabButtonText,
            activeTab === 'connections' && homeScreenStyles.activeTabButtonText,
          ]}
        >
          Connections
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

  const renderConnectionsView = () => (
    <ConnectionsManager isSignedIn={isSignedIn} />
  );

  const renderSignedInView = () => (
    <View style={homeScreenStyles.container}>
      {renderHeader()}
      {renderTabButtons()}
      {activeTab === 'actions' ? renderActionsView() : renderConnectionsView()}
      
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

  // Show loading while checking onboarding status
  if (!onboardingChecked || isCheckingOnboarding) {
    return (
      <View style={homeScreenStyles.container}>
        <View style={homeScreenStyles.loadingContainer}>
          <Text style={homeScreenStyles.loadingText}>Setting up your experience...</Text>
        </View>
      </View>
    );
  }

  return renderSignedInView();
}