import React, { useState } from "react";
import { Textarea } from "@/components/ui/form/Textarea";
import { Button } from "@/components/ui/interactive/Button";

interface TextInputUIProps {
	selectedAnswers: string[];
	onSubmit: (answer: string) => void;
	showFeedback: boolean;
	placeholder?: string;
	disabled?: boolean;
}

export const TextInputUI: React.FC<TextInputUIProps> = ({
	selectedAnswers,
	onSubmit,
	showFeedback,
	placeholder = "Type your answer here...",
	disabled = false,
}) => {
	const [inputValue, setInputValue] = useState<string>(selectedAnswers[0] || "");

	const handleSubmit = () => {
		if (!showFeedback && inputValue.trim() && !disabled) {
			onSubmit(inputValue);
		}
	};

	return (
		<div className="mt-4 space-y-2">
			<Textarea
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				placeholder={placeholder}
				className={`
					focus:ring-0 focus:ring-offset-0 
					bg-gray-100 text-gray-900 transition-all duration-300
					${showFeedback ? "bg-primary/10 border-primary/30" : ""}
				`}
				disabled={showFeedback || disabled}
			/>

			{!showFeedback && !disabled && (
				<div className="flex justify-start mt-2">
					<Button onClick={handleSubmit} disabled={!inputValue.trim()}>
						Submit
					</Button>
				</div>
			)}

			{showFeedback && (
				<div className="mt-4 p-4 bg-primary/10 rounded-md">
					<p className="text-sm font-medium">Your answer has been recorded.</p>
				</div>
			)}
		</div>
	);
};
