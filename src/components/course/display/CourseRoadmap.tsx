import React, { useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { calculateActiveUsersPerCourse } from "@/utils/user/analytics/calculateActiveUsers";
import { useLevelsByCourse } from "@/hooks/courses";
import { useLevelCompletionStatus } from "@/hooks/learn/useLevelCompletionStatus";
import { useUserContext } from "@/contexts/UserContext";
import { useCourses } from "@/hooks/courses/useCourses";
import LevelAccordion from "@/components/test/level/LevelAccordion";
import {
	COMPLETED_TOPIC_KEY,
	LAST_TOPIC_STATUS_KEY,
} from "@/hooks/learn/useTopicCompletionTracking";
import { useTopicCompletionTracking } from "@/hooks/learn/useTopicCompletionTracking";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CourseRoadmapProps {
	selectedCourseId: string;
	courseColor: string;
}

const CourseRoadmap: React.FC<CourseRoadmapProps> = ({ selectedCourseId, courseColor }) => {
	const location = useLocation();

	// Get the user from the user context
	const { user } = useUserContext();

	const {
		data: levels,
		isLoading: isLoadingLevels,
		refetch: refetchLevels,
	} = useLevelsByCourse(selectedCourseId);

	const { data: courses } = useCourses();
	const course = courses?.find((c) => c.id === selectedCourseId);

	const { levelCompletionMap } = useLevelCompletionStatus(selectedCourseId, user!.id, levels);

	useTopicCompletionTracking();

	const fetchCurrentProgress = useCallback(async () => {
		if (!user!.id) return;

		try {
			await supabase
				.from("user_progress")
				.select("current_level_id, current_topic_id")
				.eq("user_id", user!.id)
				.eq("course_id", selectedCourseId)
				.maybeSingle();

			// =============================================================================
			// Note: Removed progress consistency validator as it was masking underlying data integrity issues.
			// The validator was a "band-aid" solution that tried to fix data inconsistencies after they occurred.
			//
			// Instead, we now prevent inconsistencies by using atomic database operations to ensure data consistency at the source:
			// - completeTopicAndProgress() uses `complete_topic` function
			// - saveUserProgress() uses `save_user_progress` function
			// - All progress updates happen in single transactions (atomic)
			// - Either succeed completely or fail completely (no partial states)
			// =============================================================================
		} catch (err) {
			console.error(`[CourseRoadmap] Error fetching current progress:`, err);
		}
	}, [selectedCourseId, user!.id]);

	useEffect(() => {
		fetchCurrentProgress();
	}, [selectedCourseId, fetchCurrentProgress, user!.id]);

	useEffect(() => {
		const handleLevelUnlocked = () => {
			refetchLevels().then(() => {
				toast.success("Next level unlocked!");
				fetchCurrentProgress();
			});
		};

		window.addEventListener("level-unlocked", handleLevelUnlocked as EventListener);

		return () => {
			window.removeEventListener("level-unlocked", handleLevelUnlocked as EventListener);
		};
	}, [refetchLevels, fetchCurrentProgress]);

	useEffect(() => {
		const updateActiveUsers = async () => {
			try {
				await calculateActiveUsersPerCourse();
			} catch (error) {}
		};

		updateActiveUsers();
	}, []);

	useEffect(() => {
		const checkForTopicCompletion = () => {
			const lastCompletedTopicId = localStorage.getItem(COMPLETED_TOPIC_KEY);
			const lastTopicStatusesJson = localStorage.getItem(LAST_TOPIC_STATUS_KEY);

			if (lastCompletedTopicId && lastTopicStatusesJson) {
				localStorage.removeItem(COMPLETED_TOPIC_KEY);
				localStorage.removeItem(LAST_TOPIC_STATUS_KEY);

				fetchCurrentProgress();
			}
		};

		checkForTopicCompletion();
	}, [fetchCurrentProgress, location.pathname]);

	if (isLoadingLevels) {
		return <div className="py-10 text-center">Loading course roadmap...</div>;
	}

	if (!levels || levels.length === 0) {
		return <div className="py-10 text-center">No levels found for this course.</div>;
	}

	return (
		<>
			{/* Full-screen background image with overlay */}
			{course?.image && (
				<div
					className="fixed inset-0 z-0"
					style={{
						backgroundImage: `url(${course.image})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
				>
					{/* Darken overlay for contrast */}
					<div className="absolute inset-0 bg-black/50" />
				</div>
			)}

			{/* Content with relative positioning to appear above background */}
			<div className="relative z-10 py-4">
				<div className="space-y-4">
					{levels.map((level, index) => {
						// Level is accessible if:
						// 1. It's the first level, OR
						// 2. The previous level test has been passed (score >= 80)
						const isPreviousLevelCompleted =
							index === 0 || levelCompletionMap[levels[index - 1]?.id];

						return (
							<LevelAccordion
								key={level.id}
								level={level}
								courseId={selectedCourseId}
								courseColor={courseColor}
								previousLevelCompleted={isPreviousLevelCompleted}
							/>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default CourseRoadmap;
