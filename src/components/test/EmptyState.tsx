import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { ArrowRight } from "lucide-react";

interface EmptyStateProps {
	message?: string;
	onSkip: () => void;
	buttonText?: string;
	hideSkipButton?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
	message = "No content available",
	onSkip,
	buttonText = "Start Course",
	hideSkipButton = false,
}) => {
	return (
		<div className="py-10 text-center space-y-4">
			<p className="text-muted-foreground">{message}</p>
			{!hideSkipButton && (
				<Button onClick={onSkip} className="mt-2">
					{buttonText}
					<ArrowRight className="ml-2 h-4 w-4" />
				</Button>
			)}
		</div>
	);
};

export default EmptyState;
