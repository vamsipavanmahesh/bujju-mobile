import React from 'react';
import {
    Animated,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { User } from '../types/auth';

const { width } = Dimensions.get('window');

interface ProfileDrawerProps {
  visible: boolean;
  onClose: () => void;
  user: User;
  showTokens: boolean;
  onToggleTokens: () => void;
  onShowJWTToken: () => void;
  onSignOut: () => void;
  tokens?: {
    accessToken?: string;
    idToken?: string;
  };
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  visible,
  onClose,
  user,
  showTokens,
  onToggleTokens,
  onShowJWTToken,
  onSignOut,
  tokens,
}) => {
  const slideAnim = React.useRef(new Animated.Value(-width)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: -width,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Profile Section */}
            <View style={styles.profileSection}>
              {user?.avatar_url && (
                <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
              )}
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <Text style={styles.userId}>ID: {user?.id}</Text>
            </View>

            {/* Actions Section */}
            <View style={styles.actionsSection}>
              <TouchableOpacity style={styles.actionButton} onPress={onToggleTokens}>
                <Text style={styles.actionButtonText}>
                  {showTokens ? 'Hide Tokens' : 'Show Tokens'}
                </Text>
              </TouchableOpacity>

              {showTokens && (
                <View style={styles.tokenContainer}>
                  <Text style={styles.tokenTitle}>Authentication Tokens</Text>
                  
                  <TouchableOpacity style={styles.tokenViewButton} onPress={onShowJWTToken}>
                    <Text style={styles.tokenButtonText}>View JWT Token</Text>
                  </TouchableOpacity>
                  
                  {tokens && (
                    <>
                      <Text style={styles.tokenText}>
                        Access Token: {tokens.accessToken?.substring(0, 30)}...
                      </Text>
                      <Text style={styles.tokenText}>
                        ID Token: {tokens.idToken?.substring(0, 30)}...
                      </Text>
                    </>
                  )}
                  
                  <Text style={styles.tokenNote}>
                    Full tokens logged to console
                  </Text>
                </View>
              )}

              <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
                <Text style={styles.signOutButtonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = {
  overlay: {
    flex: 1,
    flexDirection: 'row' as const,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    width: width * 0.85,
    maxWidth: 320,
    backgroundColor: '#1C1C1E',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#8E8E93',
    fontSize: 20,
    fontWeight: '300',
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#2C2C2E',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  userEmail: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
    textAlign: 'center',
    fontWeight: '400',
  },
  userId: {
    fontSize: 12,
    color: '#636366',
    textAlign: 'center',
    fontWeight: '400',
  },
  actionsSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  actionButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 16,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },
  tokenContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  tokenTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#ffffff',
  },
  tokenViewButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
    height: 32,
  },
  tokenButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
  },
  tokenText: {
    fontSize: 11,
    fontFamily: 'monospace',
    backgroundColor: '#1C1C1E',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    color: '#8E8E93',
    lineHeight: 16,
  },
  tokenNote: {
    fontSize: 11,
    color: '#636366',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '400',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },
};

export default ProfileDrawer; 