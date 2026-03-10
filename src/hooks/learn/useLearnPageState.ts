import { useMemo, useEffect } from "react";
import { useCourseContext } from "@/contexts/CourseContext";
import { useInitialTestState } from "./useInitialTestState";
import { useTopicCompletionTracking } from "./useTopicCompletionTracking";
import { useCourses } from "@/hooks/courses";
import { useUserContext } from "@/contexts/UserContext";

export function useLearnPageState() {
	const { user } = useUserContext();

	// Get courses data
	const { data: courses, isLoading, error } = useCourses();

	// Use the course context to get the currently selected course state from the carousel
	const courseSelectionState = useCourseContext();

	// Automatic course selection
	// Only run if we have courses and no course is currently selected (no localStorage, no course context)
	// This can happen when a new user skips onboarding or a user clears local storage
	useEffect(() => {
		if (courses && courses.length > 0 && !courseSelectionState.selectedCourseId) {
			// If a a new user skips onboarding, then they will have no in-progress courses so we select the first course
			const inProgressCourse = courses.find((course) => course.status === "INPROGRESS");
			const defaultCourseId = inProgressCourse?.id || courses[0].id;
			// Call the course context selection handler to set the selected course in local storage and in the course context
			courseSelectionState.handleCourseSelect(defaultCourseId);
		}
	}, [courses, courseSelectionState.selectedCourseId, courseSelectionState.handleCourseSelect]);

	const {
		showInitialTest,
		hasCompletedInitialTest,
		courseStatus,
		initialTest,
		isLoadingTest,
		handleStartInitialTest,
		handleInitialTestComplete,
		handleInitialTestSkip,
	} = useInitialTestState(user!.id, courseSelectionState.selectedCourseId);

	// Track topic completion
	useTopicCompletionTracking();

	// Calculate course color based on selected course
	const courseColor = useMemo(() => {
		const selectedCourse = courses?.find(
			(course) => course.id === courseSelectionState.selectedCourseId
		);
		return selectedCourse?.color || "";
	}, [courses, courseSelectionState.selectedCourseId]);

	// Memoize return value to prevent unnecessary re-renders
	return useMemo(
		() => ({
			courses,
			isLoading,
			error,
			courseColor,
			selectedCourseId: courseSelectionState.selectedCourseId,
			handleCourseSelect: courseSelectionState.handleCourseSelect,
			showInitialTest,
			hasCompletedInitialTest,
			courseStatus,
			initialTest,
			isLoadingTest,
			handleStartInitialTest,
			handleInitialTestComplete,
			handleInitialTestSkip,
		}),
		[
			courses,
			isLoading,
			error,
			courseColor,
			courseSelectionState.selectedCourseId,
			courseSelectionState.handleCourseSelect,
			showInitialTest,
			hasCompletedInitialTest,
			courseStatus,
			initialTest,
			isLoadingTest,
			handleStartInitialTest,
			handleInitialTestComplete,
			handleInitialTestSkip,
		]
	);
}
