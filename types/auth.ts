// Authentication-related types and interfaces

export interface User {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;
}

export interface BackendAuthResponse {
  token: string;
  user: User;
}

export interface GoogleUserInfo {
  id: string;
  name: string | null;
  email: string;
  photo: string | null;
  familyName: string | null;
  givenName: string | null;
}

export interface GoogleSignInError {
  code?: string;
  message?: string;
}

export interface AuthState {
  user: User | null;
  isSignedIn: boolean;
  isLoading: boolean;
  tokens: any;
} 