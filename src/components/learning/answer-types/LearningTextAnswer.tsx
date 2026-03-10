import React, { useState } from "react";
import { Input } from "@/components/ui/form/Input";
import { Button } from "@/components/ui/interactive/Button";
import { validateTextAnswer, shouldUseAIValidation } from "@/utils/validation/answerValidation";
import { Loader2, AlertTriangle } from "lucide-react";
import ValidationLogs from "@/components/debug/ValidationLogs";

interface LearningTextAnswerProps {
	selectedAnswer: string;
	showFeedback: boolean;
	isCorrect?: boolean;
	correctAnswer: string;
	onAnswer: (
		answer: string,
		aiValidationResult?: {
			isCorrect: boolean;
			confidence: number;
			reasoning?: string;
		}
	) => void;
	activityType?: string;
	aiValidationResult?: {
		isCorrect: boolean;
		confidence: number;
		reasoning?: string;
	} | null;
}

const LearningTextAnswer: React.FC<LearningTextAnswerProps> = ({
	selectedAnswer,
	showFeedback,
	isCorrect: originalIsCorrect,
	correctAnswer,
	onAnswer,
	activityType = "text_input",
	aiValidationResult: externalAiValidationResult,
}) => {
	const [inputValue, setInputValue] = useState<string>(selectedAnswer);
	const [isValidating, setIsValidating] = useState(false);
	const [validationError, setValidationError] = useState<string | null>(null);
	const [validationLogs, setValidationLogs] = useState<string[]>([]);
	const [internalAiValidationResult, setInternalAiValidationResult] = useState<{
		isCorrect: boolean;
		confidence: number;
		reasoning?: string;
	} | null>(null);

	// Use external AI validation result if available, otherwise use internal one, otherwise fall back to original
	const aiValidationResult = externalAiValidationResult || internalAiValidationResult;
	const isCorrect = aiValidationResult ? aiValidationResult.isCorrect : originalIsCorrect;

	const handleSubmit = async () => {
		if (!showFeedback && inputValue.trim()) {
			setValidationError(null);
			setValidationLogs([]);
			setInternalAiValidationResult(null);

			// Check if we should use AI validation
			if (shouldUseAIValidation(activityType)) {
				setIsValidating(true);
				try {
					console.log(
						"[LearningTextAnswer] 🚀 Starting AI validation for LearningTextAnswer component"
					);
					setValidationLogs((prev) => [
						...prev,
						`🚀 Starting AI validation for LearningTextAnswer component`,
					]);
					setValidationLogs((prev) => [
						...prev,
						`📥 User Answer: "${inputValue.trim()}"`,
					]);
					setValidationLogs((prev) => [...prev, `📋 Correct Answer: "${correctAnswer}"`]);
					setValidationLogs((prev) => [...prev, `🔧 Activity Type: "${activityType}"`]);

					const validationResult = await validateTextAnswer(
						inputValue.trim(),
						correctAnswer
					);
					console.log(
						"[LearningTextAnswer] 🎉 AI validation completed successfully:",
						validationResult
					);
					setValidationLogs((prev) => [
						...prev,
						`🎉 AI validation completed successfully`,
					]);
					setValidationLogs((prev) => [
						...prev,
						`✅ Result: ${validationResult.isCorrect ? "CORRECT" : "INCORRECT"}`,
					]);
					setValidationLogs((prev) => [
						...prev,
						`📊 Confidence: ${(validationResult.confidence * 100).toFixed(1)}%`,
					]);
					setValidationLogs((prev) => [
						...prev,
						`💭 Reasoning: ${validationResult.reasoning}`,
					]);

					// Store the AI validation result
					setInternalAiValidationResult(validationResult);

					// Pass the AI validation result to the parent
					onAnswer(inputValue, validationResult);
				} catch (error) {
					console.error(
						"[LearningTextAnswer] 💥 AI validation failed in LearningTextAnswer:",
						error
					);
					setValidationLogs((prev) => [
						...prev,
						`💥 AI validation failed: ${error.message}`,
					]);
					setValidationError(`AI validation failed: ${error.message}`);
				} finally {
					setIsValidating(false);
				}
			} else {
				setValidationLogs((prev) => [
					...prev,
					`⚡ Skipping AI validation for activity type: ${activityType}`,
				]);
				onAnswer(inputValue);
			}
		}
	};

	return (
		<div className="space-y-4">
			<div className="mt-4 space-y-2">
				<Input
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="Type your answer here..."
					className={`transition-all duration-500 bg-muted/60 ${
						showFeedback
							? isCorrect
								? "border-green-500 bg-green-600/30 text-green-500 font-medium"
								: "border-red-500 bg-red-600/30 text-red-500 font-medium"
							: ""
					}`}
					onKeyDown={(e) => e.key === "Enter" && !isValidating && handleSubmit()}
					disabled={showFeedback || isValidating}
				/>

				{validationError && (
					<div className="flex items-center gap-2 text-red-500 text-sm">
						<AlertTriangle className="h-4 w-4" />
						{validationError}
					</div>
				)}

				{!showFeedback && (
					<div className="flex justify-start mt-2">
						<Button
							onClick={handleSubmit}
							disabled={!inputValue.trim() || isValidating}
							className="flex items-center gap-2"
						>
							{isValidating && <Loader2 className="h-4 w-4 animate-spin" />}
							{isValidating ? "Validating with AI..." : "Submit"}
						</Button>
					</div>
				)}

				{showFeedback && !isCorrect && (
					<div className="text-sm mt-2 text-green-500 font-medium">
						Correct answer: {correctAnswer}
					</div>
				)}

				<ValidationLogs logs={validationLogs} error={validationError} />
			</div>
		</div>
	);
};

export default LearningTextAnswer;
