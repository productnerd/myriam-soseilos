import { useState, useEffect } from "react";
import { fetchUserStreakData } from "@/utils/streaks/streakUtils";
import { useQuery } from "@tanstack/react-query";
import { useSundayCheck } from "@/hooks/activity/useSundayCheck";
import { hasStreakProtection } from "@/hooks/learning/progress/streakProtection";

/**
 * Hook for managing user streak data
 *
 * @param userId - The ID of the user to fetch streak data for (can be null if user is not authenticated)
 * @returns An object containing streak data and functions to refresh the data
 */
export function useStreak(userId: string | null) {
	const { isSundayProtection } = useSundayCheck();
	const [streakProtected, setStreakProtected] = useState<boolean>(false);

	const {
		data: streakData,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["streakData", userId],
		queryFn: async () => {
			if (!userId) return null;
			return await fetchUserStreakData(userId);
		},
		enabled: !!userId, // Only run when userId is provided
		refetchInterval: 30000, // Refresh every 30 seconds
		refetchOnWindowFocus: true,
		staleTime: 10000, // Consider data stale after 10 seconds
	});

	// Check streak protection status
	useEffect(() => {
		const checkStreakProtection = async () => {
			try {
				const isProtected = await hasStreakProtection(userId);
				setStreakProtected(isProtected);
			} catch (error) {
				console.error("Error checking streak protection:", error);
				setStreakProtected(false);
			}
		};

		if (userId) {
			checkStreakProtection();
		}
	}, [userId]);

	const refreshStreakData = () => {
		refetch();
	};

	return {
		currentStreak: streakData?.currentStreak || 0,
		dailyProgress: streakData?.dailyProgress || 0,
		goalCompleted: streakData?.goalCompleted || false,
		progressPercentage: streakData?.progressPercentage || 0,
		isLoading,
		error,
		refreshStreakData,
		isSundayProtection,
		streakProtected,
	};
}
