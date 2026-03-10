import React from "react";
import TestCompletionView from "./completion/TestCompletionView";

interface TestCompletionProps {
	finalScore: number;
	handleContinue: () => void;
	testId: string | null;
	isLevelTest?: boolean;
	passed?: boolean;
	onRetry?: () => void;
}

const TestCompletion: React.FC<TestCompletionProps> = (props) => {
	return <TestCompletionView {...props} />;
};

export default TestCompletion;
