import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
	areAllTopicsCompletedInLevel,
	getLevelTest,
	hasPassedLevelTest,
} from "@/utils/level/levelTestUtils";
import { useRequiredCourseContext } from "@/contexts/CourseContext";

/**
 * Hook that handles the logic for starting a learning session.
 * When the play button is clicked, it:
 * 1. Uses the selected course from the carousel (via `CourseContext`) and finds the current topic within that course
 * 2. Navigates to the topic learning page
 * 3. Updates database to mark course as INPROGRESS when user actually starts learning
 *
 * @param userId - The ID of the user
 * @returns
 * - isNavigating: boolean - Whether navigation is in progress
 * - handleStartLearning: function - The click handler for the play button
 */
export function usePlayButton(userId: string) {
	const navigate = useNavigate();
	const queryClient = useQueryClient(); // Used to manually manage the cache
	const [isNavigating, setisNavigating] = useState<boolean>(false);

	// Get the selected course ID from the context
	const { selectedCourseId } = useRequiredCourseContext();

	/**
	 * Helper function to handle level test logic
	 * Checks if the user has completed all topics in the current level
	 * If so, it checks if there is a level test for the current level
	 * If there is a level test, it navigates to the level test
	 *
	 * @param: userId - The user's ID
	 * @param: levelId - The ID of the level to check
	 * Note: courseId is not needed because levels are course-specific
	 * @returns: true if navigation to level test occurred, false otherwise
	 */
	const handleLevelTestNavigation = async (userId: string, levelId: string): Promise<boolean> => {
		console.log("[usePlayButton] No current topic - checking for level test scenario");

		// Check if the user has completed all topics in the current level
		const allTopicsCompleted = await areAllTopicsCompletedInLevel(userId, levelId);

		if (!allTopicsCompleted) {
			return false;
		}

		// Check if there is a level test for the current level
		const levelTest = await getLevelTest(levelId);

		if (!levelTest) {
			return false;
		}

		// Check if user has already passed the test
		const hasPassed = await hasPassedLevelTest(userId, levelTest.id);

		if (!hasPassed) {
			// Navigate to level test
			console.log("[usePlayButton] Redirecting to level test:", levelTest.id);
			navigate(
				`/test/${levelTest.id}?returnUrl=/learn&courseId=${selectedCourseId}&isLevelTest=true`
			);
			return true;
		}

		return false;
	};

	/**
	 * Update database to mark course as INPROGRESS when user starts learning
	 * This is the appropriate place for database updates - when user actually engages with content
	 */
	const updateCourseProgress = async (courseId: string) => {
		try {
			const { error } = await supabase.from("user_progress").upsert(
				{
					user_id: userId,
					course_id: courseId,
					status: "INPROGRESS",
					updated_at: new Date().toISOString(),
				},
				{
					onConflict: "user_id,course_id",
				}
			);

			if (error) {
				console.error("[usePlayButton] Failed to update course progress:", error);
			} else {
				console.log(
					"[usePlayButton] Updated course progress in database - user started learning"
				);
			}
		} catch (error) {
			console.error("[usePlayButton] Error updating course progress:", error);
		}
	};

	/**
	 * Main function that handles starting the learning session
	 * This is called when the user clicks the play button
	 */
	const handleStartLearning = async () => {
		// Prevent multiple simultaneous clicks
		if (isNavigating) return;

		setisNavigating(true);

		try {
			// Clear any cached data about the current topic so that:
			// 1. Fresh data is fetched when the user reaches the learning page
			// 2. No stale information is shown to the user
			// 3. The cache is updated with latest topic progress
			await queryClient.invalidateQueries({ queryKey: ["currentTopic"] });

			// Get the current topic for the selected course
			const { data: userProgress, error } = await supabase
				.from("user_progress")
				.select("current_topic_id, current_level_id, course_id")
				.eq("user_id", userId)
				.eq("course_id", selectedCourseId)
				.eq("status", "INPROGRESS")
				.maybeSingle();

			console.log("[usePlayButton] User progress:", {
				current_topic_id: userProgress?.current_topic_id,
				current_level_id: userProgress?.current_level_id,
				course_id: userProgress?.course_id,
				error,
			});

			if (error) {
				console.error("[usePlayButton] Error fetching user progress:", error);
				navigate("/learn");
				return;
			}

			// If the user needs to take a level test, navigate to the level test page
			// This happens when the user has completed all topics in the current level
			// `current_topic_id` is null but `current_level_id` is not
			if (!userProgress?.current_topic_id && userProgress?.current_level_id) {
				const levelTestNavigationOccurred = await handleLevelTestNavigation(
					userId,
					userProgress.current_level_id
				);

				if (levelTestNavigationOccurred) {
					return;
				}
			}

			// If the user has a topic in progress, navigate to the topic learning page (this is where `ActivityFlow` will be rendered)
			if (userProgress?.current_topic_id) {
				// Log which course and topic we're navigating to
				console.log(
					`[usePlayButton] Navigating to topic ${userProgress.current_topic_id} from course ${userProgress.course_id}`
				);

				navigate(`/learn/${userProgress.current_topic_id}`);
			} else {
				console.log("[usePlayButton] No active topic found");
				navigate("/learn");
			}

			// Update course progress in database
			await updateCourseProgress(selectedCourseId);
		} catch (error) {
			console.error("[usePlayButton] Error starting learning:", error);
			navigate("/learn");
		} finally {
			setisNavigating(false);
		}
	};

	return {
		isNavigating,
		handleStartLearning,
	};
}
