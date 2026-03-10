/**
 * Debug utility to verify score calculations
 */
export function verifyScoreCalculation(
	correctAnswers: number,
	totalQuestions: number,
	completedActivities: { isCorrect: boolean; activityId: string }[]
): void {
	console.log("===== TEST SCORE CALCULATION DEBUG =====");
	console.log(`Total questions: ${totalQuestions}`);
	console.log(`Correct answers counted: ${correctAnswers}`);

	// Calculate the score
	const calculatedScore = Math.min(100, Math.round((correctAnswers / totalQuestions) * 100));
	console.log(`Calculated score: ${calculatedScore}%`);

	// Verify against completed activities
	const activitiesCorrect = completedActivities.filter((a) => a.isCorrect).length;
	const alternativeScore = Math.min(100, Math.round((activitiesCorrect / totalQuestions) * 100));
	console.log(`Completed activities: ${completedActivities.length}`);
	console.log(`Completed activities correct: ${activitiesCorrect}`);
	console.log(`Alternative score calculation: ${alternativeScore}%`);

	if (calculatedScore !== alternativeScore) {
		console.warn("⚠️ SCORE CALCULATION MISMATCH! This indicates a problem in score tracking.");
	} else {
		console.log("✅ Score calculations match.");
	}

	console.log("Activity details:");
	completedActivities.forEach((activity, index) => {
		console.log(
			`${index + 1}: ${activity.activityId.substring(0, 8)}... - ${
				activity.isCorrect ? "Correct ✓" : "Incorrect ✗"
			}`
		);
	});
	console.log("=====================================");
}
