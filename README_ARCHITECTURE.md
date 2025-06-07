# 🏗️ Code Architecture & Organization

This React Native app follows a clean, organized architecture with proper separation of concerns for maintainability and scalability.

## 📁 Project Structure

```
app/
├── (tabs)/
│   └── index.tsx              # Main HomeScreen component (UI only)
├── types/
│   └── auth.ts                # Authentication-related TypeScript interfaces
├── services/
│   └── authService.ts         # Authentication API calls and business logic
├── hooks/
│   └── useAuth.ts             # Authentication state management hook
├── utils/
│   └── authErrors.ts          # Error handling utilities
├── styles/
│   └── homeScreen.ts          # Component styles
├── config/
│   └── api.ts                 # API configuration constants
└── ...
```

## 🧩 Architecture Components

### 1. **Types Layer** (`types/auth.ts`)
- **Purpose**: Centralized TypeScript interfaces and types
- **Contains**:
  - `User` interface for user data
  - `BackendAuthResponse` for API responses
  - `GoogleUserInfo` for Google Sign-In data
  - `AuthState` for hook state management
  - Error types for better type safety

### 2. **Services Layer** (`services/authService.ts`)
- **Purpose**: API calls and authentication business logic
- **Responsibilities**:
  - Google Sign-In configuration
  - Backend API communication
  - Token management (store, retrieve, verify)
  - Authentication flow orchestration
- **Benefits**: 
  - Reusable across components
  - Easy to test and mock
  - Clear separation from UI logic

### 3. **Hooks Layer** (`hooks/useAuth.ts`)
- **Purpose**: State management and component integration
- **Responsibilities**:
  - Authentication state management
  - Lifecycle management (initialization, cleanup)
  - UI action handlers
  - Error handling and user feedback
- **Benefits**:
  - Stateful logic reuse
  - Clean component separation
  - React-optimized state updates

### 4. **Utils Layer** (`utils/authErrors.ts`)
- **Purpose**: Shared utility functions
- **Contains**:
  - Error message mapping
  - User-friendly error handling
  - Network error detection
- **Benefits**:
  - Consistent error handling
  - Easy to maintain error messages
  - Reusable across the app

### 5. **Styles Layer** (`styles/homeScreen.ts`)
- **Purpose**: Component styling
- **Benefits**:
  - Separated presentation from logic
  - Reusable style definitions
  - Easy theme management
  - Better performance (styles defined once)

### 6. **Config Layer** (`config/api.ts`)
- **Purpose**: Configuration constants
- **Contains**:
  - API base URLs
  - Endpoint definitions
  - Storage keys
- **Benefits**:
  - Environment-specific configurations
  - Single source of truth
  - Easy to update for different environments

## 🔄 Data Flow

```
UI Component (index.tsx)
    ↓ (user actions)
Custom Hook (useAuth.ts)
    ↓ (business logic)
Auth Service (authService.ts)
    ↓ (API calls)
Backend/Google APIs
    ↑ (responses)
Error Utils (authErrors.ts) → User-friendly messages
    ↑ (styled data)
Styles (homeScreen.ts) → Consistent UI
```

## 📊 Component Responsibilities

### **HomeScreen Component** (`app/(tabs)/index.tsx`)
- **ONLY responsible for**:
  - UI rendering
  - User interaction events
  - Component composition
- **NOT responsible for**:
  - State management
  - API calls
  - Business logic
  - Error handling logic

### **useAuth Hook** (`hooks/useAuth.ts`)
- **Manages**: Authentication state and user interactions
- **Provides**: Clean API for components to use
- **Handles**: Error states and user feedback

### **AuthService** (`services/authService.ts`)
- **Handles**: All authentication-related API calls
- **Provides**: Promise-based methods
- **Manages**: Token storage and validation

## 🎯 Benefits of This Architecture

### **1. Maintainability**
- Each file has a single, clear responsibility
- Easy to locate and fix issues
- Changes are isolated to relevant layers

### **2. Testability**
- Services can be unit tested independently
- Hooks can be tested with React Testing Library
- Easy to mock dependencies

### **3. Reusability**
- Services can be used by multiple components
- Hooks can be shared across screens
- Utilities work everywhere

### **4. Scalability**
- Easy to add new authentication methods
- Simple to extend with new features
- Clear patterns for team development

### **5. Type Safety**
- Centralized interfaces prevent type errors
- Better IDE support and autocomplete
- Compile-time error catching

## 🔧 Development Workflow

### **Adding New Features**
1. Define types in `types/` directory
2. Add business logic to appropriate service
3. Update or create hooks for state management
4. Update UI components to use new functionality
5. Add error handling in utils

### **Modifying Existing Features**
1. Identify the appropriate layer (UI, state, business logic)
2. Make changes in the relevant file(s)
3. Update dependent layers if needed
4. Test the change in isolation

### **Debugging Issues**
1. Check console logs (services provide detailed logging)
2. Verify state in React DevTools (hooks)
3. Test API calls independently (services)
4. Check error handling (utils)

## 🚀 Performance Benefits

- **Lazy Loading**: Components only import what they need
- **Memoization**: Hooks optimize re-renders
- **Code Splitting**: Clear boundaries for bundle optimization
- **Caching**: Services can implement caching strategies

This architecture ensures your app remains maintainable, testable, and scalable as it grows! 🎉 