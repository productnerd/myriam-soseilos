import React from "react";

interface CompletionMessageProps {
	isLevelTest: boolean;
	passed: boolean;
}

const CompletionMessage: React.FC<CompletionMessageProps> = ({ isLevelTest, passed }) => {
	return (
		<div className="text-center">
			<p className="text-muted-foreground mb-4">
				{isLevelTest
					? passed
						? "Congratulations! You've passed the level test and unlocked the next level."
						: ""
					: "Your score has been recorded and the statistics will be updated in the next 24 hours."}
			</p>
		</div>
	);
};

export default CompletionMessage;
