import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
	checkExistingTransaction,
	logPointsTransaction,
	updateUserPoints,
} from "./transactionUtils";

/**
 * Calculates the number of grey points to award for topic completion
 */
async function calculateTopicPoints(topicId: string): Promise<number> {
	console.log("[calculateTopicPoints] Calculating grey points for topic", topicId);

	try {
		// Get topic order number for calculating points
		const { data: topic, error: topicError } = await supabase
			.from("topics")
			.select("order_number")
			.eq("id", topicId)
			.single();

		if (topicError) {
			console.error("[calculateTopicPoints] Error fetching topic details:", topicError);
			return 0;
		}

		// Apply algorithm: 29 - order_number, with minimum of 12
		const orderNumber = topic.order_number || 1;
		const greyPoints = Math.max(29 - orderNumber, 12);

		console.debug(
			`[calculateTopicPoints] Calculated ${greyPoints} grey points for topic ${topicId} (order number: ${orderNumber})`
		);
		return greyPoints;
	} catch (error) {
		console.error("[calculateTopicPoints] Error calculating topic points:", error);
		return 0;
	}
}

/**
 * Assigns points to a user for completing a topic
 * @param userId User ID
 * @param topicId Topic ID that was completed
 * @returns Promise<boolean> indicating success
 */
export async function assignPointsToUser(
	userId: string | undefined,
	topicId: string | undefined
): Promise<boolean> {
	if (!userId || !topicId) {
		console.error("[assignPointsToUser] Missing user or topic");
		return false;
	}

	try {
		// First check if this transaction already exists to prevent duplicates
		console.debug("[assignPointsToUser] Checking for existing transaction");
		const transactionExists = await checkExistingTransaction(
			userId,
			"topic_completion",
			topicId
		);

		if (transactionExists) {
			console.debug(
				`[assignPointsToUser] Transaction for topic ${topicId} already exists, skipping`
			);
			return true; // Already recorded this transaction
		}

		// Calculate points to award
		const greyPoints = await calculateTopicPoints(topicId);

		console.log(
			`[assignPointsToUser] Assigning ${greyPoints} grey points to user ${userId} for topic ${topicId}`
		);

		// First, log the transaction - we're reversing the order as suggested
		console.debug("[assignPointsToUser] Creating transaction record first");
		const transactionLogged = await logPointsTransaction(userId, greyPoints, null, {
			source: "topic_completion",
			id: topicId,
		});

		if (!transactionLogged) {
			console.error("[assignPointsToUser] Failed to log transaction");
			return false;
		}

		// Then update the user's points
		console.debug("[assignPointsToUser] Updating user points");
		const updated = await updateUserPoints(userId, greyPoints, null);

		if (!updated) {
			console.error("[assignPointsToUser] Failed to update user points");
			return false;
		}

		console.log(
			`Successfully assigned ${greyPoints} points to user ${userId} for topic ${topicId}`
		);
		toast.success(`${greyPoints} points earned!`);
		return true;
	} catch (error) {
		console.error("Error assigning points:", error);
		return false;
	}
}
