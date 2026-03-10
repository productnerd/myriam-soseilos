import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/types/supabase";

type DailyActivity = Database["public"]["Tables"]["user_daily_activities"]["Insert"];
type Transaction = Database["public"]["Tables"]["user_transactions"]["Insert"];

/**
 * Update the user's daily activity count
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

		// Check if this activity will complete the streak goal
		const willCompleteStreak =
			newCount >= 20 && (!existingRecord || existingRecord.activity_count < 20);

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

			console.log(`Updated daily activity count to ${newCount}`);
		} else {
			// Create new record for today
			const newActivity: DailyActivity = {
				user_id: userId,
				activity_date: today,
				activity_count: 1,
			};

			const { error: insertError } = await supabase
				.from("user_daily_activities")
				.insert(newActivity);

			if (insertError) {
				console.error("Error creating daily activity record:", insertError);
				return;
			}

			console.log("Created new daily activity record with count 1");
		}

		// If this activity completed the streak goal
		if (willCompleteStreak) {
			const startOfDay = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
			const endOfDay = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();

			// Check if streak already updated today
			const { data: transactions, error: transactionError } = await supabase
				.from("user_transactions")
				.select("id")
				.eq("user_id", userId)
				.eq("type", "streak_increase")
				.gte("created_at", startOfDay)
				.lte("created_at", endOfDay)
				.limit(1);
			if (transactionError) {
				console.error("Error checking for existing streak transaction:", transactionError);
			} else if (!transactions || transactions.length === 0) {
				// No streak transaction yet today, increment the streak
				console.info("Incrementing streak for user:", userId);

				try {
					// Directly update the user's streak in the profiles table
					const { data: profileData, error: profileError } = await supabase
						.from("profiles")
						.select("streak")
						.eq("id", userId)
						.single();

					if (profileError) {
						console.error("Error getting current streak:", profileError);
						return;
					}

					// Calculate new streak value
					const currentStreak = profileData?.streak || 0;
					const newStreak = currentStreak + 1;

					console.info(`Updating streak from ${currentStreak} to ${newStreak}`);

					// Update the streak
					const { error: updateError } = await supabase
						.from("profiles")
						.update({
							streak: newStreak,
							updated_at: new Date().toISOString(),
						})
						.eq("id", userId);

					if (updateError) {
						console.error("Error updating streak:", updateError);
						return;
					}

					// Record transaction
					const newTransaction = {
						user_id: userId,
						type: "streak_increase",
						amount: 1,
						metadata: { details: "Streak increased: daily activity goal reached" },
					};

					const { error: transactionInsertError } = await supabase
						.from("user_transactions")
						.insert(newTransaction);

					if (transactionInsertError) {
						console.error(
							"Error recording streak transaction:",
							transactionInsertError
						);
					} else {
						toast.success("Streak increased! 🔥", {
							description: `You've maintained your streak for ${newStreak} day${
								newStreak !== 1 ? "s" : ""
							}!`,
						});
						console.log("Streak updated and transaction recorded");
					}
				} catch (error) {
					console.error("Error incrementing streak:", error);
				}
			} else {
				console.info("Streak already updated today");
			}
		}
	} catch (error) {
		console.error("Error incrementing daily activity count:", error);
	}
}
