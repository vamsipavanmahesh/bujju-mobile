// Ultra-Modern Friends Manager Component - 2025 Design
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useFriends } from '../hooks/useFriends';
import { friendsStyles } from '../styles/friendsScreen';
import { Friend } from '../types/friends';

interface FriendFormData {
  name: string;
  phone: string;
}

interface EditModalProps {
  visible: boolean;
  friend?: Friend;
  onClose: () => void;
  onSave: (data: FriendFormData) => void;
  isLoading: boolean;
}

interface FriendsManagerProps {
  isSignedIn: boolean;
}

// Modern Modal for adding/editing friends
const FriendEditModal: React.FC<EditModalProps> = ({
  visible,
  friend,
  onClose,
  onSave,
  isLoading,
}) => {
  const [name, setName] = useState(friend?.name || '');
  const [phone, setPhone] = useState(friend?.phone || '');
  const [nameFocused, setNameFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

  React.useEffect(() => {
    if (friend) {
      setName(friend.name);
      setPhone(friend.phone);
    } else {
      setName('');
      setPhone('');
    }
  }, [friend, visible]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter a name for your friend.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Missing Information', 'Please enter a phone number for your friend.');
      return;
    }

    onSave({ name: name.trim(), phone: phone.trim() });
  };

  const isEditing = !!friend;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={friendsStyles.modalOverlay}>
        <View style={friendsStyles.modalContainer}>
          <Text style={friendsStyles.modalTitle}>
            {isEditing ? 'Edit Friend' : 'Add Friend'}
          </Text>

          <View style={friendsStyles.inputContainer}>
            <Text style={friendsStyles.inputLabel}>Name</Text>
            <TextInput
              style={[
                friendsStyles.textInput,
                nameFocused && friendsStyles.textInputFocused,
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Enter friend's name"
              placeholderTextColor="#8E8E93"
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              editable={!isLoading}
            />
          </View>

          <View style={friendsStyles.inputContainer}>
            <Text style={friendsStyles.inputLabel}>Phone Number</Text>
            <TextInput
              style={[
                friendsStyles.textInput,
                phoneFocused && friendsStyles.textInputFocused,
              ]}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              placeholderTextColor="#8E8E93"
              keyboardType="phone-pad"
              onFocus={() => setPhoneFocused(true)}
              onBlur={() => setPhoneFocused(false)}
              editable={!isLoading}
            />
          </View>

          <View style={friendsStyles.modalActions}>
            <TouchableOpacity
              style={[friendsStyles.modalButton, friendsStyles.cancelButton]}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={[friendsStyles.modalButtonText, friendsStyles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[friendsStyles.modalButton, friendsStyles.saveButton]}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={[friendsStyles.modalButtonText, friendsStyles.saveButtonText]}>
                  {isEditing ? 'Update' : 'Add'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Individual friend card component
interface FriendCardProps {
  friend: Friend;
  onEdit: (friend: Friend) => void;
  onDelete: (id: number, name: string) => void;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <View style={friendsStyles.friendCard}>
      <View style={friendsStyles.friendHeader}>
        <View style={friendsStyles.friendInfo}>
          <Text style={friendsStyles.friendName}>{friend.name}</Text>
          <Text style={friendsStyles.friendPhone}>{friend.phone}</Text>
          <Text style={friendsStyles.friendDate}>
            Added {formatDate(friend.created_at)}
          </Text>
        </View>
        
        <View style={friendsStyles.friendActions}>
          <TouchableOpacity
            style={[friendsStyles.actionButton, friendsStyles.editButton]}
            onPress={() => onEdit(friend)}
          >
            <Text style={friendsStyles.editButtonIcon}>✏️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[friendsStyles.actionButton, friendsStyles.deleteButton]}
            onPress={() => onDelete(friend.id, friend.name)}
          >
            <Text style={friendsStyles.deleteButtonIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Main Friends Manager Component
export const FriendsManager: React.FC<FriendsManagerProps> = ({ isSignedIn }) => {
  const {
    friends,
    isLoading,
    error,
    friendsCount,
    hasFriends,
    addFriend,
    editFriend,
    removeFriend,
    refreshFriends,
    clearError,
  } = useFriends({ isSignedIn });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingFriend, setEditingFriend] = useState<Friend | undefined>();
  const [modalLoading, setModalLoading] = useState(false);

  // Show authentication required message if not signed in
  if (!isSignedIn) {
    return (
      <View style={friendsStyles.container}>
        <View style={friendsStyles.header}>
          <View style={friendsStyles.headerContent}>
            <Text style={friendsStyles.headerTitle}>Friends</Text>
            <Text style={friendsStyles.headerSubtitle}>Authentication required</Text>
          </View>
        </View>
        <View style={friendsStyles.emptyState}>
          <Text style={friendsStyles.emptyStateIcon}>👥</Text>
          <Text style={friendsStyles.emptyStateText}>Please sign in to manage your friends</Text>
          <Text style={friendsStyles.emptyStateSubtext}>
            Switch to the Profile tab and sign in with Google to access your friends list.
          </Text>
        </View>
      </View>
    );
  }

  const handleAddFriend = () => {
    setEditingFriend(undefined);
    setModalVisible(true);
  };

  const handleEditFriend = (friend: Friend) => {
    setEditingFriend(friend);
    setModalVisible(true);
  };

  const handleSaveFriend = async (data: FriendFormData) => {
    setModalLoading(true);
    
    try {
      if (editingFriend) {
        // Update existing friend
        await editFriend(editingFriend.id, data.name, data.phone);
      } else {
        // Add new friend
        await addFriend(data.name, data.phone);
      }
      setModalVisible(false);
      setEditingFriend(undefined);
    } catch (error) {
      // Error handling is done in the hook
      console.log('Failed to save friend:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteFriend = async (id: number, name: string) => {
    try {
      await removeFriend(id, name);
    } catch (error) {
      // Error handling is done in the hook
      console.log('Failed to delete friend:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshFriends();
    } catch (error) {
      console.log('Failed to refresh friends:', error);
    }
  };

  const renderFriend = ({ item }: { item: Friend }) => (
    <FriendCard
      friend={item}
      onEdit={handleEditFriend}
      onDelete={handleDeleteFriend}
    />
  );

  const renderEmptyState = () => (
    <View style={friendsStyles.emptyState}>
      <Text style={friendsStyles.emptyStateIcon}>👥</Text>
      <Text style={friendsStyles.emptyStateText}>No friends yet</Text>
      <Text style={friendsStyles.emptyStateSubtext}>
        Add your first friend to get started with managing your contacts.
      </Text>
      <TouchableOpacity
        style={friendsStyles.emptyAddButton}
        onPress={handleAddFriend}
      >
        <Text style={friendsStyles.emptyAddButtonText}>Add Your First Friend</Text>
      </TouchableOpacity>
    </View>
  );

  const renderError = () => (
    <View style={friendsStyles.errorContainer}>
      <Text style={friendsStyles.errorText}>{error}</Text>
      <TouchableOpacity
        style={friendsStyles.retryButton}
        onPress={() => {
          clearError();
          handleRefresh();
        }}
      >
        <Text style={friendsStyles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading && !hasFriends) {
    return (
      <View style={friendsStyles.container}>
        <View style={friendsStyles.header}>
          <View style={friendsStyles.headerContent}>
            <Text style={friendsStyles.headerTitle}>Friends</Text>
            <Text style={friendsStyles.headerSubtitle}>Loading your friends...</Text>
          </View>
        </View>
        <View style={friendsStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={friendsStyles.loadingText}>Loading friends...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={friendsStyles.container}>
      {/* Modern Header */}
      <View style={friendsStyles.header}>
        <View style={friendsStyles.headerContent}>
          <Text style={friendsStyles.headerTitle}>Friends</Text>
          <Text style={friendsStyles.headerSubtitle}>
            {friendsCount === 0 ? 'No friends yet' : `${friendsCount} friend${friendsCount === 1 ? '' : 's'}`}
          </Text>
        </View>
      </View>

      {/* Error Display */}
      {error && renderError()}

      {/* Friends List */}
      {hasFriends ? (
        <FlatList
          style={friendsStyles.friendsList}
          data={friends}
          renderItem={renderFriend}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
        />
      ) : !isLoading && !error ? (
        renderEmptyState()
      ) : null}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={friendsStyles.addButton}
        onPress={handleAddFriend}
      >
        <Text style={friendsStyles.addButtonIcon}>+</Text>
      </TouchableOpacity>

      {/* Add/Edit Modal */}
      <FriendEditModal
        visible={modalVisible}
        friend={editingFriend}
        onClose={() => {
          setModalVisible(false);
          setEditingFriend(undefined);
        }}
        onSave={handleSaveFriend}
        isLoading={modalLoading}
      />
    </View>
  );
};