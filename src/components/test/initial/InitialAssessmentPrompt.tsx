import React from "react";
import CourseAssessment from "@/components/course/actions/CourseAssessment";
import { useNavigate } from "react-router-dom";

interface InitialAssessmentPromptProps {
	isLoadingTest: boolean;
	testId: string | null;
	showInitialTest: boolean;
	selectedCourseId: string;
	onStartTest: () => void;
	onInitialTestComplete: () => void;
	onInitialTestSkip: () => void;
}

const InitialAssessmentPrompt: React.FC<InitialAssessmentPromptProps> = ({
	isLoadingTest,
	testId,
	showInitialTest,
	selectedCourseId,
	onStartTest,
	onInitialTestComplete,
	onInitialTestSkip,
}) => {
	const navigate = useNavigate();

	// Navigate to the test page when start button is clicked
	const handleStartTest = () => {
		if (testId) {
			// Direct navigation to test page with return URL
			navigate(`/test/${testId}?returnUrl=/learn&courseId=${selectedCourseId}`);
		} else {
			// Fallback to onStartTest if no testId
			onStartTest();
		}
	};

	// Only display the CourseAssessment card
	return (
		<CourseAssessment
			isLoadingTest={isLoadingTest}
			onStartTest={handleStartTest}
			courseId={selectedCourseId || null}
			testId={testId || null}
			onSkipTest={onInitialTestSkip}
		/>
	);
};

export default InitialAssessmentPrompt;
