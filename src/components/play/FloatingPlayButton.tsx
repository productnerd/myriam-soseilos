import { useEffect, useState } from "react";
import { useInProgressCourses } from "@/hooks/courses/useInProgressCourses";
import { usePlayButton } from "@/hooks/ui/usePlayButton";
import { useFlowPoints } from "@/hooks/points/useFlowPoints";
import { useFlowPointsUtilities } from "@/hooks/flow/useFlowPointsUtilities";
import { useCourseCompletion } from "@/hooks/courses/useCourseCompletion";
import { useRequiredCourseContext } from "@/contexts/CourseContext";
import PlayButton from "@/components/play/PlayButton";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/overlay/Tooltip";
import MentorPopupWithButtons from "@/components/ui/MentorPopupWithButtons";
import { useUserContext } from "@/contexts/UserContext";

/**
 * This is the main play button that appears on the learn page.
 * When clicked, it navigates the user to their current topic for learning.
 *
 * Features:
 * - Uses the user's selected course from the carousel (via `CourseContext`)
 * - Provides clear feedback when selected course is not in-progress
 * - Disabled if user doesn't have sufficient flow points
 * - Shows countdown timer for flow point replenishment
 * - Handles loading states during navigation
 * - Shows completion popup when course is finished
 * - Animates transitions between states
 */
const FloatingPlayButton: React.FC = () => {
	const { user } = useUserContext();

	// Force re-render every second for the countdown timer display
	// This ensures the flow points countdown updates in real-time
	const [, setForceUpdate] = useState<number>(0);

	const [isMentorPopupOpen, setIsMentorPopupOpen] = useState<boolean>(false); // Used to track if the mentor popup should show
	const [isAnimatingOut, setIsAnimatingOut] = useState<boolean>(false); // Used to track if the mentor popup should animate

	// Use the course context to get the currently selected course from the carousel
	const { selectedCourseId } = useRequiredCourseContext();

	// Get in-progress courses to check if selected course is in progress
	const { data: inProgressCourses, isLoading: isLoadingInProgress } = useInProgressCourses(
		user!.id
	);

	// Check if selected course is in progress
	const isSelectedCourseInProgress = inProgressCourses?.some((c) => c.id === selectedCourseId);

	// Check if the selected course is completed (topics & tests)
	const { data: isCourseCompleted, isLoading: isCheckingCompletion } = useCourseCompletion(
		selectedCourseId,
		user!.id
	);

	// More robust check: course should only be considered "in progress" if it's actually in progress AND not completed
	// This prevents race conditions where a course appears in progress but is actually completed
	// This can happen because 'inProgressCourses' is cached data (5-minute stale time) whereas 'isCourseCompleted' is data coming from a fresh database query
	const isActuallyInProgress = isSelectedCourseInProgress && !isCourseCompleted;

	// Extract data from play button state
	// Track previous completion state to detect completion changes and trigger animations
	// This is needed to detect when a course is newly completed, rather than an already completed course
	// This means the user completes the course during a learning session (i.e. while in the app), not just when they visit the course roadmap page and the course is already completed
	const [isCoursePreviouslyCompleted, setIsCoursePreviouslyCompleted] = useState<
		boolean | undefined
	>(undefined);

	// Hook to get flow points balance and utilities for checking if user can start learning
	const { flowBalance, config } = useFlowPoints(user?.id || null);
	const { hasSufficientFlow, formatTimeUntilReplenishment } = useFlowPointsUtilities(flowBalance);

	// Hook that provides the click handler and loading state for the play button
	const playButtonState = usePlayButton(user!.id);
	const isNavigating = playButtonState?.isNavigating;
	const handleStartLearning = playButtonState?.handleStartLearning;

	// Effect 1: Update countdown timer every second
	// Purpose: Force re-render to update the flow points countdown display
	useEffect(() => {
		const interval = setInterval(() => {
			setForceUpdate((prev) => prev + 1);
		}, 1000);

		// Cleanup: Clear interval when component unmounts
		return () => clearInterval(interval);
	}, []);

	// Effect 2: Handle course completion state changes
	// Purpose: Trigger animations when transitioning between completed and incomplete states
	useEffect(() => {
		// On initial render (previous completion state is 'null' and current completion state is of 'boolean' type (i.e. data has been loaded and is not 'undefined')
		// Set the previous completion state to whatever the current completion state is
		if (isCoursePreviouslyCompleted === null && typeof isCourseCompleted === "boolean") {
			setIsCoursePreviouslyCompleted(isCourseCompleted);
			return;
		}
		// Only show popup if the course transitions from incomplete to complete (i.e. the user completes the course during a learning session)
		if (isCoursePreviouslyCompleted === false && isCourseCompleted) {
			setIsMentorPopupOpen(true);
		}
		// Always update the previous completion state so it's up-to-date for the next comparison
		// If a course gets completed (during a learning session), both states will be 'true'
		// If a course becomes incomplete (new topics are added), both states will be 'false'
		// This stops the popup from showing multiple times
		setIsCoursePreviouslyCompleted(isCourseCompleted);
	}, [isCourseCompleted, isCoursePreviouslyCompleted]);

	// Don't render if user details are not available yet
	if (!user) {
		return null;
	}

	// Don't show anything if still loading data
	if (isLoadingInProgress || isCheckingCompletion) {
		return null;
	}

	// Rendering Case 1: Selected course is newly completed - show completion popup
	// 'isMentorPopupOpen' is set to true when the course has been newly completed
	if (isMentorPopupOpen) {
		const handleClose = () => {
			setIsAnimatingOut(true);
			// Note that we reset the popup state AFTER the animation completes so that the popup component doesn't unmount before the animation finishes
			// Wait for the animation to complete (matches CSS animation duration) and then reset the animation state for future use
			setTimeout(() => {
				setIsMentorPopupOpen(false);
				setIsAnimatingOut(false);
			}, 1000);
		};

		// Handler for when user wants to be notified about new content
		const handleNotifyClick = () => {
			// TODO: Implement notification logic
			console.log("User wants to be notified");
			handleClose();
		};

		// Handler for when user declines notifications
		const handleNoThanksClick = () => {
			// TODO: Implement dismissal logic
			console.log("User declined notifications");
			handleClose();
		};

		return (
			<div className="fixed bottom-24 right-6 z-50">
				<MentorPopupWithButtons
					isOpen={isMentorPopupOpen}
					onClose={handleClose} // We also pass the close handler to the popup since the user can also close the popup manually
					title="Course Completed!"
					description="You have completed all topics but we are working on creating more. Would you like to be notified when the next is live?"
					actions={[
						{
							label: "Yes notify me!",
							variant: "default",
							onClick: handleNotifyClick,
							className: "bg-orange-500 hover:bg-orange-600 text-white",
						},
						{
							label: "Nah thanks",
							onClick: handleNoThanksClick,
							variant: "secondary",
							className: "bg-amber-100 hover:bg-amber-200 text-amber-800",
						},
					]}
					className={isAnimatingOut ? "animate-slide-out-down" : ""}
				/>
			</div>
		);
	}

	// Rendering Case 2: Selected course is in progress - show normal play button
	// This handles both cases where:
	// 1. The course is in progress
	// 2. The course is new but the user has completed/skipped the initial assessment
	if (isActuallyInProgress) {
		// The play button should be disabled if:
		// 1. The user doesn't have sufficient flow points OR
		// 2. The user is currently navigating to a new course (to prevent double-clicks)
		const isDisabled = !hasSufficientFlow || isNavigating;
		return (
			<div className="fixed bottom-24 right-6 z-50">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div>
								<PlayButton
									onClick={handleStartLearning}
									isLoading={isNavigating}
									disabled={isDisabled}
								/>
							</div>
						</TooltipTrigger>
						{!hasSufficientFlow && (
							<TooltipContent side="top">
								<p>
									You'll get {config.replenishAmount} Flow Points in{" "}
									{formatTimeUntilReplenishment()}
								</p>
							</TooltipContent>
						)}
					</Tooltip>
				</TooltipProvider>
			</div>
		);
	}

	return null;
};

export default FloatingPlayButton;
