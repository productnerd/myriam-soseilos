import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook that provides user progress data for course carousel display
 *
 * @param selectedCourseId - The ID of the selected course
 * @param userId - The ID of the authenticated user
 * @returns The user progress data
 */
export function useCourseCarousel(selectedCourseId: string | null, userId: string | null) {
	// Get user progress for level display
	const { data: userProgress } = useQuery({
		queryKey: ["userProgress", selectedCourseId],
		queryFn: async () => {
			if (!userId) return { userProgress: null };

			const { data: progressData } = await supabase
				.from("user_progress")
				.select("course_id, current_level_id, status")
				.eq("user_id", userId);

			return progressData || [];
		},
		enabled: !!userId && !!selectedCourseId, // Only fetch if course is selected and user is authenticated
	});

	return {
		userProgress,
	};
}
