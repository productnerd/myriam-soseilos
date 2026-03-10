import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";

/**
 * Hook for checking if a user has an active session
 *
 * @returns Whether the session check has been completed
 */
export function useSessionCheck() {
	const location = useLocation();
	const sessionChecked = useRef(false);
	const { user } = useAuth();
	const userId = user?.id || null;

	// Skip session check for certain paths
	const skipSessionCheck =
		location.pathname.includes("/invite/") ||
		["/login", "/register", "/forgot-password"].includes(location.pathname) ||
		location.pathname.startsWith("/reset-password/");

	useEffect(() => {
		// Prevent duplicate session checks
		if (sessionChecked.current || skipSessionCheck) return;

		const checkSession = async () => {
			try {
				sessionChecked.current = true;

				if (!userId) {
					console.warn("No user ID found, skipping session check.");
					return null;
				}

				return userId;
			} catch (error) {
				console.error("Session check error:", error);
				return null;
			}
		};

		// Small delay to avoid a race condition with the auth state
		const sessionCheckTimeout = setTimeout(checkSession, 50);

		return () => {
			clearTimeout(sessionCheckTimeout);
		};
	}, [skipSessionCheck, userId]);

	return {
		sessionChecked: sessionChecked.current,
		skipSessionCheck,
	};
}
