import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { ArrowRight, RotateCcw } from "lucide-react";
import ShareInviteButton from "./ShareInviteButton";

interface CompletionActionsProps {
	handleContinue: () => void;
	isLevelTest?: boolean;
	passed?: boolean;
	onRetry?: () => void;
}

const CompletionActions: React.FC<CompletionActionsProps> = ({
	handleContinue,
	isLevelTest = false,
	passed = false,
	onRetry,
}) => {
	const showRetry = isLevelTest && !passed && typeof onRetry === "function";

	return (
		<div className="flex flex-col w-full max-w-sm gap-3 mt-4">
			{/* Primary action button */}
			<Button onClick={handleContinue} size="lg" className="w-full">
				Continue
				<ArrowRight className="ml-2 h-4 w-4" />
			</Button>

			{/* Challenge Friend button - using the shared component */}
			<div className="mt-1">
				<ShareInviteButton className="w-full" />
			</div>

			{/* Retry button for failed level tests */}
			{showRetry && (
				<Button onClick={onRetry} variant="ghost" size="lg" className="w-full mt-1">
					<RotateCcw className="mr-2 h-4 w-4" />
					Try Again
				</Button>
			)}
		</div>
	);
};

export default CompletionActions;
