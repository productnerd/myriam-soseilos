import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if a transaction already exists to prevent duplicates
 */
export async function checkExistingTransaction(
	userId: string,
	source: string,
	id: string
): Promise<boolean> {
	try {
		console.debug(
			`Checking for existing transaction: user=${userId}, source=${source}, id=${id}`
		);

		// Use JSON string comparison to match the exact structure
		const { data: existingTransaction, error } = await supabase
			.from("user_transactions")
			.select("id")
			.eq("user_id", userId)
			.eq("details", JSON.stringify({ source, id }))
			.maybeSingle();

		if (error) {
			console.error("Error checking existing transaction:", error);
			return false;
		}

		console.debug(
			`Existing transaction check result:`,
			existingTransaction ? "Found" : "Not found"
		);
		return !!existingTransaction;
	} catch (error) {
		console.error("Exception checking transaction:", error);
		return false;
	}
}

/**
 * Logs a points transaction
 */
export async function logPointsTransaction(
	userId: string,
	greyPoints: number | null,
	darkPoints: number | null,
	details: object
): Promise<boolean> {
	try {
		console.debug(
			`Logging transaction: user=${userId}, grey=${greyPoints}, dark=${darkPoints}, details=`,
			details
		);

		const { data, error } = await supabase
			.from("user_transactions")
			.insert({
				user_id: userId,
				grey_points: greyPoints,
				dark_points: darkPoints,
				details: JSON.stringify(details), // Convert object to string here
			})
			.select();

		if (error) {
			console.error("Failed to log points transaction:", error);
			return false;
		}

		console.debug("Transaction logged successfully:", data);
		return true;
	} catch (error) {
		console.error("Error logging transaction:", error);
		return false;
	}
}

/**
 * Updates the user's points in the profiles table
 */
export async function updateUserPoints(
	userId: string,
	greyPoints: number | null,
	darkPoints: number | null
): Promise<boolean> {
	try {
		// Get current points balance
		const { data: profile, error: fetchError } = await supabase
			.from("profiles")
			.select("grey_points, dark_points")
			.eq("id", userId)
			.single();

		if (fetchError) {
			console.error("Error fetching current points:", fetchError);
			return false;
		}

		const currentGreyPoints = profile.grey_points || 0;
		const currentDarkPoints = profile.dark_points || 0;

		// Calculate new points totals
		const updates: Record<string, number> = {};

		if (greyPoints !== null) {
			const newGreyPoints = currentGreyPoints + greyPoints;
			updates.grey_points = newGreyPoints;
			console.debug(`Updating grey points: ${currentGreyPoints} -> ${newGreyPoints}`);
		}

		if (darkPoints !== null) {
			const newDarkPoints = currentDarkPoints + darkPoints;
			updates.dark_points = newDarkPoints;
			console.debug(`Updating dark points: ${currentDarkPoints} -> ${newDarkPoints}`);
		}

		// Update the user's points
		const { data, error: updateError } = await supabase
			.from("profiles")
			.update(updates)
			.eq("id", userId)
			.select();

		if (updateError) {
			console.error("Error updating points:", updateError);
			return false;
		}

		console.debug("Updated user points successfully:", data);
		return true;
	} catch (error) {
		console.error("Error updating user points:", error);
		return false;
	}
}
