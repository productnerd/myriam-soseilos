import React from "react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/overlay/Dialog";
import {
	SelfExplorationQuest,
	UserSelfExplorationQuest,
	SelfExplorationResult,
} from "@/types/self-exploration";
import SelfExplorationFlow from "@/components/quests/self-exploration/SelfExplorationFlow";
import SelfExplorationResultsScreen from "@/components/quests/self-exploration/results/SelfExplorationResultsScreen";
interface SelfExplorationQuestCardModalsProps {
	currentView: "card" | "flow" | "results";
	quest: SelfExplorationQuest;
	userQuest: UserSelfExplorationQuest;
	result: SelfExplorationResult | null;
	onFlowComplete: () => void;
	onClose: () => void;
	onRetake: () => void;
	onViewChange: (view: "card" | "flow" | "results") => void;
}
const SelfExplorationQuestCardModals: React.FC<SelfExplorationQuestCardModalsProps> = ({
	currentView,
	quest,
	userQuest,
	result,
	onFlowComplete,
	onClose,
	onRetake,
	onViewChange,
}) => {
	return (
		<>
			{/* Flow Modal */}
			<Dialog
				open={currentView === "flow"}
				onOpenChange={(open) => {
					console.log("Flow dialog open change:", open, "current view:", currentView);
					if (!open) {
						onViewChange("card");
					}
				}}
			>
				<DialogOverlay className="bg-black/50 backdrop-blur-sm" />
				<DialogContent
					hideCloseButton={true}
					className="max-w-2xl max-h-[90vh] overflow-y-2"
				>
					{currentView === "flow" && (
						<SelfExplorationFlow
							quest={quest}
							userQuest={userQuest}
							onComplete={onFlowComplete}
							onClose={onClose}
						/>
					)}
				</DialogContent>
			</Dialog>

			{/* Results Modal */}
			<Dialog
				open={currentView === "results"}
				onOpenChange={(open) => {
					console.log("Results dialog open change:", open, "current view:", currentView);
					if (!open) {
						onViewChange("card");
					}
				}}
			>
				<DialogOverlay className="bg-black/50 backdrop-blur-sm" />
				<DialogContent
					className="max-w-2xl max-h-[80vh] overflow-y-auto"
					hideCloseButton={true}
				>
					{currentView === "results" && (
						<SelfExplorationResultsScreen
							quest={quest}
							result={
								result
									? {
											...result,
											responses_data: result.responses_data as Record<
												string,
												any
											>,
									  }
									: null
							}
							onRetake={onRetake}
							onClose={onClose}
							canRetake={true}
						/>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};
export default SelfExplorationQuestCardModals;
