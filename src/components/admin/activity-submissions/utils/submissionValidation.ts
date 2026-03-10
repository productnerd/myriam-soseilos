import { ActivitySubmission } from "@/types/activity";

export const validateSubmission = (submission: ActivitySubmission): string[] => {
	const errors: string[] = [];

	if (!submission.main_text.trim()) {
		errors.push("Question text is required");
	}

	if (["multiple_choice", "image_multiple_choice"].includes(submission.type)) {
		const options = getStringOptions(submission.options);
		if (options.length < 2) {
			errors.push("At least 2 options are required");
		}

		if (!submission.correct_answer) {
			errors.push("Correct answer is required");
		}
	}

	return errors;
};

export const getStringOptions = (options?: string[] | Record<string, any>[]): string[] => {
	if (!options) {
		return [];
	}

	// Handle different types of options
	if (Array.isArray(options)) {
		// If it's already an array, ensure all items are strings
		return options.map((opt) => (typeof opt === "string" ? opt : JSON.stringify(opt)));
	}

	// If we got here, options is not an array, return empty array
	console.warn("Unexpected options format:", options);
	return [];
};
