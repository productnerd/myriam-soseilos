import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FocusPointsFetchingReturn {
	focusPoints: number;
	isLoading: boolean;
}

/**
 * Hook for fetching focus points from the database
 *
 * @param userId - The ID of the authenticated user (always available via global context)
 * @returns Focus points data and loading state
 */
export function useFocusPointsFetching(userId: string): FocusPointsFetchingReturn {
	const [focusPoints, setFocusPoints] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchFocusPoints = async () => {
			try {
				const { data, error } = await supabase
					.from("profiles")
					.select("focus_balance")
					.eq("id", userId)
					.single();

				if (error) {
					console.error("Error fetching focus points:", error);
				} else {
					setFocusPoints(data.focus_balance);
				}
			} catch (error) {
				console.error("Error in fetchFocusPoints:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchFocusPoints();
	}, [userId]);

	return { focusPoints, isLoading };
}
