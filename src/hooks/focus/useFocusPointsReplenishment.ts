import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MAX_FOCUS_POINTS, REPLENISH_AMOUNT } from "./useFocusPointsConfig";

export interface FocusPointsReplenishmentReturn {
	handleFocusPointReplenishment: () => Promise<number>;
}

/**
 * Hook for handling focus point replenishment
 * This is now only used for testing/debugging purposes
 * as the actual replenishment is handled by the backend cron job
 *
 * @param focusPoints - Current focus points balance
 * @param setFocusPoints - Function to update focus points state
 * @param userId - The ID of the authenticated user
 * @returns Focus points replenishment functions
 */
export function useFocusPointsReplenishment(
	focusPoints: number,
	setFocusPoints: React.Dispatch<React.SetStateAction<number>>,
	userId: string
): FocusPointsReplenishmentReturn {
	const handleFocusPointReplenishment = useCallback(async () => {
		try {
			// First, check current focus points and last update timestamp
			const { data: currentData, error: currentError } = await supabase
				.from("profiles")
				.select("focus_balance, focus_last_updated_at")
				.eq("id", userId)
				.single();

			if (currentError) {
				console.error(
					"[useFocusPointsReplenishment] Error fetching current focus points:",
					currentError
				);
				return 0;
			}

			const currentPoints = currentData?.focus_balance || 0;
			const lastUpdated = currentData?.focus_last_updated_at
				? new Date(currentData.focus_last_updated_at)
				: null;
			const now = new Date();

			// Only replenish if we're at an even hour (2, 4, 6, 8, etc.)
			const currentHour = now.getHours();
			if (currentHour % 2 !== 0) {
				console.log(
					"[useFocusPointsReplenishment] Not an even hour, no replenishment needed"
				);
				return currentPoints;
			}

			// Check if we've already updated within this 2-hour window
			if (lastUpdated) {
				const lastUpdatedHour = lastUpdated.getHours();
				if (lastUpdatedHour === currentHour) {
					console.log(
						"[useFocusPointsReplenishment] Already replenished in this 2-hour window"
					);
					return currentPoints;
				}
			}

			// Calculate how many points to add (max REPLENISH_AMOUNT points)
			const pointsToAdd = Math.min(MAX_FOCUS_POINTS - currentPoints, REPLENISH_AMOUNT);

			// Only proceed if we need to add points
			if (pointsToAdd <= 0) {
				console.log(
					"[useFocusPointsReplenishment] Max focus points already reached, no replenishment needed"
				);
				return currentPoints;
			}

			console.log(
				`[useFocusPointsReplenishment] Adding ${pointsToAdd} focus points (current: ${currentPoints}, max: ${MAX_FOCUS_POINTS})`
			);

			// Update points and last_updated timestamp
			const { data: updateData, error: updateError } = await supabase
				.from("profiles")
				.update({
					focus_balance: currentPoints + pointsToAdd,
					focus_last_updated_at: now.toISOString(),
				})
				.eq("id", userId)
				.select("focus_balance");

			if (updateError) {
				console.error(
					"[useFocusPointsReplenishment] Error replenishing focus points:",
					updateError
				);
				return currentPoints;
			}

			// Update local state with new focus point value
			const newBalance = updateData?.[0]?.focus_balance || currentPoints + pointsToAdd;
			setFocusPoints(newBalance);
			console.log(
				"[useFocusPointsReplenishment] Focus points replenished successfully:",
				newBalance
			);
			return newBalance;
		} catch (error) {
			console.error(
				"[useFocusPointsReplenishment] Exception in focus point replenishment:",
				error
			);
			return focusPoints;
		}
	}, [userId, focusPoints, setFocusPoints]);

	return { handleFocusPointReplenishment };
}
