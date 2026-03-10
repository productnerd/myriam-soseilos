import React from "react";
import { Navigate } from "react-router-dom";
import LoadingState from "@/components/loading/LoadingState";
import { useUserContext } from "@/contexts/UserContext";

/**
 * Authentication gatekeeper for protected routes
 *
 * This component ensures that only authenticated users can access protected content
 * It uses the global UserContext instead of calling 'useAuth' directly, eliminating redundant authentication calls
 *
 * Flow:
 * 1. Gets user and loading state from global UserContext
 * 2. Shows loading state while authentication is being checked
 * 3. Redirects unauthenticated users to login page
 * 4. Only renders children when user is authenticated and loading is finished
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user, loading } = useUserContext();

	// Show loading state while authentication is being checked
	if (loading) {
		return <LoadingState message="Checking authentication..." />;
	}

	// Redirect unauthenticated users to login page
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	// If user is authenticated and loading is finished, render the protected content
	// At this point, user is guaranteed to be non-null
	return <>{children}</>;
};

export default ProtectedRoute;
