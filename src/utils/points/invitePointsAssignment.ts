import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Assigns points to both inviter and invitee when an invite is used
 * @param inviterId ID of the user who sent the invite
 * @param inviteeId ID of the user who accepted the invite
 * @returns Promise<boolean> indicating success
 */
export async function assignInvitePoints(inviterId: string, inviteeId: string): Promise<boolean> {
	if (!inviterId || !inviteeId) {
		console.error("Missing inviter or invitee ID");
		return false;
	}

	try {
		// Constant for invite bonus points
		const INVITE_BONUS_POINTS = 5;

		console.log(
			`Assigning ${INVITE_BONUS_POINTS} dark points to both inviter ${inviterId} and invitee ${inviteeId}`
		);

		// First check if this transaction already exists to prevent duplicates
		const { data: existingTransaction } = await supabase
			.from("user_transactions")
			.select("id")
			.eq("user_id", inviterId)
			.eq("details", JSON.stringify({ source: "invite_reward", invitee_id: inviteeId }))
			.maybeSingle();

		if (existingTransaction) {
			console.log(
				`Invite transaction between ${inviterId} and ${inviteeId} already exists, skipping`
			);
			return true; // Already recorded this transaction
		}

		// Update inviter's points
		const { data: inviterProfile, error: inviterFetchError } = await supabase
			.from("profiles")
			.select("dark_points")
			.eq("id", inviterId)
			.single();

		if (inviterFetchError) {
			console.error("Error fetching inviter profile:", inviterFetchError);
			return false;
		}

		const inviterCurrentDarkPoints = inviterProfile.dark_points || 0;
		const inviterNewDarkPoints = inviterCurrentDarkPoints + INVITE_BONUS_POINTS;

		const { error: inviterUpdateError } = await supabase
			.from("profiles")
			.update({ dark_points: inviterNewDarkPoints })
			.eq("id", inviterId);

		if (inviterUpdateError) {
			console.error("Error updating inviter points:", inviterUpdateError);
			return false;
		}

		// Update invitee's points
		const { data: inviteeProfile, error: inviteeFetchError } = await supabase
			.from("profiles")
			.select("dark_points")
			.eq("id", inviteeId)
			.single();

		if (inviteeFetchError) {
			console.error("Error fetching invitee profile:", inviteeFetchError);
			return false;
		}

		const inviteeCurrentDarkPoints = inviteeProfile.dark_points || 0;
		const inviteeNewDarkPoints = inviteeCurrentDarkPoints + INVITE_BONUS_POINTS;

		const { error: inviteeUpdateError } = await supabase
			.from("profiles")
			.update({ dark_points: inviteeNewDarkPoints })
			.eq("id", inviteeId);

		if (inviteeUpdateError) {
			console.error("Error updating invitee points:", inviteeUpdateError);
			return false;
		}

		// Log transactions for both users
		const { error: inviterTransactionError } = await supabase.from("user_transactions").insert({
			user_id: inviterId,
			dark_points: INVITE_BONUS_POINTS,
			details: JSON.stringify({ source: "invite_reward", invitee_id: inviteeId }),
		});

		if (inviterTransactionError) {
			console.error("Failed to log inviter transaction:", inviterTransactionError);
		}

		const { error: inviteeTransactionError } = await supabase.from("user_transactions").insert({
			user_id: inviteeId,
			dark_points: INVITE_BONUS_POINTS,
			details: JSON.stringify({ source: "invite_reward", inviter_id: inviterId }),
		});

		if (inviteeTransactionError) {
			console.error("Failed to log invitee transaction:", inviteeTransactionError);
		}

		console.log(`Successfully assigned invite bonus to both users`);
		return true;
	} catch (error) {
		console.error("Error assigning invite points:", error);
		return false;
	}
}
