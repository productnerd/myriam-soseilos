import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { RefreshCw, Loader2 } from "lucide-react";

interface SelfExplorationResultsActionsProps {
	hasAiResponse: boolean;
	isRegenerating: boolean;
	canRetake: boolean;
	onRefresh: () => void;
	onRetake: () => void;
	onClose: () => void;
}

const SelfExplorationResultsActions: React.FC<SelfExplorationResultsActionsProps> = ({
	hasAiResponse,
	isRegenerating,
	canRetake,
	onRefresh,
	onRetake,
	onClose,
}) => {
	return (
		<div className="flex gap-2">
			{/* Only show refresh button if we don't have ai_response */}
			{!hasAiResponse && (
				<Button variant="outline" onClick={onRefresh} disabled={isRegenerating}>
					{isRegenerating ? (
						<Loader2 className="h-4 w-4 mr-2 animate-spin" />
					) : (
						<RefreshCw className="h-4 w-4 mr-2" />
					)}
					Refresh
				</Button>
			)}
			{canRetake && (
				<Button variant="outline" onClick={onRetake}>
					<RefreshCw className="h-4 w-4 mr-2" />
					Retake
				</Button>
			)}
			<Button variant="outline" onClick={onClose}>
				Close
			</Button>
		</div>
	);
};

export default SelfExplorationResultsActions;
