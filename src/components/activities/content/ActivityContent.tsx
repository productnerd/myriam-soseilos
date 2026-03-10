import { Activity } from "@/types/activity";
import LearningHeader from "@/components/learning/layout/LearningHeader";
import LearningAnswers from "@/components/learning/answer-types/LearningAnswers";
import AnswerFeedback from "@/components/learning/feedback/AnswerFeedback";

/**
 * This is the core activity display component that handles the actual activity rendering.
 * It's used by both review and topic flows in `ActivityContainer` to avoid code duplication.
 */
interface ActivityContentProps {
	activity: Activity;
	currentActivityIndex: number;
	totalActivities: number;
	selectedAnswer: string;
	showFeedback: boolean;
	isCorrect?: boolean; // Allow 'undefined' for non-gradable activities (polls, surveys etc.)
	onAnswer: (answer: string) => void;
	onAdvance: () => void;
	explanation?: string | Record<string, string>;
	aiValidationResult?: {
		isCorrect: boolean;
		confidence: number;
		reasoning?: string;
	} | null;
}

const ActivityContent: React.FC<ActivityContentProps> = ({
	activity,
	currentActivityIndex,
	totalActivities,
	selectedAnswer,
	showFeedback,
	isCorrect,
	onAnswer,
	onAdvance, // TODO: This is not used
	explanation,
	aiValidationResult,
}) => {
	// Convert explanation to string if it's an object
	const explanationText =
		typeof explanation === "string"
			? explanation
			: typeof explanation === "object" && explanation
			? explanation.default || Object.values(explanation)[0] || ""
			: "";

	// Use AI validation result if available, otherwise fall back to original
	const finalIsCorrect = aiValidationResult ? aiValidationResult.isCorrect : isCorrect;

	return (
		<div className="space-y-6 px-3">
			<LearningHeader
				activity={activity}
				currentActivityIndex={currentActivityIndex}
				totalActivities={totalActivities}
			/>

			<LearningAnswers
				activity={activity}
				selectedAnswer={selectedAnswer}
				showFeedback={showFeedback}
				isCorrect={finalIsCorrect}
				onAnswer={onAnswer}
				aiValidationResult={aiValidationResult}
			/>

			{/* Only show feedback for gradable activities (i.e. showFeedback is only set to true for gradable activities) */}
			{showFeedback && (
				<AnswerFeedback
					isCorrect={finalIsCorrect}
					explanation={explanationText}
					correctAnswer={activity.correct_answer}
					aiValidationConfidence={aiValidationResult?.confidence}
				/>
			)}
		</div>
	);
};

export default ActivityContent;
