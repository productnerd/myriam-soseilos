import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to fetch courses that are in progress for the current user
 *
 * @param userId - The ID of the user
 * @returns The in-progress courses
 */
export function useInProgressCourses(userId: string) {
	/*
	Benefits of using 'useQuery':
	- Caching - Data is cached for 5 minutes, shared across components
	- No duplicate requests - Multiple components use the same cached data
	- Background refetching - Automatically refetches when data becomes stale
	- Built-in loading/error states - No manual state management needed
	- Request deduplication - Prevents multiple simultaneous requests
	*/
	const result = useQuery({
		// 'queryKey': Unique identifier for caching
		// 'inProgressCourses': The query type - different query types get different cache entries
		// 'userId': The user ID - different users get different cache entries
		queryKey: ["inProgressCourses", userId],

		// 'queryFn': The actual fetch function - must return a Promise or throw an error
		queryFn: async () => {
			console.log(`[useInProgressCourses] Fetching in-progress courses`);

			const { data, error } = await supabase
				.from("user_progress")
				.select("course_id, courses:course_id(id, title, description, color)")
				.eq("user_id", userId)
				.eq("status", "INPROGRESS");

			if (error) {
				console.error("[useInProgressCourses] Error fetching in-progress courses:", error);
				throw error; // `useQuery` catches this and sets the 'error' state and 'isError': true
			}

			const result = data.map((item) => ({
				id: item.courses?.id || item.course_id,
				title: item.courses?.title || "Unknown Course",
				description: item.courses?.description || "",
				color: item.courses?.color || "#8B5CF6",
			}));

			console.log(
				`[useInProgressCourses] Found ${result.length} in-progress courses`,
				result
			);

			return result;
		},

		enabled: !!userId, // The query only runs if the user is authenticated

		// How long data is considered "fresh" (i.e. 5 minutes)
		// After 5 minutes, data becomes stale and will refetch on:
		// - Component mount (if refetchOnMount: true)
		// - Window focus (if refetchOnWindowFocus: true)
		// - Network reconnection (if refetchOnReconnect: true)
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	return result;
}
