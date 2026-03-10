import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/user";
import { useNavigate } from "react-router-dom";

/**
 * Hook for fetching and managing user profile data
 *
 * @param userId - The ID of the authenticated user
 * @returns Profile data and management functions
 */
export function useProfileFetch(userId: string) {
	const navigate = useNavigate();
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);

	const updateProfile = (updates: Partial<UserProfile>) => {
		setProfile((prev) => (prev ? { ...prev, ...updates } : null));
	};

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				setIsLoading(true);
				setLoadError(null);

				// Update last_active when the profile is accessed
				const { error: updateError } = await supabase
					.from("profiles")
					.update({ last_active: new Date().toISOString() })
					.eq("id", userId);

				if (updateError) {
					console.error("Error updating last_active:", updateError);
				}

				const { data, error } = await supabase
					.from("profiles")
					.select(
						"id, email, name, dark_points, grey_points, streak, thumbnail, last_active, flag, country, favorite_emoji, access_code, invited_by, email_alerts, push_notifications, tags"
					)
					.eq("id", userId)
					.single();

				if (error) {
					console.error("Error fetching profile:", error);
					setLoadError(error.message);
					return;
				}

				console.log("Fetched profile data:", data);
				setProfile(data as UserProfile);
			} catch (error: any) {
				console.error("Error in profile page:", error);
				setLoadError(error?.message || "Failed to load profile");
			} finally {
				setIsLoading(false);
			}
		};

		fetchProfile();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (!session) {
				navigate("/auth");
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [navigate, userId]);

	return {
		profile,
		isLoading,
		loadError,
		updateProfile,
	};
}
