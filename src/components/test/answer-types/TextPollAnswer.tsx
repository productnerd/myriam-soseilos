import React, { useState } from "react";
import { Activity } from "@/types/activity";
import { Textarea } from "@/components/ui/form/Textarea";
import { Button } from "@/components/ui/interactive/Button";

interface TextPollAnswerProps {
	activity: Activity;
	selectedAnswer: string;
	showFeedback: boolean;
	onAnswer: (answer: string) => void;
}

const TextPollAnswer: React.FC<TextPollAnswerProps> = ({
	activity,
	selectedAnswer,
	showFeedback,
	onAnswer,
}) => {
	const [inputValue, setInputValue] = useState<string>(selectedAnswer || "");

	const handleSubmit = () => {
		if (!showFeedback && inputValue.trim()) {
			onAnswer(inputValue);
		}
	};

	return (
		<div className="mt-4 space-y-2">
			<Textarea
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				placeholder="Type your answer here..."
				className={`
          focus:ring-0 focus:ring-offset-0 
          bg-muted/90 transition-all duration-300
          ${showFeedback ? "bg-primary/10 border-primary/30" : ""}
        `}
				disabled={showFeedback}
			/>

			{!showFeedback && (
				<div className="flex justify-start mt-2">
					<Button onClick={handleSubmit} disabled={!inputValue.trim()}>
						Submit
					</Button>
				</div>
			)}

			{showFeedback && (
				<div className="mt-4 p-4 bg-primary/10 rounded-md">
					<p className="text-sm font-medium">Your answer has been recorded.</p>
					<p className="text-sm text-muted-foreground mt-1">
						Thank you for sharing your thoughts!
					</p>
				</div>
			)}
		</div>
	);
};

export default TextPollAnswer;
