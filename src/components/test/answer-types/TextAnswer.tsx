import React, { useState } from "react";
import { Input } from "@/components/ui/form/Input";
import { Button } from "@/components/ui/interactive/Button";
import { validateTextAnswer, shouldUseAIValidation } from "@/utils/validation/answerValidation";
import { Loader2, AlertTriangle } from "lucide-react";
import ValidationLogs from "@/components/debug/ValidationLogs";

interface TextAnswerProps {
	selectedAnswer: string;
	showFeedback: boolean;
	isCorrect: boolean;
	onAnswer: (answer: string) => void;
	correctAnswer?: string;
	activityType?: string;
}

const TextAnswer: React.FC<TextAnswerProps> = ({
	selectedAnswer,
	showFeedback,
	isCorrect,
	onAnswer,
	correctAnswer,
	activityType = "text_input",
}) => {
	const [inputValue, setInputValue] = useState<string>(selectedAnswer);
	const [isValidating, setIsValidating] = useState(false);
	const [validationError, setValidationError] = useState<string | null>(null);
	const [validationLogs, setValidationLogs] = useState<string[]>([]);

	const handleSubmit = async () => {
		if (!showFeedback && inputValue.trim() && correctAnswer) {
			setValidationError(null);
			setValidationLogs([]);

			// Check if we should use AI validation
			if (shouldUseAIValidation(activityType)) {
				setIsValidating(true);
				try {
					console.log("🚀 Starting AI validation for TextAnswer component");
					setValidationLogs((prev) => [
						...prev,
						`🚀 Starting AI validation for TextAnswer component`,
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
					console.log("🎉 AI validation completed successfully:", validationResult);
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

					onAnswer(inputValue);
				} catch (error) {
					console.error("💥 AI validation failed in TextAnswer:", error);
					setValidationLogs((prev) => [
						...prev,
						`💥 AI validation failed: ${error.message}`,
					]);
					setValidationError(`AI validation failed: ${error.message}`);
				} finally {
					setIsValidating(false);
				}
			} else {
				// For non-text types, just submit directly
				setValidationLogs((prev) => [
					...prev,
					`⚡ Skipping AI validation for activity type: ${activityType}`,
				]);
				onAnswer(inputValue);
			}
		}
	};

	return (
		<div className="mt-4 space-y-2">
			<Input
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				placeholder="Type your answer here..."
				className={`
          focus:ring-0 focus:ring-offset-0 
          bg-muted/90 transition-all duration-500
          ${
				showFeedback
					? isCorrect
						? "border-green-500 bg-green-600/50 text-green-400 font-medium hover:border-green-500"
						: "border-red-500 bg-red-600/50 text-red-400 font-medium hover:border-red-500"
					: ""
			}
        `}
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

			{showFeedback && !isCorrect && correctAnswer && (
				<div className="text-sm mt-2 text-green-400 font-medium">
					Correct answer: {correctAnswer}
				</div>
			)}

			<ValidationLogs logs={validationLogs} error={validationError} />
		</div>
	);
};

export default TextAnswer;
