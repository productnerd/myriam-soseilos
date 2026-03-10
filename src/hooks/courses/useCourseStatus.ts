import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProgress } from "@/types/user";

/**
 * Hook for fetching course status for a specific user
 *
 * @param courseId - The ID of the course
 * @param userId - The ID of the authenticated user
 * @returns The course status data
 */
export function useCourseStatus(courseId: string | undefined, userId: string) {
	const [courseStatus, setCourseStatus] = useState<UserProgress | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<unknown>(null);

	useEffect(() => {
		const fetchCourseStatus = async () => {
			if (!courseId) {
				setIsLoading(false);
				return;
			}

			try {
				const { data, error: statusError } = await supabase
					.from("user_progress")
					.select("*")
					.eq("course_id", courseId)
					.eq("user_id", userId)
					.single();

				if (statusError) throw statusError;

				setCourseStatus(data);
			} catch (err) {
				console.error("Error fetching course status:", err);
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchCourseStatus();
	}, [courseId, userId]);

	return {
		courseStatus,
		isLoading,
		error,
	};
}
