// Test utility functions
export function validateTestScore(score: number): boolean {
	return score >= 0 && score <= 100;
}

export function calculateTestGrade(score: number): "A" | "B" | "C" | "D" | "F" {
	if (score >= 90) return "A";
	if (score >= 80) return "B";
	if (score >= 70) return "C";
	if (score >= 60) return "D";
	return "F";
}

export function isTestPassed(score: number): boolean {
	return score >= 70;
}
