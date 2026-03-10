import React, { useState } from "react";
import { Textarea } from "@/components/ui/form/Textarea";
import { Button } from "@/components/ui/interactive/Button";
import { Activity } from "@/types/activity";

interface LearningTextPollAnswerProps {
	activity: Activity;
	selectedAnswer: string;
	showFeedback: boolean;
	onAnswer: (answer: string) => void;
}

const LearningTextPollAnswer: React.FC<LearningTextPollAnswerProps> = ({
	activity,
	selectedAnswer,
	showFeedback,
	onAnswer,
}) => {
	const [inputValue, setInputValue] = useState<string>(selectedAnswer);

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

			<div className="text-center mt-6">
				<p className="text-xs text-muted-foreground italic">
					Your answer is not shared with friends. We store your answer in order to
					personalise your learning. Your data is securely stored and will not be shared
					with any third party.
				</p>
			</div>
		</div>
	);
};

export default LearningTextPollAnswer;
