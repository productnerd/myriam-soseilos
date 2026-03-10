import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useBoundStore } from "@/store";

export interface FlowPointsFetchingReturn {
	flowPoints: number;
	isLoading: boolean;
	refetch: () => Promise<void>;
}

/**
 * Hook for fetching flow points from the database
 *
 * @param userId - The ID of the authenticated user (always available via global context)
 * @returns Flow points fetching state and functions
 */
export function useFlowPointsFetching(userId: string): FlowPointsFetchingReturn {
	const { flowPoints, setFlowPoints, isLoading, setIsLoading } = useBoundStore((state) => state);

	const fetchFlowPoints = useCallback(async () => {
		setIsLoading(true);
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("flow_balance")
				.eq("id", userId)
				.single();

			if (error) {
				console.error("Error fetching flow points:", error);
				setFlowPoints(null);
			} else {
				setFlowPoints(data?.flow_balance || 0);
			}
		} catch (error) {
			console.error("Exception fetching flow points:", error);
			setFlowPoints(null);
		} finally {
			setIsLoading(false);
		}
	}, [userId, setFlowPoints, setIsLoading]);

	useEffect(() => {
		fetchFlowPoints();
	}, [fetchFlowPoints]);

	return { flowPoints: flowPoints || 0, isLoading, refetch: fetchFlowPoints };
}
