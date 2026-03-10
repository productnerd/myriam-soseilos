
import { supabase } from "@/integrations/supabase/client";

export async function assignQuestRewards(
	userId: string,
	greyPoints: number,
	darkPoints: number,
	questTitle: string
): Promise<{ success: boolean; error?: string }> {
	try {
		// Update user's points
		const { data: currentProfile, error: fetchError } = await supabase
			.from("profiles")
			.select("grey_points, dark_points")
			.eq("id", userId)
			.single();

		if (fetchError) {
			console.error("Error fetching user profile:", fetchError);
			return { success: false, error: "Failed to fetch user profile" };
		}

		const newGreyPoints = (currentProfile?.grey_points || 0) + greyPoints;
		const newDarkPoints = (currentProfile?.dark_points || 0) + darkPoints;

		const { error: updateError } = await supabase
			.from("profiles")
			.update({
				grey_points: newGreyPoints,
				dark_points: newDarkPoints,
				updated_at: new Date().toISOString(),
			})
			.eq("id", userId);

		if (updateError) {
			console.error("Error updating user points:", updateError);
			return { success: false, error: "Failed to update user points" };
		}

		// Log the transaction
		const { error: transactionError } = await supabase
			.from("user_transactions")
			.insert({
				user_id: userId,
				grey_points: greyPoints > 0 ? greyPoints : undefined,
				dark_points: darkPoints > 0 ? darkPoints : undefined,
				details: `Quest completed: ${questTitle}`,
			});

		if (transactionError) {
			console.warn("Failed to log quest reward transaction:", transactionError);
		}

		return { success: true };
	} catch (error) {
		console.error("Error assigning quest rewards:", error);
		return { success: false, error: "Unexpected error occurred" };
	}
}
