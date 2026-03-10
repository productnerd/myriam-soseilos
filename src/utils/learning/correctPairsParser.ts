import { MatchPair } from "@/types/learning";

export const getCorrectPairs = (correctAnswer: any): MatchPair[] => {
	try {
		let parsedAnswer: any = correctAnswer;

		// Handle different possible formats of correct_answer
		if (typeof parsedAnswer === "string") {
			try {
				parsedAnswer = JSON.parse(parsedAnswer);
			} catch {
				// If parsing fails, treat as old format
				return parsedAnswer
					.split(",")
					.map((pair: string) => {
						const [left, right] = pair.split("-");
						return {
							left: left?.trim() || "",
							right: right?.trim() || "",
						};
					})
					.filter((pair: MatchPair) => pair.left && pair.right);
			}
		}

		// If it's already an array
		if (Array.isArray(parsedAnswer)) {
			return parsedAnswer.map((pair: any) => {
				if (typeof pair === "string") {
					const [left, right] = pair.split("-");
					return { left: left?.trim() || "", right: right?.trim() || "" };
				}
				return pair;
			});
		}

		return [];
	} catch (error) {
		console.error("Error parsing correct answer:", error);
		return [];
	}
};
