import { useCallback } from "react";

// Focus points configuration constants
export const MAX_FOCUS_POINTS = 120;
export const REPLENISH_AMOUNT = 30;
export const REPLENISH_INTERVAL_HOURS = 2;
export const CORRECT_ANSWER_COST = 1;
export const INCORRECT_ANSWER_COST = 2;

// Type for focus points config
export interface FocusPointsConfig {
	maxFocusPoints: number;
	replenishAmount: number;
	replenishIntervalHours: number;
	correctAnswerCost: number;
	incorrectAnswerCost: number;
}

/**
 * Hook providing focus points configuration
 */
export function useFocusPointsConfig(): FocusPointsConfig {
	const getConfig = useCallback(() => {
		return {
			maxFocusPoints: MAX_FOCUS_POINTS,
			replenishAmount: REPLENISH_AMOUNT,
			replenishIntervalHours: REPLENISH_INTERVAL_HOURS,
			correctAnswerCost: CORRECT_ANSWER_COST,
			incorrectAnswerCost: INCORRECT_ANSWER_COST,
		};
	}, []);

	return getConfig();
}
