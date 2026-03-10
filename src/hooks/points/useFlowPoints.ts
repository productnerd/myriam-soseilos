import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FlowPointsConfig {
	maxPoints: number;
	replenishAmount: number;
	replenishIntervalHours: number;
	correctAnswerCost: number;
	incorrectAnswerCost: number;
}

const defaultConfig: FlowPointsConfig = {
	maxPoints: 120,
	replenishAmount: 30,
	replenishIntervalHours: 2,
	correctAnswerCost: 1,
	incorrectAnswerCost: 5,
};

/**
 * Hook for managing flow points
 *
 * @param userId - The ID of the user
 * @returns Flow points state and management functions
 */
export const useFlowPoints = (userId: string | null) => {
	const [flowBalance, setFlowBalance] = useState<number>(0);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// Function to check if user has sufficient flow points
	const hasInsufficientFlowPoints = (): boolean => {
		const isSufficient = flowBalance > 0;
		return isSufficient;
	};

	// Function to get current flow balance
	const getCurrentFlowBalance = async (): Promise<number> => {
		if (!userId) return 0;

		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("flow_balance, flow_last_updated_at")
				.eq("id", userId)
				.single();

			if (error) {
				console.error("Error fetching flow balance:", error);
				return 0;
			}

			const balance = data?.flow_balance || 0;
			const lastUpdate = data?.flow_last_updated_at
				? new Date(data.flow_last_updated_at)
				: null;

			setFlowBalance(balance);
			setLastUpdated(lastUpdate);

			return balance;
		} catch (error) {
			console.error("Error getting flow balance:", error);
			return 0;
		}
	};

	// Function to deduct flow points
	const deductFlowPoints = async (isCorrect: boolean): Promise<number> => {
		if (!userId) return flowBalance;

		try {
			const { data, error } = await supabase.rpc("deduct_flow_points", {
				p_user_id: userId,
				p_is_correct: isCorrect,
			});

			if (error) {
				console.error("Error deducting flow points:", error);
				return flowBalance;
			}

			const newBalance = data || 0;
			setFlowBalance(newBalance);
			setLastUpdated(new Date());

			return newBalance;
		} catch (error) {
			console.error("Error deducting flow points:", error);
			return flowBalance;
		}
	};

	// Function to calculate time until next replenishment
	const getTimeUntilReplenishment = (): number => {
		if (!lastUpdated) return 0;

		const now = new Date();
		const timeSinceLastUpdate = now.getTime() - lastUpdated.getTime();
		const replenishIntervalMs = defaultConfig.replenishIntervalHours * 60 * 60 * 1000;
		const timeUntilNext = replenishIntervalMs - (timeSinceLastUpdate % replenishIntervalMs);

		return Math.max(0, timeUntilNext);
	};

	// Function to get estimated replenishment time
	const getEstimatedReplenishmentTime = (): Date | null => {
		const timeUntil = getTimeUntilReplenishment();

		if (timeUntil === 0) return null;

		return new Date(Date.now() + timeUntil);
	};

	// Initialize flow balance on component mount
	useEffect(() => {
		getCurrentFlowBalance().finally(() => setIsLoading(false));
	}, [userId]);

	return {
		flowBalance,
		lastUpdated,
		config: defaultConfig,
		isLoading,
		hasInsufficientFlowPoints,
		getCurrentFlowBalance,
		deductFlowPoints,
		getTimeUntilReplenishment,
		getEstimatedReplenishmentTime,
	};
};
