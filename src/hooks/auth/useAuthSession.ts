import { useSessionState } from "./useSessionState";
import { useAuthStateSubscription } from "./useAuthStateSubscription";
import { useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for managing auth session and state
 */
export function useAuthSession() {
	const { authState, updateAuthState, setAuthState } = useSessionState();
	const { loading } = authState;

	// Create a properly typed function to update loading state
	const setLoading = useCallback(
		(isLoading: boolean) => {
			setAuthState((prevState) => ({
				...prevState,
				loading: isLoading,
			}));
		},
		[setAuthState]
	);

	const { isMounted, authCheckedRef, checkInitialAuthState, setupLoadingTimeout } =
		useSessionInitializer(loading, updateAuthState, setLoading);

	// Subscribe to auth state changes
	useAuthStateSubscription(isMounted, authCheckedRef, updateAuthState, setLoading);

	return authState;
}

/**
 * Hook for initializing auth session and handling timeouts
 */
function useSessionInitializer(
	loading: boolean,
	updateAuthState: (session: any) => Promise<void>,
	setLoading: (loading: boolean) => void
) {
	const isMounted = useRef(true);
	const timeoutRef = useRef<number | null>(null);
	const authCheckedRef = useRef(false);
	const sessionCheckRetries = useRef(0);
	const MAX_RETRIES = 3;

	// Check initial auth state
	const checkInitialAuthState = useCallback(async () => {
		try {
			console.log("[Auth] Checking initial auth state...");
			const { data, error } = await supabase.auth.getSession();

			if (error) {
				// If we get an error and haven't exceeded retries, try again
				if (sessionCheckRetries.current < MAX_RETRIES) {
					sessionCheckRetries.current++;
					console.warn(
						`[Auth] Session check error, retrying (${sessionCheckRetries.current}/${MAX_RETRIES})`
					);
					setTimeout(checkInitialAuthState, 500);
					return;
				}

				console.error("[Auth] Error checking auth state after retries:", error);
				if (isMounted.current) {
					setLoading(false);
					authCheckedRef.current = true;
				}
				return;
			}

			console.log(
				"[Auth] Auth session data:",
				data?.session ? "Session exists" : "No session"
			);

			if (data?.session) {
				await updateAuthState(data.session);
			} else if (isMounted.current) {
				setLoading(false);
			}

			// Mark auth as checked even if getSession fails
			authCheckedRef.current = true;
		} catch (error) {
			console.error("[Auth] Error checking auth state:", error);
			if (isMounted.current) {
				setLoading(false);
				authCheckedRef.current = true;
			}
		}
	}, [setLoading, updateAuthState]);

	// Setup safety timeout for auth loading state
	const setupLoadingTimeout = useCallback(() => {
		// Safety timeout to ensure loading state doesn't get stuck - increased to 5 seconds
		timeoutRef.current = window.setTimeout(() => {
			if (isMounted.current && loading) {
				console.warn("[Auth] Auth loading state timeout reached - forcing completion");
				// Force a final session check
				supabase.auth
					.getSession()
					.then(({ data }) => {
						if (data.session && isMounted.current) {
							updateAuthState(data.session);
						} else if (isMounted.current) {
							setLoading(false);
						}
					})
					.catch(() => {
						if (isMounted.current) {
							setLoading(false);
						}
					});
			}
		}, 5000); // Increased from 3s to 5s

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [loading, setLoading, updateAuthState]);

	return {
		isMounted,
		timeoutRef,
		authCheckedRef,
		sessionCheckRetries,
		checkInitialAuthState,
		setupLoadingTimeout,
	};
}
