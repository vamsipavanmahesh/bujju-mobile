# Backend Integration Setup Guide

This React Native app now includes full integration with your Rails backend for Google Sign-In authentication.

## Features

✅ **Google Sign-In** - Users can authenticate with Google  
✅ **Backend Authentication** - ID tokens are sent to Rails backend for verification  
✅ **JWT Token Management** - Secure storage and automatic refresh handling  
✅ **Persistent Sessions** - Users stay logged in between app launches  
✅ **Comprehensive Error Handling** - User-friendly error messages for all API error cases  
✅ **Token Verification** - Automatic verification of stored JWT tokens  
✅ **Detailed Logging** - Clear console logs for debugging authentication flow  

## Configuration

### 1. Update Backend URL

Edit `config/api.ts` and update the `BASE_URL` to point to your Rails backend:

```typescript
export const API_CONFIG = {
  // For local development:
  BASE_URL: 'http://localhost:3000/api/v1',
  
  // For production:
  // BASE_URL: 'https://your-production-domain.com/api/v1',
  
  // ... rest of config
};
```

### 2. Backend Requirements

Your Rails backend should have these endpoints:

- `POST /api/v1/auth/google` - Google authentication endpoint
- `GET /api/v1/auth/verify` - JWT token verification endpoint (optional)

### 3. Google OAuth Setup

Make sure your Google OAuth configuration matches between:
- React Native app (in `GoogleSignin.configure()`)
- Rails backend (`GOOGLE_CLIENT_ID` environment variable)

## Authentication Flow

1. **User Taps Sign In** → Google Sign-In opens
2. **Google Authentication** → Returns ID token
3. **Backend Request** → ID token sent to Rails `/auth/google`
4. **Backend Verification** → Rails verifies token with Google
5. **JWT Generation** → Rails creates and returns JWT + user data
6. **Secure Storage** → App stores JWT and user data locally
7. **Session Persistence** → User stays logged in on app restart

## Error Handling

The app handles all error scenarios from your API contract:

- **400 Bad Request** - Missing parameters or malformed requests
- **401 Unauthorized** - Invalid/expired tokens, unverified email
- **409 Conflict** - Duplicate user data
- **422 Unprocessable Entity** - User validation failures
- **500 Internal Server Error** - Service unavailable, token generation failed

## JWT Token Management

- **Storage**: Tokens stored securely in AsyncStorage
- **Verification**: Automatic token verification on app launch
- **Expiration**: 24-hour expiration (configurable in Rails backend)
- **Refresh**: Automatic re-authentication when tokens expire

## Debugging

### Console Logs

The app provides detailed logging with emojis for easy identification:

- 🚀 **Sign-in process started**
- ✅ **Successful operations**
- ❌ **Errors and failures**
- 🔑 **Token operations**
- 💾 **Storage operations**
- 🌐 **Network requests**
- 📱 **Google Sign-In events**
- 📥/📤 **API request/response data**

### Token Inspection

Users can view their tokens in the app:
1. Sign in successfully
2. Tap "Show JWT & OAuth Tokens"
3. Tap "View JWT Token" to see the full token in console/alert

### Network Debugging

All API requests log:
- Request URL and method
- Request headers and body
- Response status and headers
- Response data

## Testing

### Test Different Scenarios

1. **First-time sign-in** - Fresh installation
2. **Return user** - App restart with valid token
3. **Expired token** - Token verification fails
4. **Network errors** - Backend unavailable
5. **Backend errors** - Various HTTP error codes

### Local Development

For local testing:
1. Start your Rails backend on `localhost:3000`
2. Update `config/api.ts` with local URL
3. Ensure both iOS simulator and Rails server can communicate

## Production Deployment

1. Update `config/api.ts` with production URL
2. Ensure your Rails backend is deployed and accessible
3. Verify Google OAuth configuration works in production
4. Test the full authentication flow

## Security Notes

- JWT tokens are stored in AsyncStorage (encrypted by default)
- ID tokens are only sent to your verified backend
- No sensitive data is logged in production builds
- Tokens automatically expire and require re-authentication

---

**Need help?** Check the console logs for detailed debugging information during the authentication process. 