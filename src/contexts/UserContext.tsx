import React, { createContext, useContext } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { AuthUser } from "@/types/auth";

/**
 * Context for managing authenticated user state across the entire application.
 *
 * This context replaces the previous pattern of passing user data through React Router's Outlet context, which had timing issues.
 * 
  * Benefits of using global context:
 * - No redundant 'useAuth' calls (already called in UserProvider)
 * - Consistent user state across the entire app
 * - Better performance and cleaner architecture
 * - No timing issues with outlet context
 *
 * Authentication Flow:
 
 * 1. UserProvider calls 'useAuth' once and provides user data globally via context
 * 2. ProtectedRoute uses 'useUserContext' to check authentication status - it handles loading states and only renders components when user is available
 * 3. AuthenticatedLayout renders the layout without needing user data
 * 4. Page components use 'useUserContext' to safely access user data without null checks
 */
interface UserContextType {
	user: AuthUser | null;
	loading: boolean;
}

// Create context
const UserContext = createContext<UserContextType | null>(null);

/**
 * User Provider component that wraps the app and provides user authentication state to all components without prop drilling or outlet context
 *
 * This eliminates the need for redundant 'useAuth' calls in route wrappers
 */
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	// Use the auth hook once at app level (single source of truth) to get the user and loading state
	const { user, loading } = useAuth();

	return <UserContext.Provider value={{ user, loading }}>{children}</UserContext.Provider>;
};

/**
 * Hook for accessing user data from global context
 *
 * This hook provides user data globally.
 * ProtectedRoute handles loading states and only renders components when user is available, so components can safely access user data without null checks.
 *
 * Usage:
 * const { user, loading } = useUserContext();
 *
 * Benefits:
 * - Eliminates timing issues with outlet context
 * - Consistent user data access across the entire app
 * - Better performance (no redundant auth calls)
 * - ProtectedRoute handles loading, components only render when user is available
 *
 * @returns The user context value (user is guaranteed to be available when components render)
 * @throws Error if used outside of `UserProvider`
 */
export const useUserContext = (): UserContextType => {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error("'useUserContext' must be used within a UserProvider");
	}

	return context;
};

// /**
//  * Convenience hook for getting just the user ID
//  *
//  * This is useful for hooks that only need the user ID and want to avoid destructuring the full user object
//  *
//  * Usage:
//  * const userId = useUserId(); // Returns string | null
//  */
// export const useUserId = (): string | null => {
// 	const { user } = useUser();
// 	return user?.id || null;
// };
