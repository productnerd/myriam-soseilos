import React, { useState } from "react";
import { Activity } from "@/types/activity";
import { getExplanationForAnswer } from "@/utils/activities/activityOperations";
import { Button } from "@/components/ui/interactive/Button";
import ActivityContainer from "@/components/activities/layout/ActivityContainer";

interface SampleInitialAssessmentFlowProps {
	activity: Activity;
}

const SampleInitialAssessmentFlow: React.FC<SampleInitialAssessmentFlowProps> = ({ activity }) => {
	const [selectedAnswer, setSelectedAnswer] = useState<string>("");
	const [showFeedback, setShowFeedback] = useState<boolean>(false);
	const [isCorrect, setIsCorrect] = useState<boolean>(false);
	const [completed, setCompleted] = useState<boolean>(false);

	const handleAnswer = (answer: string) => {
		setSelectedAnswer(answer);
		setShowFeedback(true);
		setIsCorrect(answer === activity.correct_answer);
	};

	const handleAdvance = () => {
		setCompleted(true);
	};

	const resetFlow = () => {
		setSelectedAnswer("");
		setShowFeedback(false);
		setIsCorrect(false);
		setCompleted(false);
	};

	// Ensure we have a valid explanation converted to string
	const explanation = getExplanationForAnswer(activity.explanation, selectedAnswer);

	if (completed) {
		return (
			<div className="flex flex-col items-center justify-center py-6 space-y-8">
				<div className="text-center space-y-4">
					<h2 className="text-2xl font-bold">Assessment Completed!</h2>
					<p className="text-muted-foreground">
						You've completed the initial assessment!
					</p>
				</div>
				<Button
					onClick={resetFlow}
					variant="secondary"
					className="flex items-center gap-2 mt-8"
				>
					Continue →
				</Button>
			</div>
		);
	}

	return (
		<ActivityContainer
			activity={activity}
			currentActivityIndex={0}
			totalActivities={1}
			selectedAnswer={selectedAnswer}
			showFeedback={showFeedback}
			isCorrect={isCorrect}
			onAnswer={handleAnswer}
			onAdvance={handleAdvance}
			explanation={explanation}
			flowType="initial"
		/>
	);
};

export default SampleInitialAssessmentFlow;
