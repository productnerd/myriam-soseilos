import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

/**
 * Hook for handling sign-out
 */
export function useSignOut() {
	const navigate = useNavigate();

	const handleSignOut = useCallback(async () => {
		try {
			// First clear any local storage session data
			localStorage.removeItem("supabase.auth.token");

			// Then attempt to sign out using the Supabase client
			const { error } = await supabase.auth.signOut();
			if (error) {
				console.error("Error signing out:", error);
				// Even if there's an error, continue with redirection
				// since the local session has been cleared
			}

			toast.success("Signed out successfully");
			navigate("/auth"); // Ensure consistent redirect to auth page
		} catch (error) {
			console.error("Error signing out:", error);
			// If we catch any error, we'll still navigate to auth page
			// since we've already cleared the local session
			toast.success("Signed out successfully");
			navigate("/auth");
		}
	}, [navigate]);

	return { handleSignOut };
}
