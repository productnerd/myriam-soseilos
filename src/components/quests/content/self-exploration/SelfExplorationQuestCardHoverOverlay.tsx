import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Play, Eye, RefreshCw } from "lucide-react";

interface SelfExplorationQuestCardHoverOverlayProps {
	state: string;
	isHovered: boolean;
	isStartingQuest: boolean;
	isStartingRetake: boolean;
	onStart: () => void;
	onContinue: () => void;
	onViewResults: () => void;
	onRetake: () => void;
}

const SelfExplorationQuestCardHoverOverlay: React.FC<SelfExplorationQuestCardHoverOverlayProps> = ({
	state,
	isHovered,
	isStartingQuest,
	isStartingRetake,
	onStart,
	onContinue,
	onViewResults,
	onRetake,
}) => {
	// Get button content based on state
	const getButtonContent = () => {
		switch (state) {
			case "LIVE":
				return (
					<Button onClick={onStart} disabled={isStartingQuest} className="px-8 py-2">
						<Play className="h-4 w-4 mr-2" />
						{isStartingQuest ? "Starting..." : "Start"}
					</Button>
				);
			case "IN_PROGRESS":
				return (
					<Button onClick={onContinue} className="px-8 py-2">
						Continue
					</Button>
				);
			case "COMPLETED":
				return (
					<div className="flex flex-col gap-2">
						<Button onClick={onViewResults} className="px-6 py-2">
							<Eye className="h-4 w-4 mr-2" />
							Open Report
						</Button>
						<Button
							variant="outline"
							onClick={onRetake}
							disabled={isStartingRetake}
							className="px-6 py-2"
						>
							<RefreshCw className="h-4 w-4 mr-2" />
							{isStartingRetake ? "Starting..." : "Retake"}
						</Button>
					</div>
				);
			default:
				return null;
		}
	};

	if (!isHovered) return null;

	return (
		<div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-20">
			{getButtonContent()}
		</div>
	);
};

export default SelfExplorationQuestCardHoverOverlay;
