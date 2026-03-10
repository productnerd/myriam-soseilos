import React, { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Sidequest } from "@/types/quests";
import UnlockedQuestCard from "./UnlockedQuestCard";
import { toast } from "sonner";
import { shouldShowToast } from "@/utils/ui/toastUtils";

interface UnlockedQuestsListProps {
	quests: Sidequest[];
	isLoading: boolean;
}

const UnlockedQuestsList: React.FC<UnlockedQuestsListProps> = ({ quests, isLoading }) => {
	// Show toast when quests are loaded
	useEffect(() => {
		if (!isLoading && quests.length > 0) {
			// Use the shouldShowToast utility to prevent duplicates
			const toastMessage = `${quests.length} new ${
				quests.length === 1 ? "quest" : "quests"
			} unlocked!`;

			if (shouldShowToast(toastMessage)) {
				// Use top-right position for quest unlocks
				toast.success(toastMessage, {
					position: "top-right",
				});
			}
		}
	}, [quests, isLoading]);

	if (isLoading) {
		return (
			<div className="w-full max-w-md">
				<h3 className="text-xl font-semibold mb-4 flex items-center">
					<Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
					Loading New Quests...
				</h3>
			</div>
		);
	}

	if (quests.length === 0) {
		return null;
	}

	return (
		<div className="w-full max-w-md">
			<h3 className="text-xl font-semibold mb-4 flex items-center">
				<Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
				{quests.length} New {quests.length === 1 ? "Quest" : "Quests"} Unlocked!
			</h3>
			<div className="space-y-4">
				{quests.map((quest) => (
					<UnlockedQuestCard key={quest.id} quest={quest} />
				))}
			</div>
		</div>
	);
};

export default UnlockedQuestsList;
