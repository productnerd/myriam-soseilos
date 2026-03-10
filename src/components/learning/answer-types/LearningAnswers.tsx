import React from "react";
import { Activity } from "@/types/activity";
import LearningMultipleChoiceAnswer from "./LearningMultipleChoiceAnswer";
import LearningTrueFalseAnswer from "./LearningTrueFalseAnswer";
import LearningImageMultipleChoiceAnswer from "./LearningImageMultipleChoiceAnswer";
import LearningTextAnswer from "./LearningTextAnswer";
import LearningSortingAnswer from "./LearningSortingAnswer";
import LearningPollAnswer from "./LearningPollAnswer";
import LearningImagePollAnswer from "./LearningImagePollAnswer";
import LearningTextPollAnswer from "./LearningTextPollAnswer";
import LearningMythOrReality from "./LearningMythOrReality";
import LearningEduntainmentContent from "./LearningEduntainmentContent";
import LearningPairMatchingAnswer from "./LearningPairMatchingAnswer";

interface LearningAnswersProps {
	activity: Activity;
	selectedAnswer: string;
	showFeedback: boolean;
	isCorrect?: boolean;
	onAnswer: (answer: string) => void;
	aiValidationResult?: {
		isCorrect: boolean;
		confidence: number;
		reasoning?: string;
	} | null;
}

const LearningAnswers: React.FC<LearningAnswersProps> = ({
	activity,
	selectedAnswer,
	showFeedback,
	isCorrect,
	onAnswer,
	aiValidationResult,
}) => {
	// Add safety check for activity
	if (!activity) {
		return <div className="text-center text-muted-foreground">Loading activity...</div>;
	}

	const activityType = activity.type.toLowerCase();

	const renderActivityComponent = () => {
		switch (activityType) {
			case "multiple_choice":
				return (
					<LearningMultipleChoiceAnswer
						activity={activity}
						selectedAnswer={selectedAnswer}
						showFeedback={showFeedback}
						isCorrect={isCorrect}
						onAnswer={onAnswer}
					/>
				);

			case "true_false":
				return (
					<LearningTrueFalseAnswer
						selectedAnswer={selectedAnswer}
						showFeedback={showFeedback}
						isCorrect={isCorrect}
						correctAnswer={activity.correct_answer || ""}
						onAnswer={onAnswer}
					/>
				);

			case "image_multiple_choice":
				return (
					<LearningImageMultipleChoiceAnswer
						activity={activity}
						selectedAnswer={selectedAnswer}
						showFeedback={showFeedback}
						isCorrect={isCorrect}
						onAnswer={onAnswer}
					/>
				);

			case "text_input":
				return (
					<LearningTextAnswer
						selectedAnswer={selectedAnswer}
						showFeedback={showFeedback}
						isCorrect={isCorrect}
						correctAnswer={activity.correct_answer || ""}
						onAnswer={onAnswer}
						activityType={activity.type}
						aiValidationResult={aiValidationResult}
					/>
				);

			case "sorting":
				return (
					<LearningSortingAnswer
						activity={activity}
						selectedAnswer={selectedAnswer}
						showFeedback={showFeedback}
						isCorrect={isCorrect}
						onAnswer={onAnswer}
					/>
				);

			case "poll":
				return (
					<LearningPollAnswer
						activity={activity}
						selectedAnswer={selectedAnswer}
						showFeedback={showFeedback}
						onAnswer={onAnswer}
					/>
				);

			case "image_poll":
				return (
					<LearningImagePollAnswer
						activity={activity}
						selectedAnswer={selectedAnswer}
						showFeedback={showFeedback}
						onAnswer={onAnswer}
					/>
				);

			case "text_poll":
				return (
					<LearningTextPollAnswer
						activity={activity}
						selectedAnswer={selectedAnswer}
						showFeedback={showFeedback}
						onAnswer={onAnswer}
					/>
				);

			case "myth_or_reality":
				return (
					<LearningMythOrReality
						activity={activity}
						selectedAnswer={selectedAnswer}
						showFeedback={showFeedback}
						isCorrect={isCorrect}
						onAnswer={onAnswer}
					/>
				);

			case "eduntainment":
				return <LearningEduntainmentContent activity={activity} onAnswer={onAnswer} />;

			case "pair_matching":
				return (
					<LearningPairMatchingAnswer
						activity={activity}
						selectedAnswer={selectedAnswer}
						showFeedback={showFeedback}
						isCorrect={isCorrect}
						onAnswer={onAnswer}
					/>
				);

			default:
				return (
					<div className="text-center text-muted-foreground">
						Activity type "{activityType}" is not supported yet.
					</div>
				);
		}
	};

	return renderActivityComponent();
};

export default LearningAnswers;
