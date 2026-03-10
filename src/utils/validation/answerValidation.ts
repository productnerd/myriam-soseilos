// Initialize the pipeline for text similarity using a model better suited for exact matching
const classificationPipeline: any = null;

export interface AnswerValidationResult {
	isCorrect: boolean;
	confidence: number;
	reasoning?: string;
}

// Calculate Levenshtein distance for typo detection
const calculateEditDistance = (str1: string, str2: string): number => {
	const matrix = Array(str2.length + 1)
		.fill(null)
		.map(() => Array(str1.length + 1).fill(null));

	for (let i = 0; i <= str1.length; i++) {
		matrix[0][i] = i;
	}

	for (let j = 0; j <= str2.length; j++) {
		matrix[j][0] = j;
	}

	for (let j = 1; j <= str2.length; j++) {
		for (let i = 1; i <= str1.length; i++) {
			const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
			matrix[j][i] = Math.min(
				matrix[j][i - 1] + 1, // deletion
				matrix[j - 1][i] + 1, // insertion
				matrix[j - 1][i - 1] + indicator // substitution
			);
		}
	}

	return matrix[str2.length][str1.length];
};

// Check for typos using edit distance
const isCloseMatch = (userAnswer: string, correctAnswer: string): boolean => {
	const userNormalized = userAnswer.trim().toLowerCase();
	const correctNormalized = correctAnswer.trim().toLowerCase();

	// Skip typo check for very short answers (less than 3 characters)
	if (correctNormalized.length < 3) {
		return false;
	}

	const editDistance = calculateEditDistance(userNormalized, correctNormalized);
	const maxLength = Math.max(userNormalized.length, correctNormalized.length);

	// Allow 1-2 character differences based on word length
	let allowedDistance: number;
	if (maxLength <= 4) {
		allowedDistance = 1; // Very short words: 1 typo max
	} else if (maxLength <= 8) {
		allowedDistance = 2; // Medium words: 2 typos max
	} else {
		allowedDistance = Math.floor(maxLength * 0.2); // Longer words: 20% error tolerance
	}

	console.log(
		`🔤 Typo check: "${userNormalized}" vs "${correctNormalized}" - Distance: ${editDistance}, Allowed: ${allowedDistance}`
	);

	return editDistance <= allowedDistance;
};

export const validateTextAnswer = async (
	userAnswer: string,
	correctAnswer: string
): Promise<AnswerValidationResult> => {
	console.log("🔍 Starting answer validation:", {
		userAnswer,
		correctAnswer,
		userAnswerType: typeof userAnswer,
		correctAnswerType: typeof correctAnswer,
	});

	try {
		// First, try exact match (case-insensitive)
		const userAnswerNormalized = userAnswer.trim().toLowerCase();
		const correctAnswerNormalized = correctAnswer.trim().toLowerCase();

		if (userAnswerNormalized === correctAnswerNormalized) {
			console.log("✅ Exact match found");
			return {
				isCorrect: true,
				confidence: 1.0,
				reasoning: "Exact match",
			};
		}

		// Check for typos using edit distance
		if (isCloseMatch(userAnswer, correctAnswer)) {
			console.log("✅ Close match found (typo tolerance)");
			return {
				isCorrect: true,
				confidence: 0.95,
				reasoning: "Close match with typo tolerance",
			};
		}

		// Check if user answer contains the correct answer
		if (userAnswerNormalized.includes(correctAnswerNormalized)) {
			console.log("✅ User answer contains correct answer");
			return {
				isCorrect: true,
				confidence: 0.9,
				reasoning: "Answer contained within user response",
			};
		}

		// For numeric answers, try to parse and compare
		const userNum = parseFloat(userAnswer.trim());
		const correctNum = parseFloat(correctAnswer.trim());

		if (!isNaN(userNum) && !isNaN(correctNum)) {
			const isNumericMatch = userNum === correctNum;
			console.log(isNumericMatch ? "✅ Numeric match found" : "❌ Numeric values differ");
			return {
				isCorrect: isNumericMatch,
				confidence: 1.0,
				reasoning: isNumericMatch ? "Numeric match" : "Numeric values differ",
			};
		}

		// Check for obvious mismatches (gibberish, very different lengths, etc.)
		if (isGibberish(userAnswer)) {
			console.log("❌ User answer appears to be gibberish");
			return {
				isCorrect: false,
				confidence: 1.0,
				reasoning: "Answer appears to be random text",
			};
		}

		// Check for number word mappings
		const numberWords: Record<string, number> = {
			zero: 0,
			one: 1,
			two: 2,
			three: 3,
			four: 4,
			five: 5,
			six: 6,
			seven: 7,
			eight: 8,
			nine: 9,
			ten: 10,
		};

		const userWordToNum = numberWords[userAnswerNormalized];
		const correctWordToNum = numberWords[correctAnswerNormalized];

		// If user typed a number word and correct answer is a digit, compare them
		if (userWordToNum !== undefined && !isNaN(correctNum)) {
			const isWordNumMatch = userWordToNum === correctNum;
			console.log(
				isWordNumMatch
					? "✅ Number word to digit match"
					: "❌ Number word to digit mismatch"
			);
			return {
				isCorrect: isWordNumMatch,
				confidence: 1.0,
				reasoning: isWordNumMatch
					? "Number word matches digit"
					: "Number word does not match digit",
			};
		}

		// If correct answer is a number word and user typed a digit, compare them
		if (correctWordToNum !== undefined && !isNaN(userNum)) {
			const isDigitWordMatch = userNum === correctWordToNum;
			console.log(
				isDigitWordMatch
					? "✅ Digit to number word match"
					: "❌ Digit to number word mismatch"
			);
			return {
				isCorrect: isDigitWordMatch,
				confidence: 1.0,
				reasoning: isDigitWordMatch
					? "Digit matches number word"
					: "Digit does not match number word",
			};
		}

		// Both are number words
		if (userWordToNum !== undefined && correctWordToNum !== undefined) {
			const isWordWordMatch = userWordToNum === correctWordToNum;
			console.log(
				isWordWordMatch
					? "✅ Number word to number word match"
					: "❌ Number word to number word mismatch"
			);
			return {
				isCorrect: isWordWordMatch,
				confidence: 1.0,
				reasoning: isWordWordMatch ? "Number words match" : "Number words do not match",
			};
		}

		// If no match found, return false
		return {
			isCorrect: false,
			confidence: 1.0,
			reasoning: "No match found",
		};
	} catch (error) {
		console.error("❌ Error during validation:", error);
		console.error("❌ Error details:", {
			message: error.message,
			stack: error.stack,
			name: error.name,
		});

		// If validation fails completely, fall back to exact string comparison
		const isExactMatch = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
		return {
			isCorrect: isExactMatch,
			confidence: 1.0,
			reasoning: `Validation failed, using exact match: ${isExactMatch}`,
		};
	}
};

// Helper function to detect gibberish/random text
const isGibberish = (text: string): boolean => {
	const cleaned = text.trim().toLowerCase();

	// Very short answers are likely not gibberish
	if (cleaned.length <= 3) {
		return false;
	}

	// Check for patterns that suggest gibberish
	const gibberishPatterns = [
		/^[a-z]{8,}$/, // Long strings without spaces or punctuation
		/[;]{2,}/, // Multiple semicolons
		/[^a-z0-9\s.,!?'-]/i, // Unusual characters
		/^[a-z]*[;:]{1,}[a-z]*$/i, // Text with semicolons/colons in the middle
	];

	return gibberishPatterns.some((pattern) => pattern.test(cleaned));
};

// Utility function to check if answer validation should be used - only for text_input
export const shouldUseAIValidation = (activityType: string): boolean => {
	const normalizedType = activityType.toLowerCase();
	console.log("🔧 Checking if should use AI validation for type:", normalizedType);

	// Only use AI validation for text_input type
	const shouldUse = normalizedType === "text_input";

	console.log("🔧 Should use AI validation:", shouldUse);
	return shouldUse;
};
