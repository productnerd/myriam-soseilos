import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MAX_FLOW_POINTS, REPLENISH_AMOUNT } from "./useFlowPointsConfig";

export interface FlowPointsReplenishmentReturn {
	handleFlowPointReplenishment: () => Promise<number>;
}

/**
 * Hook for handling flow point replenishment
 * This is now only used for testing/debugging purposes
 * as the actual replenishment is handled by the backend cron job
 *
 * @param flowPoints - Current flow points balance
 * @param fetchFlowPoints - Function to refresh flow points
 * @param userId - The ID of the authenticated user
 * @returns Flow points replenishment functions
 */
export function useFlowPointsReplenishment(
	flowPoints: number | null,
	fetchFlowPoints: () => Promise<void>,
	userId: string
): FlowPointsReplenishmentReturn {
	const handleFlowPointReplenishment = useCallback(async () => {
		try {
			// First, check current flow points and last update timestamp
			const { data: currentData, error: currentError } = await supabase
				.from("profiles")
				.select("flow_balance, flow_last_updated_at")
				.eq("id", userId)
				.single();

			if (currentError) {
				console.error("Error fetching current flow points:", currentError);
				return 0;
			}

			const currentPoints = currentData?.flow_balance || 0;
			const lastUpdated = currentData?.flow_last_updated_at
				? new Date(currentData.flow_last_updated_at)
				: null;
			const now = new Date();

			// Only replenish if we're at an even hour (2, 4, 6, 8, etc.)
			const currentHour = now.getHours();
			if (currentHour % 2 !== 0) {
				console.log("Not an even hour, no replenishment needed");
				return currentPoints;
			}

			// Check if we've already updated within this 2-hour window
			if (lastUpdated) {
				const lastUpdatedHour = lastUpdated.getHours();
				if (lastUpdatedHour === currentHour) {
					console.log("Already replenished in this 2-hour window");
					return currentPoints;
				}
			}

			// Calculate how many points to add (max REPLENISH_AMOUNT points)
			const pointsToAdd = Math.min(MAX_FLOW_POINTS - currentPoints, REPLENISH_AMOUNT);

			// Only proceed if we need to add points
			if (pointsToAdd <= 0) {
				console.log("Max flow points already reached, no replenishment needed");
				return currentPoints;
			}

			console.log(
				`Adding ${pointsToAdd} flow points (current: ${currentPoints}, max: ${MAX_FLOW_POINTS})`
			);

			// Update points and last_updated timestamp
			const { data: updateData, error: updateError } = await supabase
				.from("profiles")
				.update({
					flow_balance: currentPoints + pointsToAdd,
					flow_last_updated_at: now.toISOString(),
				})
				.eq("id", userId)
				.select("flow_balance");

			if (updateError) {
				console.error("Error replenishing flow points:", updateError);
				return currentPoints;
			}

			// Update local state with new flow point value
			const newBalance = updateData?.[0]?.flow_balance || currentPoints + pointsToAdd;
			await fetchFlowPoints(); // Refresh the local state
			console.log("Flow points replenished successfully:", newBalance);
			return newBalance;
		} catch (error) {
			console.error("Exception in flow point replenishment:", error);
			return flowPoints || 0;
		}
	}, [userId, flowPoints, fetchFlowPoints]);

	return { handleFlowPointReplenishment };
}
