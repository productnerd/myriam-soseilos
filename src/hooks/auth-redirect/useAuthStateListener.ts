import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to listen for authentication state changes and navigate accordingly
 */
export function useAuthStateListener() {
	const navigate = useNavigate();
	const location = useLocation();
	const isMounted = useRef(true);
	const pendingRedirectRef = useRef<number | null>(null);

	useEffect(() => {
		isMounted.current = true;

		// Skip listener for invite pages
		if (location.pathname.includes("/invite/")) {
			return;
		}

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			console.log("Auth state changed in redirect hook:", event);

			// Clear any pending redirect
			if (pendingRedirectRef.current) {
				clearTimeout(pendingRedirectRef.current);
				pendingRedirectRef.current = null;
			}

			// Only process if component is mounted
			if (!isMounted.current) return;

			// Debounce auth state changes
			pendingRedirectRef.current = window.setTimeout(async () => {
				pendingRedirectRef.current = null;
				if (!isMounted.current) return;

				if (event === "SIGNED_IN") {
					// For SIGNED_IN event, check onboarding completion status from profiles table
					const { user } = session || {};

					if (!user) return;

					try {
						// Check if the user has completed onboarding by querying the profiles table
						const { data: profile, error } = await supabase
							.from("profiles")
							.select("onboarding_completed, access_granted")
							.eq("id", user.id)
							.maybeSingle();

						if (error) {
							console.error("Error checking onboarding status:", error);
							// Default to learn page on error
							if (
								location.pathname === "/auth" ||
								location.pathname === "/register" ||
								location.pathname === "/"
							) {
								console.log(
									"Error checking onboarding status, defaulting to /learn"
								);
								navigate("/learn");
							}
							return;
						}

						// First check if access is granted
						if (!profile?.access_granted) {
							console.log(
								"User does not have access granted, redirecting to /access-code"
							);
							navigate("/access-code");
							return;
						}

						// If onboarding is explicitly set to false, redirect to onboarding
						// Otherwise (true or null/undefined), direct to learn page
						if (profile?.onboarding_completed === false) {
							console.log("User needs onboarding, redirecting to /onboarding");
							if (location.pathname !== "/onboarding") {
								navigate("/onboarding");
							}
						} else if (
							location.pathname === "/auth" ||
							location.pathname === "/register" ||
							location.pathname === "/" ||
							location.pathname === "/onboarding"
						) {
							console.log(
								"User already completed onboarding or status unknown, redirecting to /learn"
							);
							navigate("/learn");
						}
					} catch (error) {
						console.error("Error in auth state listener:", error);
						// Default to learn page on error
						if (
							location.pathname === "/auth" ||
							location.pathname === "/register" ||
							location.pathname === "/"
						) {
							navigate("/learn");
						}
					}
				} else if (event === "SIGNED_OUT") {
					console.log("User signed out, redirecting to auth");
					// Don't redirect if already on auth page
					if (location.pathname !== "/auth") {
						navigate("/auth");
					}
				}
			}, 50); // Small timeout to avoid race conditions
		});

		return () => {
			isMounted.current = false;
			if (pendingRedirectRef.current) {
				clearTimeout(pendingRedirectRef.current);
			}
			subscription.unsubscribe();
		};
	}, [navigate, location.pathname]);
}
