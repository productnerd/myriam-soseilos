import React from "react";
import { Activity } from "@/types/activity";
import MultipleChoiceAnswer from "./answer-types/MultipleChoiceAnswer";
import TrueFalseAnswer from "./answer-types/TrueFalseAnswer";
import TextAnswer from "./answer-types/TextAnswer";
import SortingAnswer from "./answer-types/SortingAnswer";
import MythOrReality from "./answer-types/MythOrReality";
import PollAnswer from "./answer-types/PollAnswer";
import TextPollAnswer from "./answer-types/TextPollAnswer";
import ImageMultipleChoiceAnswer from "./answer-types/ImageMultipleChoiceAnswer";
import ImagePollAnswer from "./answer-types/ImagePollAnswer";
import EduntainmentContent from "./answer-types/EduntainmentContent";
import PairMatchingAnswer from "./answer-types/PairMatchingAnswer";

interface ActivityAnswersProps {
	activity: Activity;
	selectedAnswer: string;
	showFeedback: boolean;
	isCorrect: boolean;
	onAnswer: (answer: string) => void;
	onSubmit?: (isCorrect: boolean) => void;
	isLevelTest?: boolean; // TODO: Is this supposed to be involved in the logic?
}

const ActivityAnswers: React.FC<ActivityAnswersProps> = ({
	activity,
	selectedAnswer,
	showFeedback,
	isCorrect,
	onAnswer,
	onSubmit,
	isLevelTest = false,
}) => {
	// Ensure we have a valid activity type and normalize case
	const activityType = activity?.type?.toLowerCase() || "multiple_choice";

	// For eduntainment type, we need to handle differently since it doesn't use onAnswer
	if (activityType === "eduntainment") {
		return (
			<EduntainmentContent
				activity={activity}
				onSubmit={onSubmit}
				showFeedback={showFeedback}
				onAnswer={onAnswer}
			/>
		);
	}

	// For all other activity types
	switch (activityType) {
		case "multiple_choice":
			return (
				<MultipleChoiceAnswer
					activity={activity}
					selectedAnswer={selectedAnswer}
					isCorrect={isCorrect}
					showFeedback={showFeedback}
					onAnswer={onAnswer}
				/>
			);
		case "true_false":
			return (
				<TrueFalseAnswer
					selectedAnswer={selectedAnswer}
					isCorrect={isCorrect}
					showFeedback={showFeedback}
					onAnswer={onAnswer}
				/>
			);
		case "text_input":
			return (
				<TextAnswer
					selectedAnswer={selectedAnswer}
					correctAnswer={activity.correct_answer || ""}
					isCorrect={isCorrect}
					showFeedback={showFeedback}
					onAnswer={onAnswer}
					activityType={activity.type}
				/>
			);
		case "sorting":
			return (
				<SortingAnswer
					activity={activity}
					isCorrect={isCorrect}
					showFeedback={showFeedback}
					onAnswer={onAnswer}
				/>
			);
		case "myth_or_reality":
			return (
				<MythOrReality
					activity={activity}
					selectedAnswer={selectedAnswer}
					isCorrect={isCorrect}
					showFeedback={showFeedback}
					onAnswer={onAnswer}
				/>
			);
		case "poll":
			return (
				<PollAnswer
					activity={activity}
					selectedAnswer={selectedAnswer}
					showFeedback={showFeedback}
					onAnswer={onAnswer}
				/>
			);
		case "text_poll":
			return (
				<TextPollAnswer
					activity={activity}
					selectedAnswer={selectedAnswer}
					showFeedback={showFeedback}
					onAnswer={onAnswer}
				/>
			);
		case "image_multiple_choice":
			return (
				<ImageMultipleChoiceAnswer
					activity={activity}
					selectedAnswer={selectedAnswer}
					isCorrect={isCorrect}
					showFeedback={showFeedback}
					onAnswer={onAnswer}
				/>
			);
		case "image_poll":
			return (
				<ImagePollAnswer
					activity={activity}
					selectedAnswer={selectedAnswer}
					showFeedback={showFeedback}
					onAnswer={onAnswer}
				/>
			);
		case "pair_matching":
			return (
				<PairMatchingAnswer
					activity={activity}
					selectedAnswer={selectedAnswer}
					isCorrect={isCorrect}
					showFeedback={showFeedback}
					onAnswer={onAnswer}
				/>
			);
		default:
			// Fallback to multiple choice if no matching type is found
			console.warn(`Unknown activity type: ${activityType}, falling back to multiple choice`);
			return (
				<MultipleChoiceAnswer
					activity={activity}
					selectedAnswer={selectedAnswer}
					isCorrect={isCorrect}
					showFeedback={showFeedback}
					onAnswer={onAnswer}
				/>
			);
	}
};

export default ActivityAnswers;
