import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import { supabase } from "@/integrations/supabase/client";
import LoadingState from "@/components/loading/LoadingState";
import { createUserProfile } from "@/hooks/auth/useProfileCreation";

interface AccessCodeProtectedRouteProps {
	children: React.ReactNode;
}

/**
 * AccessCodeProtectedRoute: Handles access code validation for authenticated users
 *
 * Responsibilities:
 * - Assumes user is already authenticated (`ProtectedRoute` handles auth check)
 * - Checks if user has 'access_granted' status in their profile
 * - Creates user profile if it doesn't exist
 * - Redirects to access code page if access is not granted
 */
const AccessCodeProtectedRoute: React.FC<AccessCodeProtectedRouteProps> = ({ children }) => {
	const { user } = useAuth(); // User is guaranteed to exist since `ProtectedRoute` handles auth
	const [accessGranted, setAccessGranted] = useState<boolean | null>(null);
	const [isChecking, setIsChecking] = useState<boolean>(true);

	useEffect(() => {
		const checkAccessGranted = async () => {
			// Note: During the initial render, user might still be null while authentication is being determined
			// The 'useEffect' runs before authentication is fully established so we need to do a safe null check
			if (!user?.id) return;

			try {
				console.log("Checking if user has access granted:", user.id);

				// Try to create the profile if it doesn't exist
				console.log("Ensuring user profile exists");
				await createUserProfile(user.id, user.email || "");

				// Now check access_granted status
				const { data, error } = await supabase
					.from("profiles")
					.select("access_granted")
					.eq("id", user.id)
					.maybeSingle();

				if (error) {
					console.error("Error checking access granted:", error);
					setAccessGranted(false);
					setIsChecking(false);
					return;
				}

				// Check if access is granted
				const hasAccess = Boolean(data?.access_granted);
				console.log("User has access granted:", hasAccess);
				setAccessGranted(hasAccess);
			} catch (error) {
				console.error("Error checking access granted:", error);
				setAccessGranted(false);
			} finally {
				setIsChecking(false);
			}
		};

		checkAccessGranted();
	}, [user?.id, user?.email]);

	if (isChecking) {
		return <LoadingState message="Checking access..." />;
	}

	if (!accessGranted) {
		console.log("User does not have access granted, redirecting to access code page");
		return <Navigate to="/access-code" replace />;
	}

	console.log("User has access granted, allowing access to protected route");
	return <>{children}</>;
};

export default AccessCodeProtectedRoute;
