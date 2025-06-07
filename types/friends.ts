// Friends-related types and interfaces

export interface Friend {
  id: number;
  name: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFriendRequest {
  friend: {
    name: string;
    phone: string;
  };
}

export interface UpdateFriendRequest {
  friend: {
    name?: string;
    phone?: string;
  };
}

export interface FriendsApiResponse {
  success: boolean;
  data: Friend[];
}

export interface FriendApiResponse {
  success: boolean;
  data: Friend;
  message?: string;
}

export interface FriendDeleteResponse {
  success: boolean;
  message: string;
}

export interface FriendError {
  success: boolean;
  error?: string;
  errors?: string[];
}

export interface FriendsState {
  friends: Friend[];
  isLoading: boolean;
  error: string | null;
  selectedFriend: Friend | null;
} 