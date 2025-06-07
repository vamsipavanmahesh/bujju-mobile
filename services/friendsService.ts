// Friends Service - Handles all API calls for friends management
import { API_CONFIG } from '../config/api';
import {
    CreateFriendRequest,
    Friend,
    FriendApiResponse,
    FriendDeleteResponse,
    FriendsApiResponse,
    UpdateFriendRequest
} from '../types/friends';
import { getStoredToken } from './tempStorage';

const FRIENDS_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FRIENDS}`;

// Generic error handler for friends API
const handleFriendsError = (error: any, operation: string): string => {
  console.log(`❌ Friends API Error (${operation}):`, error);
  
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 401:
        return 'Authentication required. Please log in again.';
      case 404:
        return 'Friend not found.';
      case 422:
        if (data.errors && Array.isArray(data.errors)) {
          return data.errors.join(', ');
        }
        return 'Invalid friend data provided.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.error || `Failed to ${operation}. Please try again.`;
    }
  }
  
  if (error.message) {
    return `Network error: ${error.message}`;
  }
  
  return `Failed to ${operation}. Please check your connection and try again.`;
};

// Get authorization headers
const getAuthHeaders = async () => {
  const token = await getStoredToken();
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Fetch all friends
export const fetchFriends = async (): Promise<Friend[]> => {
  try {
    console.log('🔍 Fetching friends from:', FRIENDS_BASE_URL);
    
    const headers = await getAuthHeaders();
    const response = await fetch(FRIENDS_BASE_URL, {
      method: 'GET',
      headers,
    });
    
    console.log('📥 Friends fetch response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw { response: { status: response.status, data: errorData } };
    }
    
    const data: FriendsApiResponse = await response.json();
    console.log('✅ Friends fetched successfully:', data.data.length, 'friends');
    
    return data.data;
  } catch (error) {
    const errorMessage = handleFriendsError(error, 'fetch friends');
    throw new Error(errorMessage);
  }
};

// Get single friend by ID
export const fetchFriend = async (id: number): Promise<Friend> => {
  try {
    const url = `${FRIENDS_BASE_URL}/${id}`;
    console.log('🔍 Fetching friend from:', url);
    
    const headers = await getAuthHeaders();
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });
    
    console.log('📥 Friend fetch response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw { response: { status: response.status, data: errorData } };
    }
    
    const data: FriendApiResponse = await response.json();
    console.log('✅ Friend fetched successfully:', data.data.name);
    
    return data.data;
  } catch (error) {
    const errorMessage = handleFriendsError(error, 'fetch friend');
    throw new Error(errorMessage);
  }
};

// Create new friend
export const createFriend = async (friendData: CreateFriendRequest): Promise<Friend> => {
  try {
    console.log('➕ Creating friend:', friendData.friend.name);
    
    const headers = await getAuthHeaders();
    const response = await fetch(FRIENDS_BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(friendData),
    });
    
    console.log('📥 Friend create response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw { response: { status: response.status, data: errorData } };
    }
    
    const data: FriendApiResponse = await response.json();
    console.log('✅ Friend created successfully:', data.data.name);
    
    return data.data;
  } catch (error) {
    const errorMessage = handleFriendsError(error, 'create friend');
    throw new Error(errorMessage);
  }
};

// Update existing friend
export const updateFriend = async (id: number, friendData: UpdateFriendRequest): Promise<Friend> => {
  try {
    const url = `${FRIENDS_BASE_URL}/${id}`;
    console.log('✏️ Updating friend:', id, friendData.friend);
    
    const headers = await getAuthHeaders();
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(friendData),
    });
    
    console.log('📥 Friend update response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw { response: { status: response.status, data: errorData } };
    }
    
    const data: FriendApiResponse = await response.json();
    console.log('✅ Friend updated successfully:', data.data.name);
    
    return data.data;
  } catch (error) {
    const errorMessage = handleFriendsError(error, 'update friend');
    throw new Error(errorMessage);
  }
};

// Delete friend
export const deleteFriend = async (id: number): Promise<string> => {
  try {
    const url = `${FRIENDS_BASE_URL}/${id}`;
    console.log('🗑️ Deleting friend:', id);
    
    const headers = await getAuthHeaders();
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });
    
    console.log('📥 Friend delete response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw { response: { status: response.status, data: errorData } };
    }
    
    const data: FriendDeleteResponse = await response.json();
    console.log('✅ Friend deleted successfully');
    
    return data.message;
  } catch (error) {
    const errorMessage = handleFriendsError(error, 'delete friend');
    throw new Error(errorMessage);
  }
}; 