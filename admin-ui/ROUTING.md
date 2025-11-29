# Routing Architecture

## Overview
Aplikasi ini menggunakan React Router v6 dengan pendekatan modular untuk routing dan authentication.

## Struktur File

```
admin-ui/src/
├── App.tsx                    # Entry point, menggunakan useAuth dan AppRoutes
├── routes/
│   ├── index.tsx              # Central route configuration
│   ├── ProtectedRoute.tsx     # HOC untuk protect authenticated routes
│   └── RoleGuard.tsx          # HOC untuk role-based access control
├── lib/
│   ├── hooks/
│   │   └── useAuth.ts         # Custom hook untuk authentication state
│   └── api/
│       └── auth.ts            # API helpers untuk authentication
└── auth/
    └── LoginPage.tsx          # Login page component
```

## Komponen Utama

### 1. useAuth Hook
Custom hook untuk manage authentication state:
- `user`: Current user object atau null
- `loading`: Loading state saat fetch user
- `login(email, password)`: Function untuk login
- `logout()`: Function untuk logout
- `refetch()`: Refresh user data

**Usage:**
```tsx
const { user, loading, login, logout } = useAuth();
```

### 2. ProtectedRoute
Component wrapper untuk protect routes yang memerlukan authentication.

**Features:**
- Menampilkan loading state
- Redirect ke /login jika tidak authenticated
- Menyimpan location yang ingin diakses untuk redirect setelah login

**Usage:**
```tsx
<ProtectedRoute user={user} loading={loading}>
  <YourComponent />
</ProtectedRoute>
```

### 3. RoleGuard
Component wrapper untuk role-based access control.

**Features:**
- Check apakah user memiliki role yang diizinkan
- Redirect ke halaman lain jika tidak memiliki akses

**Usage:**
```tsx
<RoleGuard user={user} allowedRoles={['ADMIN']}>
  <AdminDashboard />
</RoleGuard>
```

### 4. AppRoutes
Central route configuration dengan semua routes aplikasi.

**Route Structure:**
- `/login` - Login page (public)
- `/` - Root, redirect berdasarkan role
- `/admin/*` - Admin routes
- `/student/*` - Student routes
- `/lecturer/*` - Lecturer routes
- `/home`, `/browse`, `/help` - Public pages

## Authentication Flow

### Login Flow
1. User mengakses `/login`
2. Submit credentials via `useAuth().login()`
3. Backend validate dan create session
4. Frontend redirect ke dashboard sesuai role
5. Jika ada saved location (dari ProtectedRoute), redirect ke sana

### Logout Flow
1. User klik logout button
2. Call `useAuth().logout()`
3. POST ke `/api/auth/logout` untuk clear session
4. Clear local state
5. Redirect ke `/login` dengan full page reload

### Protected Route Flow
1. User tries to access protected route
2. `ProtectedRoute` checks if authenticated
3. If not authenticated:
   - Save current location in state
   - Redirect to `/login`
4. After login:
   - Redirect to saved location atau dashboard

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login dengan email & password
- `POST /api/auth/logout` - Logout dan clear session
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/register-student` - Register student
- `POST /api/auth/register-lecturer` - Register lecturer
- `POST /api/auth/register-admin` - Register admin

## Best Practices

1. **Selalu gunakan `useAuth` hook** untuk authentication operations
2. **Wrap protected routes** dengan `ProtectedRoute` dan `RoleGuard`
3. **Gunakan `credentials: 'include'`** di semua fetch untuk include cookies
4. **Handle loading states** untuk better UX
5. **Save navigation state** untuk better redirect experience

## Role-Based Routes

### Admin (`/admin/*`)
- Dashboard: Manage theses, users
- Account: Admin profile settings

### Student (`/student/*`)
- Dashboard: Submit thesis, view feedback
- Account: Student profile settings

### Lecturer (`/lecturer/*`)
- Dashboard: Supervise students, review theses
- Account: Lecturer profile settings

### Public
- Home: Landing page
- Browse: Public repository search
- Help: Documentation and help

## Error Handling

- **401 Unauthorized**: Redirect to login
- **403 Forbidden**: Redirect to user's own dashboard
- **Network errors**: Show error message, allow retry
- **Invalid credentials**: Show error on login form

## Future Improvements

1. Add role-based navigation menu
2. Implement remember me functionality
3. Add password reset flow
4. Add email verification
5. Implement OAuth2 login
6. Add session timeout handling
7. Implement route-level code splitting
