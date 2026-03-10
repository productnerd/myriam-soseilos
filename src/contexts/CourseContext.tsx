import React, { createContext, useContext } from "react";
import { useCourseSelection } from "@/hooks/courses/useCourseSelection";

/**
 * Context for managing course selection state across the application.
 *
 * This context replaces the previous event-based synchronization system with a single source of truth.
 *
 * Benefits:
 * - Single state instance shared across all components
 * - No need for custom events or manual synchronization
 * - More predictable and React-like state management
 * - Easier to debug and maintain
 */

interface CourseContextType {
	selectedCourseId: string | null;
	showCoursePicker: boolean;
	setShowCoursePicker: (show: boolean) => void;
	handleCourseSelect: (courseId: string) => void;
}

/**
 * Type for course context when a course is guaranteed to be selected.
 * This is used by useRequiredCourseContext to provide type safety.
 */
interface RequiredCourseContextType extends Omit<CourseContextType, "selectedCourseId"> {
	selectedCourseId: string; // Guaranteed to be a string, never null
}

// Create context
const CourseContext = createContext<CourseContextType | undefined>(undefined);

// Course Provider component that wraps the app and provides course selection state to all components without prop drilling
export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	// Use the course selection hook to manage all the logic
	const courseSelectionState = useCourseSelection();

	return <CourseContext.Provider value={courseSelectionState}>{children}</CourseContext.Provider>;
};

/**
 * Hook for accessing selected course from global context
 *
 * This hook is used when:
 * - The component can work without a selected course
 * - We need to show different UI based on whether a course is selected
 *
 * USAGE:
 * const { selectedCourseId, showCoursePicker, setShowCoursePicker, handleCourseSelect } = useCourseContext();
 *
 * EXAMPLES:
 * - Header component (shows course info or "Select a course" message when no course is selected)
 * - Course picker components (can show picker when no course is selected)
 * - Navigation components (can disable features when no course is selected)
 *
 * @returns The course context value (where 'selectedCourseId' can be null)
 * @throws Error if used outside of `CourseProvider`
 */
export const useCourseContext = (): CourseContextType => {
	const context = useContext(CourseContext);

	if (!context) {
		throw new Error("'useCourseContext' must be used within a CourseProvider");
	}

	return context;
};

/**
 * Custom hook that requires a selected course.
 * This hook is used when the component/hook absolutely needs a course to be selected.
 *
 * EXAMPLES:
 * - Data fetching hooks (useCurrentTopic, useTopicsByLevel) - require valid course ID
 * - Action handlers (usePlayButton, course completion logic)
 * - Learning flow components (that need course data to function)
 *
 * @returns The course context with guaranteed 'selectedCourseId' (never null)
 * @throws Error if no course is selected
 */
export const useRequiredCourseContext = (): RequiredCourseContextType => {
	const context = useCourseContext();

	if (!context.selectedCourseId) {
		throw new Error("No course selected. Please select a course first.");
	}

	return context as RequiredCourseContextType;
};
