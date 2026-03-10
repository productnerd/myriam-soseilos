import { useCallback } from "react";

// Flow points configuration constants
export const MAX_FLOW_POINTS = 120;
export const REPLENISH_AMOUNT = 30;
export const REPLENISH_INTERVAL_HOURS = 2;
export const CORRECT_ANSWER_COST = 1;
export const INCORRECT_ANSWER_COST = 5;

// Type for flow points config
export interface FlowPointsConfig {
	maxFlowPoints: number;
	replenishAmount: number;
	replenishIntervalHours: number;
	correctAnswerCost: number;
	incorrectAnswerCost: number;
}

/**
 * Hook providing flow points configuration
 */
export function useFlowPointsConfig(): FlowPointsConfig {
	const getConfig = useCallback(() => {
		return {
			maxFlowPoints: MAX_FLOW_POINTS,
			replenishAmount: REPLENISH_AMOUNT,
			replenishIntervalHours: REPLENISH_INTERVAL_HOURS,
			correctAnswerCost: CORRECT_ANSWER_COST,
			incorrectAnswerCost: INCORRECT_ANSWER_COST,
		};
	}, []);

	return getConfig();
}
