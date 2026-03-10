import React from "react";
import { CheckCircle, XCircle, Brain } from "lucide-react";

interface AnswerFeedbackProps {
	isCorrect?: boolean;
	explanation: string;
	correctAnswer: string | null;
	aiValidationConfidence?: number;
}

const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
	isCorrect,
	explanation,
	correctAnswer,
	aiValidationConfidence,
}) => {
	// Only show feedback for gradable activities
	if (isCorrect === undefined) return null;

	return (
		<div
			className={`p-4 rounded-lg ${
				isCorrect
					? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
					: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
			}`}
		>
			{/* Result indicator */}
			<div className="flex items-center gap-3 mb-3">
				{isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
				<span className="font-medium">{isCorrect ? "Correct!" : "Incorrect"}</span>

				{/* Show AI validation indicator if available */}
				{aiValidationConfidence && (
					<div className="flex items-center gap-2 ml-auto">
						<Brain className="h-4 w-4" />
						<span className="text-sm">
							AI validated ({Math.round(aiValidationConfidence * 100)}%
							confidence)
						</span>
					</div>
				)}
			</div>

			{/* Correct answer display */}
			{!isCorrect && correctAnswer && (
				<div className="mb-3">
					<p className="text-sm">
						<span className="font-medium">Correct answer:</span> {correctAnswer}
					</p>
				</div>
			)}

			{/* Explanation */}
			{explanation && (
				<div>
					<p className="text-sm">
						<span className="font-medium">Explanation:</span> {explanation}
					</p>
				</div>
			)}
		</div>
	);
};

export default AnswerFeedback;
