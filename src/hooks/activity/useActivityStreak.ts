import { useState, useCallback } from "react";
import { useFlowPoints } from "@/hooks/points/useFlowPoints";
import { toast } from "@/hooks/ui/useToast";
import { Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { shouldActivityCountForStreakAndFocus } from "@/utils/activities/activityScoring";
import { Activity } from "@/types/activity";

interface UseActivityStreakReturn {
	activityStreak: number;
	handleActivityResult: (isCorrect: boolean, activity?: Activity) => void;
	resetStreak: () => void;
}

/**
 * Hook for managing activity streak and awarding bonus points
 *
 * @param userId - The ID of the user (can be null if user is not authenticated)
 * @returns Activity streak state and management functions
 */
export function useActivityStreak(userId: string | null): UseActivityStreakReturn {
	const [activityStreak, setActivityStreak] = useState(0);
	const { flowBalance, config } = useFlowPoints(userId || "");

	const calculateBonusPoints = useCallback((streak: number): number => {
		if (streak < 5) return 0;

		const milestoneReached = Math.floor(streak / 5);
		// Base points (3) + additional points based on milestone
		return 3 + (milestoneReached - 1);
	}, []);

	const awardBonusPoints = useCallback(
		async (streak: number) => {
			// Don't execute if no user ID is provided
			if (!userId) {
				return;
			}

			if (streak < 5 || streak % 5 !== 0) return;

			// Don't award if already at max flow
			if (flowBalance >= config.maxPoints) return;

			const bonusPoints = calculateBonusPoints(streak);
			const pointsToAward = Math.min(bonusPoints, config.maxPoints - flowBalance);

			if (pointsToAward <= 0) return;

			try {
				// Call the Supabase edge function
				const { data, error } = await supabase.functions.invoke("award-bonus-flow-points", {
					body: {
						bonusPoints: pointsToAward,
						streak: streak,
					},
				});

				if (error) throw error;

				if (data?.success) {
					// Show success toast
					toast.topRight({
						title: `Streak Bonus! 🔥`,
						description: `${streak} correct in a row! +${pointsToAward} flow points`,
						icon: Zap,
						iconProps: { className: "text-yellow-500" },
						className: "border-yellow-200 bg-yellow-50",
					});
				}
			} catch (error) {
				console.error("Error awarding bonus points:", error);
			}
		},
		[flowBalance, config.maxPoints, calculateBonusPoints, userId]
	);

	const handleActivityResult = useCallback(
		async (isCorrect: boolean, activity?: Activity) => {
			// Only count activities that have correct/incorrect answers toward streak
			if (activity && !shouldActivityCountForStreakAndFocus(activity)) {
				return; // Don't update streak for non-scoring activities
			}

			if (isCorrect) {
				const newStreak = activityStreak + 1;
				setActivityStreak(newStreak);

				// Check if we should award bonus points
				await awardBonusPoints(newStreak);
			} else {
				setActivityStreak(0);
			}
		},
		[activityStreak, awardBonusPoints]
	);

	const resetStreak = useCallback(() => {
		setActivityStreak(0);
	}, []);

	return {
		activityStreak,
		handleActivityResult,
		resetStreak,
	};
}
