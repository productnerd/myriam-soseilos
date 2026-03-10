import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import PageTransition from "@/components/ui/PageTransition";
import { useToast } from "@/hooks/ui/useToast";
import OnboardingTestContent from "@/components/onboarding/OnboardingTestContent";
import { useOnboardingAssessment } from "@/hooks/onboarding/useOnboardingAssessment";
import { useEffect } from "react";

const OnboardingTestPage = () => {
	// Get user from global context
	const { user } = useUserContext();

	const navigate = useNavigate();
	const { toast } = useToast();

	const {
		activities,
		isLoading,
		error,
		currentActivityIndex,
		selectedAnswer,
		showFeedback,
		isCorrect,
		testCompleted,
		finalScore,
		handleAnswerActivity,
		handleAdvanceActivity,
	} = useOnboardingAssessment(user!.id); // ProtectedRoute ensures user is not null

	// Handle assessment completion - navigate to learn page when test is completed
	useEffect(() => {
		if (testCompleted) {
			toast({
				title: "Assessment completed!",
				description: "Great job on completing your assessment.",
			});
			navigate("/learn");
		}
	}, [testCompleted, navigate, toast]);

	// Add a no-op mentor update handler since this page doesn't use the mentor popup
	const handleMentorUpdate = (show: boolean, message: string) => {
		// No-op for standalone test page
	};

	// Handle continue action (for error cases or manual navigation)
	const handleContinue = () => {
		navigate("/learn");
	};

	return (
		<PageTransition>
			<div className="container max-w-2xl mx-auto py-8">
				<OnboardingTestContent
					testActivities={activities}
					isLoading={isLoading}
					error={error}
					currentActivityIndex={currentActivityIndex}
					selectedAnswer={selectedAnswer}
					showFeedback={showFeedback}
					isCorrect={isCorrect}
					testCompleted={testCompleted}
					finalScore={finalScore}
					handleAnswerActivity={handleAnswerActivity}
					handleAdvanceActivity={handleAdvanceActivity}
					handleContinue={handleContinue}
					onMentorUpdate={handleMentorUpdate}
				/>
			</div>
		</PageTransition>
	);
};

export default OnboardingTestPage;
