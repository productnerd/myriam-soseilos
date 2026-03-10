import React, { useState } from "react";
import { Award, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/interactive/Button";
import ScoreDistributionChart from "@/components/test/completion/ScoreDistributionChart";
import { useTestStatistics } from "@/hooks/test/useTestStatistics";
import { useScorePercentile } from "@/hooks/analytics/useScorePercentile";
import { useTestFriendScores } from "@/hooks/test/useTestFriendScores";
import FriendScoreThumbnails from "@/components/test/completion/FriendScoreThumbnails";
import ShareInviteButton from "@/components/test/completion/ShareInviteButton";
import TopPerformerBadge from "@/components/test/completion/TopPerformerBadge";
import MentorPopup from "@/components/ui/MentorPopup";

interface InitialTestCompletionViewProps {
	finalScore: number;
	handleContinue: () => void;
	testId: string | null;
	courseColor?: string;
}

const InitialTestCompletionView: React.FC<InitialTestCompletionViewProps> = ({
	finalScore,
	handleContinue,
	testId,
	courseColor,
}) => {
	// TODO: `setShowMentor` is not used
	const [showMentor, setShowMentor] = useState(true);

	// Fetch test statistics to get the average score
	const { data: testStats } = useTestStatistics(testId);

	// Get score percentile for badge
	const scorePercentile = useScorePercentile(testId, finalScore);

	// Get friend scores for this test
	const { data: friendScores } = useTestFriendScores(testId);

	const getMentorMessage = () => {
		if (finalScore >= 80) {
			return "Great job on your assessment! You're off to a strong start. Ready to dive deeper into learning?";
		} else {
			return "Nice work completing your assessment! Every journey starts with a single step. Let's begin your learning adventure!";
		}
	};

	return (
		<div className="py-6 flex flex-col items-center text-center space-y-6">
			<div className="flex items-center gap-2">
				<Sparkles className="h-8 w-8 text-primary animate-pulse" />
				<Award className="h-12 w-12 text-primary" />
				<Sparkles className="h-8 w-8 text-primary animate-pulse" />
			</div>

			<h2 className="text-2xl font-bold">Assessment Completed!</h2>

			<div
				className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${
					finalScore >= 80
						? courseColor
							? `bg-${courseColor}/10 border-${courseColor}/80 animate-pulse`
							: "bg-primary/10 border-primary animate-pulse"
						: "bg-muted/10 border-muted"
				}`}
			>
				<div className="flex flex-col items-center">
					<h1
						className={`text-4xl font-bold ${
							courseColor ? `text-${courseColor}` : "text-primary"
						}`}
					>
						{finalScore}%
					</h1>
					{scorePercentile && (
						<TopPerformerBadge percentile={scorePercentile} className="mt-1" />
					)}
					{testStats?.score_average !== null && (
						<span className="text-xs text-muted-foreground mt-1">
							Avg: {testStats?.score_average?.toFixed(0) || "--"}%
						</span>
					)}
				</div>
			</div>

			{/* Friend score thumbnails */}
			{testId && friendScores && friendScores.length > 0 && (
				<div className="w-full max-w-lg mt-2">
					<FriendScoreThumbnails friendScores={friendScores} userScore={finalScore} />
				</div>
			)}

			{/* Score distribution chart - no animation for initial test completion */}
			{testId && (
				<div className="w-full max-w-lg mt-2">
					<ScoreDistributionChart
						testId={testId}
						finalScore={finalScore}
						courseColor={courseColor}
						animated={false}
					/>
				</div>
			)}

			<div className="flex flex-col gap-4 w-full max-w-md">
				<Button onClick={handleContinue} className="w-full" size="lg">
					Begin Learning
					<ArrowRight className="ml-2 h-4 w-4" />
				</Button>

				<ShareInviteButton className="w-full" />
			</div>

			{/* Mentor popup */}
			<MentorPopup content={<p>{getMentorMessage()}</p>} isVisible={showMentor} />
		</div>
	);
};

export default InitialTestCompletionView;
