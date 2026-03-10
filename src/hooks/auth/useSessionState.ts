import { useState, useCallback } from "react";
import { Session } from "@supabase/supabase-js";
import { AuthState } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for managing auth session state
 */
export function useSessionState() {
	const [authState, setAuthState] = useState<AuthState>({
		isLoggedIn: false,
		user: null,
		loading: true,
	});

	// Handle session update
	const updateAuthState = useCallback(async (session: Session | null) => {
		console.debug(
			"Updating auth state with session:",
			session ? "Session exists" : "No session"
		);

		if (!session) {
			console.debug("No session found, checking localStorage...");
			const hasLocalSession = localStorage.getItem("sb-session") !== null;
			console.debug("LocalStorage session:", hasLocalSession ? "Found" : "Not found");

			setAuthState({
				isLoggedIn: false,
				user: null,
				loading: false,
			});
			return;
		}

		try {
			console.debug("Session found, fetching user data for ID:", session.user.id);

			// Get profile data
			const { data: profile, error: profileError } = await supabase
				.from("profiles")
				.select("name, poll_sharing, score_sharing, tags")
				.eq("id", session.user.id)
				.maybeSingle();

			if (profileError) {
				console.error("Error fetching profile:", profileError);
				throw profileError;
			}

			console.debug("Profile data:", profile || "No profile found");

			// Check admin role
			const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin", {
				user_id: session.user.id,
			});

			if (adminError) {
				console.error("Error checking admin status:", adminError);
				throw adminError;
			}

			console.debug("Admin check result:", isAdmin);

			const updatedState = {
				isLoggedIn: true,
				user: {
					id: session.user.id,
					email: session.user.email,
					isAdmin: !!isAdmin,
					name: profile?.name || null,
					poll_sharing: profile?.poll_sharing,
					score_sharing: profile?.score_sharing,
					tags: profile?.tags || null,
				},
				loading: false,
			};

			console.debug("Setting new auth state:", updatedState);
			setAuthState(updatedState);
		} catch (error) {
			console.error("Critical error in auth state update:", error);
			// On error, set to not logged in state
			setAuthState({
				isLoggedIn: false,
				user: null,
				loading: false,
			});
		}
	}, []);

	return {
		authState,
		setAuthState,
		updateAuthState,
	};
}
