import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Badge } from "@/components/ui/data/Badge";

interface QuestTypeToggleProps {
	selectedType: "all" | "real-life-task" | "self-exploration-quiz";
	onTypeChange: (type: "all" | "real-life-task" | "self-exploration-quiz") => void;
	questTypeCounts: {
		"real-life-task": number;
		"self-exploration-quiz": number;
	};
	onTabChange?: (tab: string) => void;
}

const QuestTypeToggle: React.FC<QuestTypeToggleProps> = ({
	selectedType,
	onTypeChange,
	questTypeCounts,
	onTabChange,
}) => {
	const handleTypeChange = (type: "real-life-task" | "self-exploration-quiz") => {
		onTypeChange(type);
		// Switch to active tab when changing quest type
		if (onTabChange) {
			onTabChange("active");
		}
	};

	return (
		<div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-30 px-2 w-full max-w-md">
			<div className="bg-card/90 backdrop-blur-md border border-border rounded-full p-1 shadow-lg w-full">
				<div className="flex space-x-1">
					<Button
						variant={selectedType === "real-life-task" ? "default" : "ghost"}
						size="sm"
						onClick={() => handleTypeChange("real-life-task")}
						className="rounded-full px-2 sm:px-4 py-2 text-xs font-medium uppercase flex items-center gap-1 sm:gap-2 flex-1"
					>
						<span className="hidden sm:inline">REAL LIFE</span>
						<span className="sm:hidden">REAL</span>
						<Badge
							variant="secondary"
							className="text-xs px-1 sm:px-1.5 py-0.5 h-4 sm:h-5"
						>
							{questTypeCounts["real-life-task"]}
						</Badge>
					</Button>
					<Button
						variant={selectedType === "self-exploration-quiz" ? "default" : "ghost"}
						size="sm"
						onClick={() => handleTypeChange("self-exploration-quiz")}
						className="rounded-full px-2 sm:px-4 py-2 text-xs font-medium uppercase flex items-center gap-1 sm:gap-2 flex-1"
					>
						<span className="hidden sm:inline">SELF EXPLORATION</span>
						<span className="sm:hidden">SELF</span>
						<Badge
							variant="secondary"
							className="text-xs px-1 sm:px-1.5 py-0.5 h-4 sm:h-5"
						>
							{questTypeCounts["self-exploration-quiz"]}
						</Badge>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default QuestTypeToggle;
