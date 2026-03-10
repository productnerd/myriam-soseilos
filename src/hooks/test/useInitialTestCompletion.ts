import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { getFirstTopicId } from "@/utils/courses/courseNavigation";

/**
 * Hook for managing initial test completion
 *
 * @param courseId - The ID of the course
 * @param userId - The ID of the authenticated user
 * @param onComplete - Callback function when test is completed
 * @returns Initial test completion state and functions
 */
export function useInitialTestCompletion(
	courseId: string,
	userId: string,
	onComplete: (initialTestCompleted: boolean, skipped: boolean) => void
) {
	const [hasCompletedTest, setHasCompletedTest] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isNavigating, setIsNavigating] = useState<boolean>(false);
	const queryClient = useQueryClient();

	// Check if initial test is already completed
	useEffect(() => {
		const checkInitialTestCompletion = async () => {
			if (!userId || !courseId) return;

			try {
				// Get the test ID for the initial test
				const { data: testData, error: testError } = await supabase
					.from("tests")
					.select("*")
					.eq("course_id", courseId)
					.eq("test_type", "initial")
					.maybeSingle();

				if (testError) {
					console.error("Error fetching test:", testError);
					return;
				}

				if (!testData) {
					console.error("Initial test not found for course:", courseId);
					return;
				}

				// Check if the user has already completed the test
				const { data: scoreData, error: scoreError } = await supabase
					.from("user_test_scores")
					.select("*")
					.eq("user_id", userId)
					.eq("test_id", testData.id)
					.maybeSingle();

				if (scoreError) {
					console.error("Error fetching test score:", scoreError);
					return;
				}

				console.debug("Found existing test score for test", testData.id);
				setHasCompletedTest(!!scoreData);
				console.debug("Initial test completion check result:", !!scoreData);
			} catch (error) {
				console.error("Error checking initial test completion:", error);
			}
		};

		checkInitialTestCompletion();
	}, [userId, courseId]);

	// Create a function to be called when completing the test
	const handleTestComplete = async (skipped: boolean = false) => {
		if (!userId || !courseId) return;

		try {
			setIsNavigating(true);

			// Invalidate relevant queries after test completion
			queryClient.invalidateQueries({ queryKey: ["initialTest"] });
			queryClient.invalidateQueries({ queryKey: ["initialTestScore"] });
			queryClient.invalidateQueries({ queryKey: ["userProgress"] });
			queryClient.invalidateQueries({ queryKey: ["courseDirectProgress"] });
			queryClient.invalidateQueries({ queryKey: ["courses"] });

			// Fetch the queries to ensure data is up-to-date
			await queryClient.fetchQuery({ queryKey: ["initialTest"] });
			await queryClient.fetchQuery({ queryKey: ["initialTestScore"] });
			await queryClient.fetchQuery({ queryKey: ["userProgress"] });

			// Wait before calling the completion handler
			setTimeout(() => {
				onComplete(true, skipped);
			}, 1000);
		} catch (error) {
			console.error("Error handling test completion:", error);
			onComplete(false, skipped);
		}
	};

	// Create initial score record for tracking - ONLY when a user completes or skips a test
	const createInitialScoreRecord = async (
		completed: boolean = false,
		skipped: boolean = false
	) => {
		if (!userId || !courseId || isSubmitting) return;

		// Only create a score record if the test is completed or skipped
		if (!completed && !skipped) {
			console.info("Test not completed or skipped, not creating score record");
			return;
		}

		console.debug("Creating initial score record, completed:", completed);

		try {
			setIsSubmitting(true);

			// Get the initial test for this course
			const { data: testData, error: testError } = await supabase
				.from("tests")
				.select("id")
				.eq("course_id", courseId)
				.eq("test_type", "initial")
				.maybeSingle();

			if (testError) {
				console.error("Error fetching initial test:", testError);
				return;
			}

			if (!testData) {
				console.error("Initial test not found for course:", courseId);
				return;
			}

			// Create a test score record with appropriate values based on completion or skipping
			const { error: scoreError } = await supabase.from("user_test_scores").insert({
				user_id: userId,
				test_id: testData.id,
				passed: true, // Always pass initial assessments for learning progress
				score: skipped ? 0 : null, // Set score to 0 if skipped, null if completed normally
				test_type: "initial",
				completed_at: new Date().toISOString(),
			});

			if (scoreError) {
				console.error("Error creating initial test score:", scoreError);
				// Even if there's an error here, we'll continue with setup to ensure user can proceed
			} else {
				console.log("Successfully created initial test score record");
			}

			// Get first topic ID for this course
			const firstTopicId = await getFirstTopicId(courseId);

			if (!firstTopicId) {
				console.error("Failed to get first topic ID for course:", courseId);
				return;
			}

			console.log("Found first topic ID:", firstTopicId);

			// Get the level_id for this topic
			const { data: topicData, error: topicError } = await supabase
				.from("topics")
				.select("level_id")
				.eq("id", firstTopicId)
				.single();

			if (topicError) {
				console.error("Error getting level_id for topic:", topicError);
				return;
			}

			// Create or update user progress
			console.log("Creating/updating user progress with first topic:", firstTopicId);

			const { error: progressError } = await supabase.from("user_progress").upsert(
				{
					course_id: courseId,
					user_id: userId,
					current_topic_id: firstTopicId,
					current_level_id: topicData.level_id,
					current_activity_id: null,
					status: "INPROGRESS",
					updated_at: new Date().toISOString(),
				},
				{
					onConflict: "course_id,user_id",
					ignoreDuplicates: false,
				}
			);

			if (progressError) {
				console.error("Error updating user progress:", progressError);
				return;
			}

			console.log("Successfully set up initial user progress");

			// Invalidate course queries to update UI
			queryClient.invalidateQueries({ queryKey: ["courseDirectProgress"] });
			queryClient.invalidateQueries({ queryKey: ["courses"] });
		} catch (error) {
			console.error("Error in createInitialScoreRecord:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		isNavigating,
		hasCompletedTest,
		handleTestComplete,
		createInitialScoreRecord,
	};
}
