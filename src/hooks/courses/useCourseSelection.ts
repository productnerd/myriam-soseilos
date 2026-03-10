import { useState, useEffect, useMemo } from "react";

/**
 * Hook that manages course selection state and logic.
 * This contains all the logic for course selection that can be reused by both the context provider and other components if needed.
 */
export function useCourseSelection() {
	// State for the currently selected course
	const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

	// State to control the course picker visibility. Used for:
	// 1. Onboarding Flow - automatically show the course picker for new users
	// 2. Carousel - show the course picker when user clicks `CoursePickerButton`
	const [showCoursePicker, setShowCoursePicker] = useState<boolean>(false);

	/**
	 * Centralized course selection handler that manages both state and persistence.
	 * This replaces the previous `handleCourseSelect` + event dispatch system.
	 *
	 * @param courseId - The ID of the course to select
	 */
	const handleCourseSelect = (courseId: string) => {
		console.debug("useCourseSelection: Course selected:", courseId);

		// Validate input
		if (!courseId || typeof courseId !== "string") {
			console.warn("useCourseSelection: Invalid courseId provided:", courseId);
			return;
		}

		// Early return if same course is already selected
		if (courseId === selectedCourseId) {
			setShowCoursePicker(false);
			return;
		}

		// Update state (this will automatically trigger re-renders in all consuming components)
		setSelectedCourseId(courseId);

		// Also store in local storage to persist selection across page reloads
		localStorage.setItem("activeCourseId", courseId);

		// Close course picker after a short delay
		setTimeout(() => {
			setShowCoursePicker(false);
		}, 500);
	};

	// Load initial state from localStorage on mount
	useEffect(() => {
		const loadInitialState = () => {
			// Check if we need to show the course picker (coming from onboarding)
			const shouldShowCoursePicker = localStorage.getItem("showCoursePicker") === "true";
			if (shouldShowCoursePicker) {
				// Clear the flag so it doesn't show again on refresh
				localStorage.removeItem("showCoursePicker");
				setShowCoursePicker(true);
			}

			// Load the previously selected course from localStorage
			const storedCourseId = localStorage.getItem("activeCourseId");
			if (storedCourseId) {
				setSelectedCourseId(storedCourseId);
			}
		};

		loadInitialState();
	}, []);

	// Memoize the return value to prevent unnecessary re-renders
	const courseSelectionState = useMemo(
		() => ({
			selectedCourseId,
			showCoursePicker,
			setShowCoursePicker,
			handleCourseSelect,
		}),
		[selectedCourseId, showCoursePicker]
	);

	return courseSelectionState;
}
