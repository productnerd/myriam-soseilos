import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useBoundStore } from "@/store";

export interface FlowPointsDeductionReturn {
	deductFlowPoints: (isCorrect: boolean) => Promise<number>;
}

/**
 * Hook for handling flow point deduction
 *
 * @param userId - The ID of the authenticated user (always available via global context)
 * @returns Flow points deduction functions
 */
export function useFlowPointsDeduction(userId: string): FlowPointsDeductionReturn {
	const { flowPoints, setFlowPoints } = useBoundStore((state) => state);

	// Function to deduct flow points
	const deductFlowPoints = useCallback(
		async (isCorrect: boolean) => {
			if (!flowPoints) return 0;

			try {
				const pointsToDeduct = isCorrect ? 1 : 5;

				// Optimistically update the local state
				setFlowPoints(Math.max(0, flowPoints - pointsToDeduct));

				// Call the function to deduct flow points
				const { data, error } = await supabase.rpc("deduct_flow_points", {
					p_user_id: userId,
					p_is_correct: isCorrect,
				});

				if (error) {
					console.error("Error deducting flow points:", error);

					// Revert the optimistic update if the deduction fails
					setFlowPoints(flowPoints);
					return flowPoints;
				} else {
					console.log("Flow points deducted successfully:", data);
					if (typeof data === "number") {
						setFlowPoints(data);
						return data;
					}
					return Math.max(0, flowPoints - pointsToDeduct);
				}
			} catch (error) {
				console.error("Exception in flow point deduction:", error);

				// Revert the optimistic update if an exception occurs
				setFlowPoints(flowPoints);
				return flowPoints;
			}
		},
		[userId, flowPoints, setFlowPoints]
	);

	return { deductFlowPoints };
}
