# 🚨 CRITICAL FIXES - Quick Reference

## ⚠️ **CANNOT GO TO PRODUCTION WITHOUT THESE:**

### 1. **🔥 TempStorage → Real Storage**
```bash
# Current (TEMPORARY):
import { tempStorage } from './tempStorage';

# Needs to become (PRODUCTION):
import AsyncStorage from '@react-native-async-storage/async-storage';
# OR
import * as SecureStore from 'expo-secure-store';
```

### 2. **🌐 Backend URL Configuration**
```typescript
// File: config/api.ts
// Current (PLACEHOLDER):
BASE_URL: 'http://your-domain.com/api/v1'

// Needs (PRODUCTION):
BASE_URL: 'https://your-actual-domain.com/api/v1'
```

### 3. **🔑 Google OAuth Review**
```typescript
// File: services/authService.ts
// Verify these are correct for production:
webClientId: '691822913111-5blrq6gl7v71snfnhl7okh2atsnu9faq.apps.googleusercontent.com'
iosClientId: '691822913111-5blrq6gl7v71snfnhl7okh2atsnu9faq.apps.googleusercontent.com'
```

---

## 🎯 **IMMEDIATE ACTION PLAN:**

1. **First** → Fix storage (TempStorage replacement)
2. **Second** → Update backend URL 
3. **Third** → Verify Google OAuth config
4. **Fourth** → Test complete flow with production backend

---

## 📋 **Files That MUST Be Updated:**

- [ ] `services/authService.ts` - Replace tempStorage
- [ ] `config/api.ts` - Update BASE_URL
- [ ] `services/tempStorage.ts` - DELETE this file
- [ ] Test authentication flow end-to-end

---

## ⚡ **Quick Test Checklist:**

- [ ] Sign in with Google
- [ ] Get JWT from your Rails backend  
- [ ] Close app, reopen → still signed in
- [ ] Sign out → completely cleared
- [ ] Test error scenarios

**Status:** 🟡 **Development Ready** → Need: 🟢 **Production Ready** 