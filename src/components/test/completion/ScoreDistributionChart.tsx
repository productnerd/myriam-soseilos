import React from "react";
import BasicScoreDistributionChart from "./BasicScoreDistributionChart";
import AnimatedScoreDistributionChart from "./AnimatedScoreDistributionChart";

// This is now a wrapper that determines which chart to render
interface ScoreDistributionChartProps {
	testId: string;
	finalScore: number;
	courseColor?: string;
	animated?: boolean;
}

const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({
	testId,
	finalScore,
	courseColor,
	animated = false,
}) => {
	// Choose the appropriate chart based on the animated prop
	if (animated) {
		return (
			<AnimatedScoreDistributionChart
				testId={testId}
				finalScore={finalScore}
				courseColor={courseColor}
			/>
		);
	}

	return (
		<BasicScoreDistributionChart
			testId={testId}
			finalScore={finalScore}
			courseColor={courseColor}
		/>
	);
};

export default ScoreDistributionChart;
