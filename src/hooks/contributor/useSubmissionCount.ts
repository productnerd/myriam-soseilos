import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSubmissionCount() {
	const { data: count = 0, isLoading } = useQuery({
		queryKey: ["submission-count"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("activity_submission_counts")
				.select("submission_count")
				.eq("submission_date", new Date().toISOString().split("T")[0])
				.maybeSingle();

			if (error) throw error;
			return data?.submission_count || 0;
		},
		refetchInterval: 30000, // Refresh every 30 seconds
	});

	const remainingSubmissions = 20 - count;
	const hasReachedLimit = remainingSubmissions <= 0;

	return {
		count,
		remainingSubmissions,
		hasReachedLimit,
		isLoading,
	};
}
