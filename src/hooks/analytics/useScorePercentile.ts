import { useTestStatistics } from "@/hooks/test/useTestStatistics";

/**
 * Calculate the percentile rank of a score based on the test score distribution
 */
export function useScorePercentile(testId: string | null | undefined, userScore: number) {
	// Safely handle the testId parameter - ensure it's a valid string
	const safeTestId = testId && typeof testId === "string" ? testId : null;

	// Only call useTestStatistics if we have a valid testId
	const { data: testStats } = useTestStatistics(safeTestId);

	// If no test stats or no distribution, return null
	if (!testStats?.score_distribution || Object.keys(testStats.score_distribution).length === 0) {
		return null;
	}

	// Calculate the total number of test takers
	const distribution = testStats.score_distribution;
	const totalTestTakers = Object.values(distribution).reduce((sum, count) => sum + count, 0);

	if (totalTestTakers === 0) return null;

	// Count how many test takers have a score less than or equal to the user's score
	let countBelow = 0;

	for (const [scoreStr, count] of Object.entries(distribution)) {
		const score = parseInt(scoreStr, 10);
		if (score <= userScore) {
			countBelow += count;
		}
	}

	// Calculate the percentile rank
	const percentileRank = (countBelow / totalTestTakers) * 100;

	// Determine which top percentile badge to show
	if (percentileRank >= 99) {
		return 1;
	} else if (percentileRank >= 95) {
		return 5;
	} else if (percentileRank >= 90) {
		return 10;
	}

	return null;
}
