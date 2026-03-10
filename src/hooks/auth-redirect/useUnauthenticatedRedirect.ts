import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";

/**
 * Hook to handle redirection for unauthenticated users
 */
export function useUnauthenticatedRedirect() {
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useAuth();
	const userId = user?.id || null;

	useEffect(() => {
		// Skip redirect for public routes
		if (
			location.pathname === "/" ||
			location.pathname === "/auth" ||
			location.pathname.startsWith("/auth/") ||
			location.pathname === "/register" ||
			location.pathname.startsWith("/forgot-password") ||
			location.pathname.startsWith("/reset-password/") ||
			location.pathname === "/invite" ||
			location.pathname.startsWith("/invite/")
		) {
			return;
		}

		const redirectIfUnauthenticated = async () => {
			try {
				if (!userId) {
					console.log("No active session found, redirecting to auth");
					navigate("/auth");
				}
			} catch (error) {
				console.error("Session check error:", error);
			}
		};

		redirectIfUnauthenticated();
	}, [navigate, location.pathname, userId]);
}
