import { statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleSignInError } from '../types/auth';

/**
 * Handle backend authentication errors and return user-friendly messages
 */
export const handleBackendAuthError = (status: number, errorData: any): string => {
  console.log(`❌ Backend Error ${status}:`, errorData);
  
  switch (status) {
    case 400:
      if (errorData.error?.includes('Missing auth parameter')) {
        return 'Authentication request malformed';
      } else if (errorData.error?.includes('Missing ID token')) {
        return 'Google authentication incomplete';
      } else {
        return 'Bad request: ' + (errorData.error || 'Unknown error');
      }
      
    case 401:
      if (errorData.error?.includes('Invalid or expired token')) {
        return 'Google authentication expired. Please try again.';
      } else if (errorData.error?.includes('Email not verified')) {
        return 'Please verify your email with Google and try again.';
      } else if (errorData.error?.includes('Invalid token payload')) {
        return 'Google authentication is invalid. Please try again.';
      } else {
        return 'Authentication failed: ' + (errorData.error || 'Unauthorized');
      }
      
    case 409:
      return 'Account already exists with different authentication method.';
      
    case 422:
      return 'Account validation failed: ' + (errorData.details?.join(', ') || errorData.error);
      
    case 500:
      if (errorData.error?.includes('service unavailable')) {
        return 'Authentication service is temporarily unavailable. Please try again later.';
      } else if (errorData.error?.includes('Token generation failed')) {
        return 'Failed to generate authentication token. Please try again.';
      } else {
        return 'Server error occurred. Please try again later.';
      }
      
    default:
      return `Authentication failed (${status}): ${errorData.error || 'Unknown error'}`;
  }
};

/**
 * Handle Google Sign-In errors and return user-friendly messages
 */
export const handleGoogleSignInError = (error: unknown): string => {
  const googleError = error as GoogleSignInError;
  
  if (googleError.code === statusCodes.SIGN_IN_CANCELLED) {
    return 'Sign in was cancelled';
  } else if (googleError.code === statusCodes.IN_PROGRESS) {
    return 'Sign in is already in progress';
  } else if (googleError.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    return 'Google Play Services not available';
  } else {
    console.log('Unhandled sign-in error:', error);
    return 'Something went wrong during sign-in';
  }
};

/**
 * Check if an error is a network/connection error
 */
export const isNetworkError = (error: any): boolean => {
  return (
    error?.message?.includes('Network request failed') ||
    error?.message?.includes('fetch') ||
    error?.code === 'NETWORK_ERROR' ||
    !error?.status
  );
}; 