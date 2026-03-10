import { supabase } from "@/integrations/supabase/client";
import { incrementUserStreak } from "./streakIncrement";

/**
 * Update the user's daily activity count
 * This should ONLY be called for main learning flow activities, NOT review activities
 */
export async function incrementDailyActivityCount(userId: string): Promise<void> {
	try {
		const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

		// First, check if user already has a record for today
		const { data: existingRecord, error: fetchError } = await supabase
			.from("user_daily_activities")
			.select("*")
			.eq("user_id", userId)
			.eq("activity_date", today)
			.maybeSingle();

		if (fetchError) {
			console.error("Error checking existing daily activity:", fetchError);
			return;
		}

		let newCount = 1;
		if (existingRecord) {
			newCount = existingRecord.activity_count + 1;
		}

		// Check if this activity will complete the streak goal for the first time today
		const willCompleteStreakForFirstTime =
			newCount === 20 && (!existingRecord || existingRecord.activity_count < 20);

		if (existingRecord) {
			// Update existing record
			const { error: updateError } = await supabase
				.from("user_daily_activities")
				.update({
					activity_count: newCount,
					updated_at: new Date().toISOString(),
				})
				.eq("id", existingRecord.id);

			if (updateError) {
				console.error("Error updating daily activity count:", updateError);
				return;
			}

			console.log(`Updated daily activity count to ${newCount} (main learning flow only)`);
		} else {
			// Create new record for today
			const { error: insertError } = await supabase.from("user_daily_activities").insert({
				user_id: userId,
				activity_date: today,
				activity_count: 1,
			});

			if (insertError) {
				console.error("Error creating daily activity record:", insertError);
				return;
			}

			console.log("Created new daily activity record with count 1 (main learning flow only)");
		}

		// Only increment streak when user reaches exactly 20 activities for the first time today
		if (willCompleteStreakForFirstTime) {
			console.info("User reached 20 activities for first time today, incrementing streak");
			await incrementUserStreak(userId, "daily_activity_goal");
		} else if (newCount > 20) {
			console.log(
				`User has ${newCount} activities today, but streak already incremented at 20`
			);
		}
	} catch (error) {
		console.error("Error incrementing daily activity count:", error);
	}
}
