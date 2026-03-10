import { memo, useEffect } from "react";
import PageTransition from "@/components/ui/PageTransition";
import FloatingPlayButton from "@/components/play/FloatingPlayButton";
import CourseRoadmap from "@/components/course/display/CourseRoadmap";
import { useLearnPageState } from "@/hooks/learn/useLearnPageState";
import InitialAssessmentPrompt from "@/components/test/initial/InitialAssessmentPrompt";
import { toast } from "sonner";
import { useBoundStore } from "@/store";

const MemoizedCourseRoadmap = memo(CourseRoadmap);
const MemoizedInitialAssessmentPrompt = memo(InitialAssessmentPrompt);

const LearnPage = () => {
	const {
		courses,
		isLoading,
		error,
		selectedCourseId,
		showInitialTest,
		courseStatus,
		courseColor,
		initialTest,
		isLoadingTest,
		handleStartInitialTest,
		handleInitialTestComplete,
		handleInitialTestSkip,
	} = useLearnPageState();

	const hasCompletedInitialTest = useBoundStore((state) => state.hasCompletedInitialTest);

	// Add debug logging to track loading states
	useEffect(() => {
		console.debug("[LearnPage] LearnPage state:", {
			isLoading,
			selectedCourseId,
			coursesCount: courses?.length,
			error: error?.message,
			courseStatus,
			showInitialTest,
			hasCompletedInitialTest,
		});
	}, [
		isLoading,
		selectedCourseId,
		courses,
		error,
		courseStatus,
		showInitialTest,
		hasCompletedInitialTest,
	]);

	// Handle any error state
	useEffect(() => {
		if (error) {
			toast.error("Failed to load course data. Please try refreshing the page.");
		}
	}, [error]);

	// Show error state if there's an error
	if (error && !isLoading) {
		return (
			<PageTransition>
				<div className="w-full pb-24 pt-4 relative">
					<div className="flex flex-col items-center justify-center h-64 space-y-4">
						<div className="text-center">
							<h2 className="text-xl font-semibold text-destructive mb-2">
								Failed to Load Courses
							</h2>
							<p className="text-muted-foreground mb-4">
								There was an error loading your learning data. Please try refreshing
								the page.
							</p>
							<button
								onClick={() => window.location.reload()}
								className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
							>
								Refresh Page
							</button>
						</div>
					</div>
					<FloatingPlayButton />
				</div>
			</PageTransition>
		);
	}

	const renderContent = () => {
		// Show loading spinner only for initial load
		if (isLoading && !courses) {
			return (
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
				</div>
			);
		}

		// If we have courses but no selected course, show course selection prompt
		if (courses && courses.length > 0 && !selectedCourseId) {
			return (
				<div className="flex flex-col items-center justify-center h-64 space-y-4">
					<div className="text-center">
						<h2 className="text-xl font-semibold mb-2">Select a Course</h2>
						<p className="text-muted-foreground">
							Choose a course from the header to start learning.
						</p>
					</div>
				</div>
			);
		}

		// If no courses available at all
		if (!isLoading && (!courses || courses.length === 0)) {
			return (
				<div className="flex flex-col items-center justify-center h-64 space-y-4">
					<div className="text-center">
						<h2 className="text-xl font-semibold mb-2">No Courses Available</h2>
						<p className="text-muted-foreground">
							There are no courses available at the moment. Please check back later.
						</p>
					</div>
				</div>
			);
		}

		// Normal content rendering when we have a selected course
		if (selectedCourseId) {
			const shouldShowAssessment =
				courseStatus === "NOT_STARTED" || (initialTest && !hasCompletedInitialTest);

			if (shouldShowAssessment && initialTest) {
				return (
					<MemoizedInitialAssessmentPrompt
						isLoadingTest={isLoadingTest}
						testId={initialTest?.id || null}
						showInitialTest={showInitialTest}
						selectedCourseId={selectedCourseId}
						onStartTest={handleStartInitialTest}
						onInitialTestComplete={handleInitialTestComplete}
						onInitialTestSkip={handleInitialTestSkip}
					/>
				);
			}

			return (
				<div className="mt-4">
					<MemoizedCourseRoadmap
						selectedCourseId={selectedCourseId}
						courseColor={courseColor}
					/>
				</div>
			);
		}

		// Fallback loading state
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		);
	};

	return (
		<PageTransition>
			<div className="w-full pb-24 pt-4 relative">
				{renderContent()}
				{selectedCourseId && <FloatingPlayButton />}
			</div>
		</PageTransition>
	);
};

export default memo(LearnPage);
