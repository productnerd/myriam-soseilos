import React from "react";
import { Award, Sparkles } from "lucide-react";

interface TestCompletionHeaderProps {
	isLevelTest: boolean;
	passed: boolean;
}

const TestCompletionHeader: React.FC<TestCompletionHeaderProps> = ({ isLevelTest, passed }) => {
	return (
		<>
			<div className="flex items-center gap-2">
				<Sparkles className="h-8 w-8 text-primary animate-pulse" />
				<Award className="h-12 w-12 text-primary" />
				<Sparkles className="h-8 w-8 text-primary animate-pulse" />
			</div>

			<h2 className="text-2xl font-bold">Test Completed!</h2>

			{isLevelTest && (
				<div
					className={`text-xl font-semibold p-2 px-6 rounded-full ${
						passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
					}`}
				>
					{passed ? "PASS" : "FAIL"}
				</div>
			)}
		</>
	);
};

export default TestCompletionHeader;
