// Context allows us to pass down props to child components
// ReactNode is the type for the children prop in React components
import { createContext, useContext, ReactNode } from "react";

// Custom hook for managing auth state and Supabase session
import { useAuthSession } from "@/hooks/auth/useAuthSession";

// Types for the auth state
import { AuthState } from "@/types/auth";

// Create a React Context for authentication. This will hold and make the auth state available throughout the app.
const AuthContext = createContext<AuthState | undefined>(undefined); // The initial value is undefined

// Define the props type for the AuthProvider component
// It accepts 'children' which can be any valid React node (components, elements, etc.)
interface AuthProviderProps {
	children: ReactNode;
}

// Component that manages authentication state (via Supabase - `useAuthSession`) for the entire application
export function AuthProvider({ children }: AuthProviderProps) {
	// Get the current authentication state using our custom hook
	// This includes:
	// - isLoggedIn: boolean (whether user is authenticated)
	// - user: AuthUser | null (user data if logged in)
	// - loading: boolean (whether auth state is being checked)
	const authState = useAuthSession();

	// Provide the auth state to all child components
	// Any component in the app can now access this using useAuthContext()
	return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
}

// Custom hook to access the auth state from any component
// This is a convenience wrapper around useContext with type checking
export function useAuthContext() {
	// Get the auth context value
	const context = useContext(AuthContext);

	// If this hook is used outside of AuthProvider, throw an error
	// This helps catch implementation errors early
	if (!context) {
		throw new Error("'useAuthContext' must be used within an AuthProvider");
	}

	return context;
}
