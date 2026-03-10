import { useCallback } from "react";
import { MAX_FLOW_POINTS, REPLENISH_AMOUNT, REPLENISH_INTERVAL_HOURS } from "./useFlowPointsConfig";

/**
 * Hook for utility functions related to flow points
 */
export function useFlowPointsUtilities(flowPoints: number) {
	/**
	 * Checks if user has enough flow points to perform an action
	 */
	const hasSufficientFlow = useCallback(() => {
		// Always require at least 1 flow point for any action
		return flowPoints > 0;
	}, [flowPoints]);

	/**
	 * Calculate seconds until next replenishment
	 * This happens at even hours (2, 4, 6, 8...)
	 */
	const calculateSecondsUntilNextReplenishment = useCallback(() => {
		const now = new Date();
		const currentHour = now.getHours();
		const currentMinutes = now.getMinutes();
		const currentSeconds = now.getSeconds();

		// Find next even hour (divisible by REPLENISH_INTERVAL_HOURS)
		let nextReplenishHour = currentHour;
		if (
			currentHour % REPLENISH_INTERVAL_HOURS !== 0 ||
			(currentHour % REPLENISH_INTERVAL_HOURS === 0 &&
				(currentMinutes > 0 || currentSeconds > 0))
		) {
			nextReplenishHour =
				currentHour + (REPLENISH_INTERVAL_HOURS - (currentHour % REPLENISH_INTERVAL_HOURS));
		} else {
			// If we're at exactly an even hour (2:00:00), return 0 seconds
			if (currentMinutes === 0 && currentSeconds === 0) {
				return 0;
			}

			// Otherwise, we're at the replenish hour but past the exact time (e.g. 2:30),
			// so we need to wait until the next replenish hour
			nextReplenishHour = currentHour + REPLENISH_INTERVAL_HOURS;
		}

		// Ensure hour is within 0-23 range
		nextReplenishHour = nextReplenishHour % 24;

		// Calculate seconds until next replenishment
		const secondsUntilNextHour =
			((nextReplenishHour - currentHour + 24) % 24) * 3600 -
			currentMinutes * 60 -
			currentSeconds;

		return secondsUntilNextHour;
	}, []);

	/**
	 * Format the time until next replenishment as a string
	 */
	const formatTimeUntilReplenishment = useCallback(() => {
		// If flow is at max, no need for replenishment
		if (flowPoints >= MAX_FLOW_POINTS) {
			return "Full";
		}

		const seconds = calculateSecondsUntilNextReplenishment();
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const remainingSeconds = Math.floor(seconds % 60);

		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		} else if (minutes > 0) {
			return `${minutes}m ${remainingSeconds}s`;
		} else {
			return `${remainingSeconds}s`;
		}
	}, [flowPoints, calculateSecondsUntilNextReplenishment]);

	// Return both the formatted time string and the raw seconds value
	return {
		hasSufficientFlow,
		formatTimeUntilReplenishment,
		secondsUntilNextReplenishment: calculateSecondsUntilNextReplenishment(),
	};
}
