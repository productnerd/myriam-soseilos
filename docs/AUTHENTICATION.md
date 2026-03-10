# Authentication Pattern Documentation

## Overview

This document explains the new global context authentication pattern implemented in the application that eliminates timing issues and provides a single source of truth for user authentication state.

## Problem Solved

**Before**: 80+ components and hooks were calling `useAuth` individually, creating:

-   Unnecessary re-renders when auth state changed
-   Inconsistent user data access patterns
-   Complex dependency webs
-   Hard-to-test components
-   Performance issues

**After**: Global context with ProtectedRoute handling loading states

## New Authentication Flow

### 1. Global Context Setup (`App.tsx`)

```typescript
// App.tsx - Single source of truth for user data
function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<AuthProvider>
					{/* NEW: Global user context */}
					<UserProvider>
						<CourseProvider>
							<AppContent />
							<Toaster />
						</CourseProvider>
					</UserProvider>
				</AuthProvider>
			</BrowserRouter>
		</QueryClientProvider>
	);
}
```

### 2. User Context Provider (`UserContext.tsx`)

```typescript
/**
 * UserProvider: Single source of truth for user authentication state
 *
 * Responsibilities:
 * - Calls 'useAuth' once at app level
 * - Provides user data globally via React Context
 * - Eliminates need for multiple 'useAuth' calls throughout the app
 */
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user, loading } = useAuth(); // Single auth call for entire app
	return <UserContext.Provider value={{ user, loading }}>{children}</UserContext.Provider>;
};

/**
 * useUserContext: Hook to access user data from global context
 *
 * Usage:
 * const { user, loading } = useUserContext();
 */
export const useUserContext = (): UserContextType => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("'useUserContext' must be used within a UserProvider");
	}
	return context;
};
```

### 3. Route Protection (`ProtectedRoute.tsx`)

```typescript
/**
 * ProtectedRoute: Authentication gatekeeper for protected routes
 *
 * Responsibilities:
 * - Gets user data from global context (no useAuth() call)
 * - Shows loading state while authentication is being checked
 * - Redirects unauthenticated users to login page
 * - Only renders children when user is authenticated and loading is finished
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user, loading } = useUserContext(); // From global context

	if (loading) {
		return <LoadingState message="Checking authentication..." />;
	}

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	// User is authenticated and loading is finished, render the protected content
	// At this point, user is guaranteed to be non-null
	return <>{children}</>;
};
```

### 4. Layout Component (`AuthenticatedLayout.tsx`)

```typescript
/**
 * AuthenticatedLayout: Main layout component for authenticated users
 *
 * Responsibilities:
 * - Provides consistent UI layout (Header, main content area, TabBar)
 * - Uses <Outlet /> to render the current route's content
 * - No longer needs to pass user data via context (global context handles this)
 * - Child components can access user data directly via useUserContext()
 */
const AuthenticatedLayout: React.FC = () => {
	return (
		<div className="min-h-screen flex flex-col w-full">
			<Header />
			<main className="flex-1 mt-[56px] pb-20 overflow-y-auto relative w-full">
				<Outlet /> {/* No context needed - global context provides user data */}
			</main>
			<TabBar />
		</div>
	);
};
```

### 5. Accessing User Data in Components

```typescript
/**
 * Component: Access user data from global context
 *
 * Benefits:
 * - No timing issues (global context is always available)
 * - No null checks needed (ProtectedRoute guarantees user is available)
 * - Consistent access pattern across all components
 */
const MyComponent: React.FC = () => {
	const { user } = useUserContext(); // Global context access

	// user is guaranteed to be available - ProtectedRoute handles loading
	const { data } = useMyHook(user!.id); // Safe to use user!.id

	return <div>Welcome, {user!.email}</div>;
};
```

## Route Structure (`AppRoutes.tsx`)

```typescript
/**
 * AppRoutes: Main routing configuration
 *
 * Structure:
 * - Public routes: No authentication required
 * - Protected routes: Require authentication via ProtectedRoute
 * - Access-controlled routes: Require authentication + access code
 * - Admin routes: Require authentication + admin privileges
 */
const AppRoutes: React.FC = () => {
	return (
		<Routes>
			{/* Public Routes - No authentication required */}
			{PublicRoutes}

			{/* Access-controlled routes - Require authentication + access code */}
			<Route
				path="/onboarding"
				element={
					<ProtectedRoute>
						<AccessCodeProtectedRoute>
							<OnboardingPage />
						</AccessCodeProtectedRoute>
					</ProtectedRoute>
				}
			/>

			{/* Admin routes - Require authentication + admin privileges */}
			<Route
				path="/admin"
				element={
					<ProtectedRoute>
						<AdminRoute>
							<AdminPage />
						</AdminRoute>
					</ProtectedRoute>
				}
			/>

			{/* Main authenticated routes - Use original MainLayoutRoutes */}
			<Route
				element={
					<ProtectedRoute>
						<AuthenticatedLayout />
					</ProtectedRoute>
				}
			>
				{MainLayoutRoutes}
			</Route>
		</Routes>
	);
};
```

## Hook Refactoring Pattern

### Before (Old Pattern - Deprecated)

```typescript
// Hook calls useAuth() internally - DEPRECATED
export function useStreak(user?.id || null) {
	const { user, loading } = useAuth(); // ❌ Creates auth subscription
	const userId = user?.id || null;

	return useQuery({
		queryKey: ["streakData", userId],
		queryFn: () => fetchUserStreakData(userId),
		enabled: !!userId && !loading, // ❌ Complex dependency management
	});
}

// Component calls useAuth() and the hook - DEPRECATED
const MyComponent = () => {
	const { user } = useAuth(); // ❌ Another auth subscription
	const { data } = useStreak(user?.id || null); // ❌ Hook also subscribes to auth
};
```

### After (New Pattern)

```typescript
// Hook accepts userId as parameter
export function useStreak(userId: string) {
	return useQuery({
		queryKey: ["streakData", userId],
		queryFn: () => fetchUserStreakData(userId),
		enabled: !!userId, // ✅ Simple dependency
	});
}

// Component gets user from global context
const MyComponent = () => {
	const { user } = useUserContext(); // ✅ Global context access
	const { data } = useStreak(user!.id); // ✅ Pass userId to hook
};
```

## Benefits of New Pattern

1. **Eliminates Timing Issues**: Global context is always available, no more first-render problems
2. **Single Source of Truth**: One `useAuth()` call for the entire application
3. **Better Performance**: No redundant authentication calls or unnecessary re-renders
4. **Cleaner Architecture**: Clear separation of concerns with ProtectedRoute handling loading
5. **Consistent Access**: All components use the same pattern to access user data
6. **No Null Checks**: ProtectedRoute guarantees user is available when components render
7. **Easier Testing**: Hooks can be tested with mock userId values

## Migration Guide

### Step 1: Update Components

```typescript
// Before (deprecated)
import { useUserFromRoute } from "@/hooks/auth/useUserFromRoute";
const user = useUserFromRoute();
if (!user) return null; // This could fail on first render

// After (new pattern)
import { useUserContext } from "@/contexts/UserContext";
const { user } = useUserContext();
// user is guaranteed to be available - ProtectedRoute handles loading
```

### Step 2: Refactor Hooks

```typescript
// Before (deprecated)
export function useMyHook() {
	const { user } = useAuth();
	// ... hook logic
}

// After (new pattern)
export function useMyHook(userId: string) {
	// ... hook logic (no useAuth call)
}
```

### Step 3: Update Hook Calls

```typescript
// Before (deprecated)
const { data } = useMyHook(); // Hook gets user internally

// After (new pattern)
const { user } = useUserContext();
const { data } = useMyHook(user!.id); // Pass userId explicitly
```

## Important Notes

-   **ProtectedRoute handles loading**: Components only render when user is authenticated and available
-   **No null checks needed**: Use `user!.id` since ProtectedRoute guarantees user is available
-   **Global context access**: All components use `useUserContext()` instead of `useAuth()`
-   **Deprecated patterns**: `useUserFromRoute()` and calling `useAuth()` in components are deprecated
-   **Public routes**: Continue using `useAuth()` directly for public routes (not wrapped in ProtectedRoute)

## File Structure

```
src/
├── contexts/
│   └── UserContext.tsx              # Global user context provider
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx       # Authentication gatekeeper
│   └── layout/
│       └── AuthenticatedLayout.tsx  # Layout (no user context passing)
├── hooks/
│   └── auth/
│       └── useUserFromRoute.ts      # DEPRECATED - use useUserContext instead
└── components/routing/
    └── AppRoutes.tsx                # Route configuration
```

## Flow Summary

```
App.tsx
├── UserProvider (calls useAuth once)
│   └── ProtectedRoute (shows loading/redirects)
│       └── AuthenticatedLayout (provides layout)
│           └── Components (use useUserContext)
```

**Key Points:**

1. **UserProvider** calls `useAuth()` once and provides user data globally
2. **ProtectedRoute** handles loading states and only renders when user is available
3. **Components** use `useUserContext()` to access user data without null checks
4. **Hooks** accept `userId` as parameter instead of calling `useAuth()` internally
