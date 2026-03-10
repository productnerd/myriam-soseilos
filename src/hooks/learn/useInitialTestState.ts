import { useState, useEffect, useCallback } from "react";
import { checkExistingTestScore } from "@/utils/test/checkExistingTestScore";
import { useInitialTest } from "@/hooks/test/useInitialTest";
import { supabase } from "@/integrations/supabase/client";
import { useBoundStore } from "@/store";

/**
 * Hook for managing initial test state
 *
 * @param userId - The ID of the authenticated user
 * @param selectedCourseId - The ID of the selected course
 * @returns Initial test state and functions
 */
export function useInitialTestState(userId: string, selectedCourseId: string | null) {
	const [showInitialTest, setShowInitialTest] = useState<boolean>(false);
	const [courseStatus, setCourseStatus] = useState<
		"NOT_STARTED" | "INPROGRESS" | "COMPLETED" | null
	>(null);

	const { hasCompletedInitialTest, setHasCompletedInitialTest } = useBoundStore((state) => state);

	// Get initial test for selected course with improved caching
	const { data: initialTest, isLoading: isLoadingTest } = useInitialTest(
		selectedCourseId ? selectedCourseId : null,
		userId
	);

	// Cache last checked course ID to avoid redundant database calls
	const [lastCheckedCourseId, setLastCheckedCourseId] = useState<string | null>(null);

	// First check course status
	useEffect(() => {
		if (!selectedCourseId) {
			setCourseStatus(null);
			return;
		}

		const checkCourseStatus = async () => {
			try {
				// Clear state for new course selection
				if (selectedCourseId !== lastCheckedCourseId) {
					setHasCompletedInitialTest(false);
					setShowInitialTest(false);
				}

				const { data, error } = await supabase
					.from("user_progress")
					.select("status")
					.eq("user_id", userId)
					.eq("course_id", selectedCourseId)
					.maybeSingle();

				if (error) {
					console.error("Error checking course status:", error);
					return;
				}

				if (data?.status) {
					console.debug("Course status:", data.status);
					setCourseStatus(data.status as "NOT_STARTED" | "INPROGRESS" | "COMPLETED");

					// If course is already in progress or completed, we can consider initial test as completed
					if (data.status === "INPROGRESS" || data.status === "COMPLETED") {
						setHasCompletedInitialTest(true);
						setShowInitialTest(false);
					} else {
						// For NOT_STARTED, we need to check if there's a test score
						setHasCompletedInitialTest(false);

						// If course is NOT_STARTED and we have an initial test, always show it
						if (data.status === "NOT_STARTED" && initialTest?.id) {
							setShowInitialTest(true);
						}
					}
				} else {
					// No status means course is not started
					setCourseStatus("NOT_STARTED");
					setHasCompletedInitialTest(false);

					// If we have an initial test, show it for new courses
					if (initialTest?.id) {
						setShowInitialTest(true);
					}
				}
			} catch (error) {
				console.error("Error checking course status:", error);
			}
		};

		checkCourseStatus();
	}, [userId, selectedCourseId, initialTest, lastCheckedCourseId]);

	// Check if the user has completed the initial test for the selected course
	useEffect(() => {
		// Skip if we've already checked this course and found it completed
		if (
			selectedCourseId &&
			selectedCourseId === lastCheckedCourseId &&
			hasCompletedInitialTest
		) {
			return;
		}

		// Skip the database call if we don't have necessary data
		if (!selectedCourseId || !initialTest) return;

		// If course is already in progress or completed, no need to check test score
		if (courseStatus === "INPROGRESS" || courseStatus === "COMPLETED") {
			setHasCompletedInitialTest(true);
			setShowInitialTest(false);
			return;
		}

		const checkInitialTestCompletion = async () => {
			try {
				// If there's no initial test, consider it "completed" (show roadmap)
				if (!initialTest.id) {
					setHasCompletedInitialTest(true);
					setLastCheckedCourseId(selectedCourseId);
					return;
				}

				// Check if user has completed the test using our utility function
				const hasCompleted = await checkExistingTestScore(initialTest.id, userId);
				console.debug("Initial test completion check result:", hasCompleted);
				setHasCompletedInitialTest(hasCompleted);

				// CRITICAL: Always show the initial test for NOT_STARTED courses
				if (courseStatus === "NOT_STARTED") {
					setShowInitialTest(true);
				} else {
					// For other statuses, only show if not completed
					setShowInitialTest(!hasCompleted);
				}

				if (hasCompleted) {
					setLastCheckedCourseId(selectedCourseId);
				}
			} catch (error) {
				console.error("Error checking initial test completion:", error);
			}
		};

		checkInitialTestCompletion();
	}, [
		userId,
		selectedCourseId,
		initialTest,
		lastCheckedCourseId,
		hasCompletedInitialTest,
		courseStatus,
	]);

	// Memoize event handlers to prevent unnecessary re-renders
	const handleStartInitialTest = useCallback(() => {
		setShowInitialTest(true);
	}, []);

	const handleInitialTestComplete = useCallback(() => {
		setShowInitialTest(false);
		setHasCompletedInitialTest(true);
		if (selectedCourseId) {
			setLastCheckedCourseId(selectedCourseId);
		}
	}, [selectedCourseId]);

	const handleInitialTestSkip = useCallback(async () => {
		if (!userId || !selectedCourseId || !initialTest?.id) return;

		try {
			console.debug("Skipping initial test");

			// First, create and update the test score record as skipped
			const { data: scoreData, error: scoreError } = await supabase
				.from("user_test_scores")
				.insert({
					user_id: userId,
					test_id: initialTest.id,
					score: 0,
					passed: true,
					completed_at: new Date().toISOString(),
					test_type: "initial",
				})
				.select();

			if (scoreError) {
				console.error("Error creating test score record:", scoreError);
				return;
			}

			console.debug("Created test score record:", scoreData);

			// Now mark the course as INPROGRESS
			const { error: progressError } = await supabase.from("user_progress").upsert(
				{
					user_id: userId,
					course_id: selectedCourseId,
					status: "INPROGRESS",
					updated_at: new Date().toISOString(),
				},
				{
					onConflict: "user_id,course_id",
				}
			);

			if (progressError) {
				console.error("Error updating user progress:", progressError);
				return;
			}

			// Update local state
			setShowInitialTest(false);
			setHasCompletedInitialTest(true);
			setCourseStatus("INPROGRESS");
			if (selectedCourseId) {
				setLastCheckedCourseId(selectedCourseId);
			}

			console.debug("Successfully skipped initial test");
		} catch (error) {
			console.error("Error skipping initial test:", error);
		}
	}, [userId, selectedCourseId, initialTest]);

	return {
		showInitialTest,
		hasCompletedInitialTest,
		courseStatus,
		initialTest,
		isLoadingTest,
		handleStartInitialTest,
		handleInitialTestComplete,
		handleInitialTestSkip,
	};
}
