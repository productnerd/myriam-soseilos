import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches the user's current daily activity count
 */
export async function fetchDailyActivityCount(userId: string): Promise<number> {
	// Get today's date in YYYY-MM-DD format
	const today = new Date().toISOString().split("T")[0];

	try {
		// Use maybeSingle() instead of single() to handle cases where no data exists
		const { data, error } = await supabase
			.from("user_daily_activities")
			.select("activity_count")
			.eq("user_id", userId)
			.eq("activity_date", today)
			.maybeSingle();

		if (error) {
			console.error("Error fetching daily activity count:", error);
			return 0;
		}

		// Return 0 if no record exists for today
		return data?.activity_count || 0;
	} catch (error) {
		console.error("Unexpected error in fetchDailyActivityCount:", error);
		return 0;
	}
}

/**
 * Fetches the user's streak data including daily progress
 */
export async function fetchUserStreakData(userId: string): Promise<{
	currentStreak: number;
	dailyProgress: number;
	goalCompleted: boolean;
	progressPercentage: number;
}> {
	try {
		// Execute both queries in parallel for better performance
		const [profileResult, activityResult] = await Promise.all([
			// Get current streak from profiles
			supabase.from("profiles").select("streak").eq("id", userId).maybeSingle(),

			// Get today's activity count
			fetchDailyActivityCount(userId),
		]);

		if (profileResult.error) {
			console.error("Error fetching user streak:", profileResult.error);
			return {
				currentStreak: 0,
				dailyProgress: 0,
				goalCompleted: false,
				progressPercentage: 0,
			};
		}

		// Daily progress goal is 20 activities
		const dailyProgress = typeof activityResult === "number" ? activityResult : 0;
		const goalCompleted = dailyProgress >= 20;
		const currentStreak = profileResult.data?.streak || 0;

		// Calculate progress percentage (cap at 100%)
		const progressPercentage = Math.min(Math.round((dailyProgress / 20) * 100), 100);

		return {
			currentStreak,
			dailyProgress,
			goalCompleted,
			progressPercentage,
		};
	} catch (error) {
		console.error("Unexpected error in fetchUserStreakData:", error);
		return {
			currentStreak: 0,
			dailyProgress: 0,
			goalCompleted: false,
			progressPercentage: 0,
		};
	}
}
