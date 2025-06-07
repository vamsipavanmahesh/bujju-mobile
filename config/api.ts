// API Configuration
export const API_CONFIG = {
  // Update this URL to point to your actual Rails backend
  // For local development, use:
  BASE_URL: 'http://localhost:3000/api/v1',
  
  // For production, replace with your actual production domain:
  // BASE_URL: 'https://your-actual-domain.com/api/v1',
  
  // Note: Make sure your backend server is running and accessible
  
  ENDPOINTS: {
    // Authentication endpoints
    GOOGLE_AUTH: '/auth/google',
    
    // Connections endpoints
    CONNECTIONS: '/connections',
    CONNECTION_BY_ID: (id: number) => `/connections/${id}`,
    
    // Onboarding endpoints
    ONBOARDING: '/onboarding',
    
    // User preferences endpoints
    USER_PREFERENCES: '/user_preferences',
  },
  
  // Storage keys for AsyncStorage
  STORAGE_KEYS: {
    JWT_TOKEN: 'jwt_token',
    USER_DATA: 'user_data',
  },
}; 