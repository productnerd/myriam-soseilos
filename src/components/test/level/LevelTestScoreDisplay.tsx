import React from "react";
import TopPerformerBadge from "../completion/TopPerformerBadge";

interface LevelTestScoreDisplayProps {
	finalScore: number;
	passed: boolean;
	scorePercentile?: 1 | 5 | 10 | null;
}

const LevelTestScoreDisplay: React.FC<LevelTestScoreDisplayProps> = ({
	finalScore,
	passed,
	scorePercentile,
}) => {
	// Ensure score is capped at 100%
	const displayScore = Math.min(100, finalScore);

	return (
		<div
			className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${
				passed ? "bg-primary/10 border-primary" : "bg-muted/10 border-muted"
			}`}
		>
			<div className="flex flex-col items-center">
				<h1
					className={`text-4xl font-bold ${
						passed
							? "text-primary"
							: displayScore >= 70
							? "text-amber-500"
							: "text-red-500"
					}`}
				>
					{displayScore}%
				</h1>
				{passed && scorePercentile && (
					<TopPerformerBadge percentile={scorePercentile} className="mt-1" />
				)}
			</div>
		</div>
	);
};

export default LevelTestScoreDisplay;
