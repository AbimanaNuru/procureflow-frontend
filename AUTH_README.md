# ProcureFlow Authentication System

## Quick Start

### 1. Install Dependencies
```bash
# Fix npm permissions (if needed)
sudo chown -R 501:20 "/Users/macbook/.npm"

# Install axios
npm install axios
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Login Credentials
- **Username**: `admin`
- **Password**: `password123`

## Project Structure

```
src/
├── types/                  # TypeScript type definitions
│   ├── auth.types.ts      # Authentication types
│   ├── user.types.ts      # User types
│   └── index.ts           # Type exports
│
├── services/              # API service functions
│   ├── auth.service.ts    # Authentication API calls
│   ├── user.service.ts    # User API calls
│   └── index.ts           # Service exports
│
├── hooks/                 # React Query hooks
│   ├── use-auth.ts        # Login/logout hooks
│   ├── use-user.ts        # User profile hooks
│   ├── use-toast.ts       # Toast notifications
│   └── use-mobile.tsx     # Mobile detection
│
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
│
├── components/            # React components
│   ├── ProtectedRoute.tsx # Route guard component
│   └── ui/                # UI components
│
├── lib/                   # Utilities
│   ├── api-client.ts      # Axios instance with interceptors
│   ├── validations.ts     # Zod schemas
│   └── utils.ts           # Helper functions
│
└── pages/                 # Page components
    ├── Login.tsx          # Login page (updated)
    ├── Dashboard.tsx      # Dashboard (protected)
    └── ...
```

## API Configuration

**Base URL**: `http://localhost:8000/api/`

### Endpoints Implemented

| Method | Endpoint | Description | Hook |
|--------|----------|-------------|------|
| POST | `/users/auth/login/` | User login | `useLogin()` |
| POST | `/users/auth/refresh/` | Refresh token | Auto (interceptor) |
| GET | `/users/profile/` | Get user profile | `useUserProfile()` |
| PATCH | `/users/profile/` | Update profile | `useUpdateProfile()` |
| POST | `/users/change_password/` | Change password | `useChangePassword()` |
| GET | `/users/{id}/permissions/` | Get permissions | `useUserPermissions(id)` |
| GET | `/users/` | List users | `useUsers()` |
| GET | `/users/{id}/` | Get user by ID | `useUser(id)` |

## Usage Examples

### Authentication

```typescript
// Login
import { useLogin } from '@/hooks/use-auth';

const login = useLogin();
login.mutate({ username: 'admin', password: 'password123' });

// Logout
import { useLogout } from '@/hooks/use-auth';

const logout = useLogout();
logout.mutate();

// Check auth status
import { useAuth } from '@/contexts/AuthContext';

const { user, isAuthenticated, isLoading } = useAuth();
```

### User Profile

```typescript
// Get profile
import { useUserProfile } from '@/hooks/use-user';

const { data: profile, isLoading } = useUserProfile();

// Update profile
import { useUpdateProfile } from '@/hooks/use-user';

const updateProfile = useUpdateProfile();
updateProfile.mutate({ 
  first_name: 'John', 
  last_name: 'Doe' 
});

// Change password
import { useChangePassword } from '@/hooks/use-user';

const changePassword = useChangePassword();
changePassword.mutate({ 
  old_password: 'old123', 
  new_password: 'new123' 
});
```

### Protected Routes

```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## Token Management

### Storage
Tokens are stored in `localStorage`:
- `accessToken` - JWT access token
- `refreshToken` - JWT refresh token

### Automatic Refresh
The axios interceptor automatically:
1. Adds Bearer token to all requests
2. Catches 401 errors
3. Refreshes the access token
4. Retries the failed request
5. Redirects to login if refresh fails

## Features

✅ **Separated Concerns**
- Types in `/types`
- Services in `/services`
- Hooks in `/hooks`

✅ **React Query Integration**
- Automatic caching
- Optimistic updates
- Error handling
- Loading states

✅ **Token Management**
- Automatic token injection
- Automatic token refresh
- Secure storage

✅ **Protected Routes**
- Route guards
- Loading states
- Return path preservation

✅ **User Experience**
- Toast notifications
- Loading indicators
- Error messages
- Auto-redirect on login/logout

## Environment Variables

Create `.env` file if you need to change the API URL:

```env
VITE_API_BASE_URL=http://localhost:8000/api/
```

Then update `api-client.ts`:
```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
```

## Troubleshooting

### Axios not found
```bash
npm install axios
```

### 401 Unauthorized
- Check if backend is running
- Verify credentials
- Check token in localStorage

### CORS errors
- Ensure backend allows `http://localhost:5173`
- Check backend CORS configuration

### Token not refreshing
- Check refresh token in localStorage
- Verify `/users/auth/refresh/` endpoint
- Check browser console for errors

## Next Steps

1. ✅ Install axios dependency
2. ✅ Test login flow with backend
3. Add logout button to UI
4. Implement user profile page
5. Add password change form
6. Create user management page (admin)
7. Add role-based access control
8. Implement remember me functionality
9. Add password reset flow
10. Add email verification

## Additional Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [Axios Docs](https://axios-http.com/)
- [Zod Docs](https://zod.dev/)
