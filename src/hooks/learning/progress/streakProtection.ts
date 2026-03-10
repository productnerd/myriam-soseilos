import { supabase } from "@/integrations/supabase/client";

/**
 * Enable streak protection for the user when they complete a review
 * This protects their streak from being reset at midnight
 */
export async function enableStreakProtection(userId: string): Promise<void> {
	try {
		const today = new Date().toISOString().split("T")[0];

		// Check if streak protection is already enabled today
		const { data: transactions, error: transactionError } = await supabase
			.from("user_transactions")
			.select("id")
			.eq("user_id", userId)
			.eq("details", "Streak protection enabled: review session completed")
			.gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
			.lt("created_at", new Date(new Date().setHours(23, 59, 59, 999)).toISOString())
			.limit(1);

		if (transactionError) {
			console.error(
				"Error checking for existing streak protection transaction:",
				transactionError
			);
			return;
		}

		if (transactions && transactions.length > 0) {
			console.info("Streak protection already enabled today");
			return;
		}

		console.info("Enabling streak protection for review completion");

		// Enable streak protection
		const { error: updateError } = await supabase
			.from("profiles")
			.update({
				streak_protection: true,
				updated_at: new Date().toISOString(),
			})
			.eq("id", userId);

		if (updateError) {
			console.error("Error enabling streak protection:", updateError);
			return;
		}

		// Record transaction
		const { error: transactionInsertError } = await supabase.from("user_transactions").insert({
			user_id: userId,
			details: "Streak protection enabled: review session completed",
		});

		if (transactionInsertError) {
			console.error("Error recording streak protection transaction:", transactionInsertError);
		} else {
			console.log("Streak protection enabled and transaction recorded");
		}
	} catch (error) {
		console.error("Error enabling streak protection:", error);
	}
}

/**
 * Check if user has streak protection enabled
 */
export async function hasStreakProtection(userId: string | null): Promise<boolean> {
	if (!userId) return false;

	try {
		const { data: profileData, error: profileError } = await supabase
			.from("profiles")
			.select("streak_protection")
			.eq("id", userId)
			.single();

		if (profileError) {
			console.error("Error checking streak protection:", profileError);
			return false;
		}

		return profileData?.streak_protection || false;
	} catch (error) {
		console.error("Error checking streak protection:", error);
		return false;
	}
}
