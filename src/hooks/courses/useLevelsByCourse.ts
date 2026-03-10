import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Level } from "@/types/level";

export function useLevelsByCourse(courseId: string) {
	const queryClient = useQueryClient();

	return useQuery({
		queryKey: ["levels", courseId],
		queryFn: async () => {
			// Check if we have the data in the cache
			const cachedData = queryClient.getQueryData<Level[]>(["levels", courseId]);
			if (cachedData) {
				return cachedData;
			}

			console.log("[useLevelsByCourse] Fetching levels for course", courseId);

			const { data, error } = await supabase
				.from("levels")
				.select("*")
				.eq("course_id", courseId)
				.order("order_number");

			if (error) {
				console.error("[useLevelsByCourse] Error fetching levels:", error);
				throw error;
			}

			console.log(
				`[useLevelsByCourse] Found ${data.length} levels for course ${courseId}`,
				data
			);
			return data as Level[];
		},
		enabled: !!courseId,
		staleTime: 5 * 60 * 1000, // 5 minutes stale time
		gcTime: 10 * 60 * 1000, // 10 minutes cache time
		refetchOnWindowFocus: false, // Changed to false to reduce unnecessary refetches
		refetchOnMount: false, // Only fetch when not in cache
	});
}
