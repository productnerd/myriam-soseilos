import React, { useState } from "react";
import { useConfettiEffect } from "@/hooks/learning/useConfettiEffect";
import ScoreDistributionChart from "./ScoreDistributionChart";
import TestCompletionHeader from "./TestCompletionHeader";
import ScoreDisplay from "./ScoreDisplay";
import CompletionMessage from "./CompletionMessage";
import CompletionActions from "./CompletionActions";
import { useScorePercentile } from "@/hooks/analytics/useScorePercentile";
import { useTestFriendScores } from "@/hooks/test/useTestFriendScores";
import FriendScoreThumbnails from "./FriendScoreThumbnails";
import MentorPopup from "@/components/ui/MentorPopup";

interface TestCompletionViewProps {
	finalScore: number;
	handleContinue: () => void;
	testId: string | null;
	isLevelTest?: boolean;
	passed?: boolean;
	onRetry?: () => void;
}

const TestCompletionView: React.FC<TestCompletionViewProps> = ({
	finalScore,
	handleContinue,
	testId,
	isLevelTest = false,
	passed = false,
	onRetry,
}) => {
	const [showMentor, setShowMentor] = useState(true); // TODO: `showMentor` is never set

	// Show confetti ONLY for passing level tests
	if (isLevelTest && passed) {
		useConfettiEffect();
	}

	// Get score percentile for badge - ensure testId is valid
	const scorePercentile =
		typeof testId === "string" ? useScorePercentile(testId, finalScore) : null;

	// Get friend scores for this test - ensure testId is valid
	const { data: friendScores } =
		typeof testId === "string" ? useTestFriendScores(testId) : { data: null };

	// Ensure score is capped at 100%
	const displayScore = Math.min(100, finalScore);

	const getMentorMessage = () => {
		if (isLevelTest) {
			if (passed) {
				return "Excellent work! You've mastered this level. Ready for the next challenge?";
			} else {
				return "Don't worry, learning takes time. Review the material and try again when you're ready.";
			}
		} else {
			return "Well done on completing your test! Keep up the great work on your learning journey.";
		}
	};

	return (
		<div className="py-10 flex flex-col items-center text-center space-y-6">
			<TestCompletionHeader isLevelTest={isLevelTest} passed={passed} />

			<ScoreDisplay
				finalScore={displayScore}
				passed={passed}
				scorePercentile={scorePercentile}
			/>

			<CompletionMessage isLevelTest={isLevelTest} passed={passed} />

			{/* Friend score thumbnails - only render if we have valid data */}
			{testId && friendScores && friendScores.length > 0 && (
				<div className="w-full max-w-lg mt-2">
					<FriendScoreThumbnails friendScores={friendScores} userScore={displayScore} />
				</div>
			)}

			{/* Score distribution chart - use animation for level tests */}
			{testId && (
				<div className="w-full max-w-lg mt-2">
					<ScoreDistributionChart
						testId={testId}
						finalScore={displayScore}
						animated={isLevelTest}
					/>
				</div>
			)}

			<CompletionActions
				handleContinue={handleContinue}
				isLevelTest={isLevelTest}
				passed={passed}
				onRetry={onRetry}
			/>

			{/* Mentor popup */}
			<MentorPopup content={<p>{getMentorMessage()}</p>} isVisible={showMentor} />
		</div>
	);
};

export default TestCompletionView;
