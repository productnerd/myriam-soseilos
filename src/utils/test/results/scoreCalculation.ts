import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Calculate score percentage based on raw score and total questions
 * ALWAYS returns a value from 0-100 representing percentage
 */
export function calculateScorePercentage(
	score: number,
	totalQuestions: number,
	skipped: boolean
): number {
	if (skipped) {
		return 0; // Return 0 for skipped tests instead of null
	}

	if (totalQuestions === 0) {
		return 0;
	}

	// Calculate percentage properly - multiply by 100 for percentage value
	const percentage = Math.round((score / totalQuestions) * 100);

	// Make absolutely sure we're within 0-100 range
	return Math.max(0, Math.min(100, percentage));
}

/**
 * Determine if the test was passed
 */
export function determinePassed(
	passed: boolean | null,
	skipped: boolean,
	scorePercentage: number
): boolean {
	if (passed !== null) {
		return passed;
	}

	if (skipped) {
		return false; // Failed if skipped
	}

	// Pass threshold is 70%
	return scorePercentage >= 70;
}

/**
 * Increments a user's streak in the database
 * Acts as a wrapper around the actual database operation
 */
export async function incrementUserStreak(userId: string): Promise<boolean> {
	try {
		// First get the current streak
		const { data: profileData, error: profileError } = await supabase
			.from("profiles")
			.select("streak")
			.eq("id", userId)
			.single();

		if (profileError) {
			console.error("Error getting current streak:", profileError);
			return false;
		}

		// Calculate new streak value
		const currentStreak = profileData?.streak || 0;
		const newStreak = currentStreak + 1;

		console.log(`Incrementing streak from ${currentStreak} to ${newStreak}`);

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
			return false;
		}

		// Also record a transaction for this streak increase
		await supabase.from("user_transactions").insert({
			user_id: userId,
			details: "Streak increased: daily activity goal reached",
		});

		return true;
	} catch (error) {
		console.error("Error incrementing user streak:", error);
		return false;
	}
}
