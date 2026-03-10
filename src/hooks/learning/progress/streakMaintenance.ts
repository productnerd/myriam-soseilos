import { supabase } from "@/integrations/supabase/client";

/**
 * Check user's daily activity count and don't reset streak if they've met the goal OR have streak protection
 * This function is meant to be called via a scheduled job at midnight in the user's timezone
 */
export async function checkAndMaintainStreak(userId: string): Promise<void> {
	try {
		// Get yesterday's date in YYYY-MM-DD format
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		const yesterdayFormatted = yesterday.toISOString().split("T")[0];

		// Check if yesterday was Sunday (0 is Sunday in JavaScript's getDay())
		const isSunday = yesterday.getDay() === 0;

		// If it was Sunday, don't reset the streak regardless of activity
		if (isSunday) {
			console.info("Yesterday was Sunday, maintaining streak for user:", userId);
			// Record this as a "Sunday protection" for tracking
			await supabase.from("user_transactions").insert({
				user_id: userId,
				details: "Streak maintained: Sunday protection",
			});
			return;
		}

		// Check if user completed at least 20 activities yesterday OR completed review session
		const { data: yesterdayActivity, error: activityError } = await supabase
			.from("user_daily_activities")
			.select("activity_count")
			.eq("user_id", userId)
			.eq("activity_date", yesterdayFormatted)
			.maybeSingle();

		if (activityError) {
			console.error("Error checking yesterday's activity:", activityError);
			return;
		}

		// Check if user has streak protection enabled
		const { data: profileData, error: profileError } = await supabase
			.from("profiles")
			.select("streak_protection")
			.eq("id", userId)
			.single();

		if (profileError) {
			console.error("Error checking streak protection:", profileError);
			return;
		}

		const metDailyGoal = yesterdayActivity && yesterdayActivity.activity_count >= 20;
		const hasStreakProtection = profileData?.streak_protection || false;

		// User maintains streak if they either completed 20 activities OR have streak protection
		if (!metDailyGoal && !hasStreakProtection) {
			// User didn't meet either goal, reset streak to 0
			const { error: resetError } = await supabase
				.from("profiles")
				.update({
					streak: 0,
					updated_at: new Date().toISOString(),
				})
				.eq("id", userId);

			if (resetError) {
				console.error("Error resetting streak:", resetError);
				return;
			}

			console.info("Streak reset for user (no daily goal or streak protection):", userId);

			// Record the streak reset
			await supabase.from("user_transactions").insert({
				user_id: userId,
				details: "Streak reset: daily activity goal not met and no streak protection",
			});
		} else {
			if (metDailyGoal) {
				console.info("User met daily goal, streak maintained for user:", userId);
			} else if (hasStreakProtection) {
				console.info("User has streak protection, streak maintained for user:", userId);

				// Record that streak was protected
				await supabase.from("user_transactions").insert({
					user_id: userId,
					details: "Streak maintained: protected by review completion",
				});
			}
		}

		// Always reset streak protection for the next day regardless of outcome
		await supabase
			.from("profiles")
			.update({
				streak_protection: false,
				updated_at: new Date().toISOString(),
			})
			.eq("id", userId);

		console.info("Streak protection reset for next day for user:", userId);
	} catch (error) {
		console.error("Error in checkAndMaintainStreak:", error);
	}
}
