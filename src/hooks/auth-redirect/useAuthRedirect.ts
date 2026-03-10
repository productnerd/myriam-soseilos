import { useAuthStateListener } from "./useAuthStateListener";
import { useSessionCheck } from "./useSessionCheck";
import { useUnauthenticatedRedirect } from "./useUnauthenticatedRedirect";

/**
 * Main hook for handling authentication-based redirects
 */
export function useAuthRedirect() {
	// Check for existing session
	useSessionCheck();

	// Listen for auth state changes and redirect accordingly
	useAuthStateListener();

	// Redirect unauthenticated users
	useUnauthenticatedRedirect();
}
