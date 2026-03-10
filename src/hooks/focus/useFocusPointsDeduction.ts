import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FocusPointsDeductionReturn {
	deductFocusPoints: (isCorrect: boolean) => Promise<number>;
}

/**
 * Hook for handling focus point deduction
 *
 * @param focusPoints - Current focus points balance
 * @param setFocusPoints - Function to update focus points state
 * @param userId - The ID of the authenticated user
 * @returns Focus points deduction functions
 */
export function useFocusPointsDeduction(
	focusPoints: number,
	setFocusPoints: React.Dispatch<React.SetStateAction<number>>,
	userId: string
): FocusPointsDeductionReturn {
	// Function to deduct focus points
	const deductFocusPoints = useCallback(
		async (isCorrect: boolean) => {
			try {
				const pointsToDeduct = isCorrect ? 1 : 5;

				// Optimistically update the local state
				setFocusPoints((prevPoints) => Math.max(0, prevPoints - pointsToDeduct));

				// Call the function to deduct focus points
				const { data, error } = await supabase.rpc("deduct_focus_points", {
					p_user_id: userId,
					p_is_correct: isCorrect,
				});

				if (error) {
					console.error("Error deducting focus points:", error);

					// Revert the optimistic update if the deduction fails
					setFocusPoints((prevPoints) => prevPoints + pointsToDeduct);
					return focusPoints;
				} else {
					console.log("[useFocusPointsDeduction] Focus points deducted successfully:", data);
					if (typeof data === "number") {
						setFocusPoints(data);
						return data;
					}
					return Math.max(0, focusPoints - pointsToDeduct);
				}
			} catch (error) {
				console.error("[useFocusPointsDeduction] Exception in focus point deduction:", error);

				// Revert the optimistic update if an exception occurs
				setFocusPoints((prevPoints) => Math.max(0, prevPoints));
				return focusPoints;
			}
		},
		[userId, focusPoints, setFocusPoints]
	);

	return { deductFocusPoints };
}
