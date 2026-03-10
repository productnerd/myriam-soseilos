import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for checking and resetting user streaks on login
 *
 * This hook is called once when the user logs in to check if their streak should be reset based on their last activity date.
 *
 * @param userId - The ID of the user (can be null if user is not authenticated)
 */
export function useStreakReset(userId: string | null) {
	const checkAndResetStreak = useCallback(async () => {
		// Don't execute if no user is not authenticated
		if (!userId) {
			return;
		}

		try {
			console.log("[useStreakReset] 🔍 Checking daily activity for user:", userId);

			// Get yesterday's date in YYYY-MM-DD format
			const yesterday = new Date();
			yesterday.setDate(yesterday.getDate() - 1);
			const yesterdayDate = yesterday.toISOString().split("T")[0];

			// Check if user has activity for yesterday
			const { data: activityData, error: activityError } = await supabase
				.from("user_daily_activities")
				.select("activity_count")
				.eq("user_id", userId)
				.eq("activity_date", yesterdayDate)
				.maybeSingle();

			if (activityError) {
				console.error("[useStreakReset] Error checking daily activity:", activityError);
				return;
			}

			const yesterdayActivityCount = activityData?.activity_count || 0;

			// If user didn't complete 20 activities yesterday, reset streak
			if (yesterdayActivityCount < 20) {
				const { data: profileData, error: profileError } = await supabase
					.from("profiles")
					.select("streak")
					.eq("id", userId)
					.single();

				if (profileError) {
					console.error("[useStreakReset] Error getting profile data:", profileError);
					return;
				}

				// Only reset if user currently has a streak
				if (profileData?.streak && profileData.streak > 0) {
					await supabase.from("profiles").update({ streak: 0 }).eq("id", userId);

					// Log the streak reset
					await supabase.from("user_transactions").insert({
						user_id: userId,
						details: "Streak reset: no activity today",
					});
				}
			} else {
				console.log("[useStreakReset] ✅ Activity found today, streak maintained");
			}
		} catch (error) {
			console.error("[useStreakReset] Error in streak reset check:", error);
		}
	}, [userId]);

	useEffect(() => {
		checkAndResetStreak();
	}, [checkAndResetStreak]);
}
