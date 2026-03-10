import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for subscribing to auth state changes
 */
export function useAuthStateSubscription(
	isMounted: React.MutableRefObject<boolean>,
	authCheckedRef: React.MutableRefObject<boolean>,
	updateAuthState: (session: any) => Promise<void>,
	setLoading: (loading: boolean) => void
) {
	// Set up auth state change subscription
	useEffect(() => {
		if (!isMounted.current) return;

		console.debug("Setting up auth state subscription");

		// Initial session check
		supabase.auth.getSession().then(({ data: { session }, error }) => {
			console.debug("Initial session check:", {
				hasSession: !!session,
				error: error?.message || "none",
				status: error?.status || "200",
			});

			if (error) {
				console.error("Session check error:", error);
			}
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			console.debug(`Auth state changed: ${event}`, {
				hasSession: !!session,
				event,
				timestamp: new Date().toISOString(),
			});

			if (isMounted.current) {
				if (session) {
					console.debug("Session found in auth state change, updating state");
					await updateAuthState(session);
				} else {
					console.debug("No session in auth state change, setting loading false");
					setLoading(false);
				}

				// Always mark auth as checked when receiving an auth event
				console.debug("Marking auth as checked");
				authCheckedRef.current = true;
			}
		});

		// Cleanup subscription on unmount
		return () => {
			console.debug("Cleaning up auth state subscription");
			subscription.unsubscribe();
		};
	}, [isMounted, authCheckedRef, updateAuthState, setLoading]);
}
