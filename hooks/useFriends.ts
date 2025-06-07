// Friends Hook - Manages friends state and operations
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
    createFriend,
    deleteFriend,
    fetchFriend,
    fetchFriends,
    updateFriend,
} from '../services/friendsService';
import {
    CreateFriendRequest,
    FriendsState,
    UpdateFriendRequest
} from '../types/friends';

interface UseFriendsProps {
  isSignedIn: boolean;
}

export const useFriends = ({ isSignedIn }: UseFriendsProps) => {
  const [state, setState] = useState<FriendsState>({
    friends: [],
    isLoading: false,
    error: null,
    selectedFriend: null,
  });

  // Load all friends
  const loadFriends = useCallback(async () => {
    if (!isSignedIn) {
      console.log('👥 Skipping friends load - user not signed in');
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('👥 Loading friends...');
      const friends = await fetchFriends();
      setState(prev => ({
        ...prev,
        friends,
        isLoading: false,
        error: null,
      }));
      console.log('✅ Friends loaded successfully:', friends.length);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load friends';
      console.log('❌ Failed to load friends:', errorMessage);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, [isSignedIn]);

  // Load a specific friend
  const loadFriend = useCallback(async (id: number) => {
    if (!isSignedIn) {
      throw new Error('Authentication required to load friend');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('👤 Loading friend:', id);
      const friend = await fetchFriend(id);
      setState(prev => ({
        ...prev,
        selectedFriend: friend,
        isLoading: false,
        error: null,
      }));
      console.log('✅ Friend loaded successfully:', friend.name);
      return friend;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load friend';
      console.log('❌ Failed to load friend:', errorMessage);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [isSignedIn]);

  // Add a new friend
  const addFriend = useCallback(async (name: string, phone: string) => {
    if (!isSignedIn) {
      throw new Error('Authentication required to add friend');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('➕ Adding friend:', name, phone);
      
      const friendData: CreateFriendRequest = {
        friend: { name: name.trim(), phone: phone.trim() }
      };
      
      const newFriend = await createFriend(friendData);
      
      setState(prev => ({
        ...prev,
        friends: [...prev.friends, newFriend],
        isLoading: false,
        error: null,
      }));
      
      console.log('✅ Friend added successfully:', newFriend.name);
      Alert.alert('Success', `${newFriend.name} has been added to your friends list!`);
      return newFriend;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add friend';
      console.log('❌ Failed to add friend:', errorMessage);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      Alert.alert('Error', errorMessage);
      throw error;
    }
  }, [isSignedIn]);

  // Update an existing friend
  const editFriend = useCallback(async (id: number, name?: string, phone?: string) => {
    if (!isSignedIn) {
      throw new Error('Authentication required to edit friend');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('✏️ Editing friend:', id, { name, phone });
      
      const friendData: UpdateFriendRequest = {
        friend: {}
      };
      
      if (name !== undefined) friendData.friend.name = name.trim();
      if (phone !== undefined) friendData.friend.phone = phone.trim();
      
      const updatedFriend = await updateFriend(id, friendData);
      
      setState(prev => ({
        ...prev,
        friends: prev.friends.map(friend => 
          friend.id === id ? updatedFriend : friend
        ),
        selectedFriend: prev.selectedFriend?.id === id ? updatedFriend : prev.selectedFriend,
        isLoading: false,
        error: null,
      }));
      
      console.log('✅ Friend updated successfully:', updatedFriend.name);
      Alert.alert('Success', `${updatedFriend.name} has been updated!`);
      return updatedFriend;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update friend';
      console.log('❌ Failed to update friend:', errorMessage);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      Alert.alert('Error', errorMessage);
      throw error;
    }
  }, [isSignedIn]);

  // Remove a friend
  const removeFriend = useCallback(async (id: number, friendName?: string) => {
    if (!isSignedIn) {
      throw new Error('Authentication required to remove friend');
    }

    // Show confirmation dialog
    const confirmDelete = () => {
      return new Promise<boolean>((resolve) => {
        Alert.alert(
          'Delete Friend',
          `Are you sure you want to remove ${friendName || 'this friend'} from your list?`,
          [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Delete', style: 'destructive', onPress: () => resolve(true) },
          ]
        );
      });
    };

    const shouldDelete = await confirmDelete();
    if (!shouldDelete) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('🗑️ Removing friend:', id);
      
      const message = await deleteFriend(id);
      
      setState(prev => ({
        ...prev,
        friends: prev.friends.filter(friend => friend.id !== id),
        selectedFriend: prev.selectedFriend?.id === id ? null : prev.selectedFriend,
        isLoading: false,
        error: null,
      }));
      
      console.log('✅ Friend removed successfully');
      Alert.alert('Success', message || 'Friend has been removed from your list.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove friend';
      console.log('❌ Failed to remove friend:', errorMessage);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      Alert.alert('Error', errorMessage);
      throw error;
    }
  }, [isSignedIn]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Clear selected friend
  const clearSelectedFriend = useCallback(() => {
    setState(prev => ({ ...prev, selectedFriend: null }));
  }, []);

  // Refresh friends list
  const refreshFriends = useCallback(async () => {
    console.log('🔄 Refreshing friends list...');
    await loadFriends();
  }, [loadFriends]);

  // Reset friends when user signs out
  useEffect(() => {
    if (!isSignedIn) {
      console.log('👤 User signed out, clearing friends data');
      setState({
        friends: [],
        isLoading: false,
        error: null,
        selectedFriend: null,
      });
    }
  }, [isSignedIn]);

  // Load friends when user signs in
  useEffect(() => {
    if (isSignedIn) {
      console.log('👤 User signed in, loading friends...');
      loadFriends();
    }
  }, [isSignedIn, loadFriends]);

  return {
    // State
    friends: state.friends,
    isLoading: state.isLoading,
    error: state.error,
    selectedFriend: state.selectedFriend,
    
    // Actions
    loadFriends,
    loadFriend,
    addFriend,
    editFriend,
    removeFriend,
    refreshFriends,
    clearError,
    clearSelectedFriend,
    
    // Computed values
    friendsCount: state.friends.length,
    hasFriends: state.friends.length > 0,
  };
}; 