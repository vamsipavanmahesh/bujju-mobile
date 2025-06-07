// API Configuration
export const API_CONFIG = {
  // Update this URL to point to your actual Rails backend
  BASE_URL: 'http://localhost:3000/api/v1',
  
  // If running backend locally for development, use:
  // BASE_URL: 'http://localhost:3000/api/v1',
  
  // For production, replace with your production domain:
  // BASE_URL: 'https://your-production-domain.com/api/v1',
  
  ENDPOINTS: {
    // Authentication endpoints
    GOOGLE_AUTH: '/auth/google',
    TOKEN_VERIFY: '/auth/verify',
    
    // Friends endpoints
    FRIENDS: '/friends',
    FRIEND_BY_ID: (id: number) => `/friends/${id}`,
  },
  
  // Storage keys for AsyncStorage
  STORAGE_KEYS: {
    JWT_TOKEN: 'jwt_token',
    USER_DATA: 'user_data',
  },
}; 