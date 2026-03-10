import React, { useState } from "react";
import { useConfettiEffect } from "@/hooks/learning/useConfettiEffect";
import ScoreDistributionChart from "../completion/ScoreDistributionChart";
import { useScorePercentile } from "@/hooks/analytics/useScorePercentile";
import { useTestFriendScores } from "@/hooks/test/useTestFriendScores";
import FriendScoreThumbnails from "../completion/FriendScoreThumbnails";
import LevelTestHeader from "./LevelTestHeader";
import LevelTestScoreDisplay from "./LevelTestScoreDisplay";
import LevelTestActions from "./LevelTestActions";
import MentorPopup from "@/components/ui/MentorPopup";

interface LevelTestCompletionViewProps {
	finalScore: number;
	handleContinue: () => void;
	testId: string | null;
	passed?: boolean;
	onRetry?: () => void;
}

const LevelTestCompletionView: React.FC<LevelTestCompletionViewProps> = ({
	finalScore,
	handleContinue,
	testId,
	passed = false,
	onRetry,
}) => {
	const [showMentor, setShowMentor] = useState(true);

	// Show confetti ONLY when test is passed
	if (passed) {
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

	// Get the appropriate mentor message based on pass/fail
	const getMentorMessage = () => {
		if (passed) {
			return "Excellent work! You've mastered this level. Ready for the next challenge?";
		} else {
			return "Don't worry, learning takes time. Review the material and try again when you're ready.";
		}
	};

	return (
		<div className="py-10 flex flex-col items-center text-center space-y-6">
			<LevelTestHeader passed={passed} />

			<LevelTestScoreDisplay
				finalScore={displayScore}
				passed={passed}
				scorePercentile={scorePercentile}
			/>

			{/* Friend score thumbnails */}
			{testId && friendScores && friendScores.length > 0 && (
				<div className="w-full max-w-lg mt-2">
					<FriendScoreThumbnails friendScores={friendScores} userScore={displayScore} />
				</div>
			)}

			{/* Score distribution chart - with animation for level tests */}
			{testId && (
				<div className="w-full max-w-lg mt-2">
					<ScoreDistributionChart
						testId={testId}
						finalScore={displayScore}
						animated={true}
					/>
				</div>
			)}

			<LevelTestActions handleContinue={handleContinue} passed={passed} onRetry={onRetry} />

			{/* Mentor popup */}
			<MentorPopup content={<p>{getMentorMessage()}</p>} isVisible={showMentor} />
		</div>
	);
};

export default LevelTestCompletionView;
