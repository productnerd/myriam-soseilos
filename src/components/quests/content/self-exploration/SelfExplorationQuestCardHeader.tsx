import React from "react";
import { Progress } from "@/components/ui/data/Progress";
import { SelfExplorationQuest } from "@/types/self-exploration";
import { supabase } from "@/integrations/supabase/client";

interface SelfExplorationQuestCardHeaderProps {
	quest: SelfExplorationQuest;
	state: string;
	currentQuestionIndex: number;
}

const SelfExplorationQuestCardHeader: React.FC<SelfExplorationQuestCardHeaderProps> = ({
	quest,
	state,
	currentQuestionIndex,
}) => {
	// Get proper storage URL for icon
	const getIconStorageUrl = (fileName: string) => {
		if (!fileName) return null;
		if (fileName.startsWith("http")) return fileName;
		const { data } = supabase.storage.from("icon-images").getPublicUrl(fileName);
		return data.publicUrl;
	};

	const iconUrl = quest.icon ? getIconStorageUrl(quest.icon) : null;

	// Calculate progress percentage based on answered questions only
	const progressPercentage =
		quest.questions && quest.questions.length > 0
			? (currentQuestionIndex / quest.questions.length) * 100
			: 0;

	return (
		<div className="flex-shrink-0 relative z-10">
			{/* Progress bar at the very top for in-progress quests */}
			{state === "IN_PROGRESS" && quest.questions && (
				<div className="mb-4">
					<Progress value={progressPercentage} className="h-2" />
				</div>
			)}

			{/* Icon centered horizontally and moved lower */}
			{iconUrl && (
				<div className="flex justify-center mb-4" style={{ marginTop: "24px" }}>
					<img
						src={iconUrl}
						alt="Quest icon"
						className="w-16 h-16 object-contain"
						onError={(e) => {
							console.error("Failed to load quest icon:", iconUrl);
							e.currentTarget.style.display = "none";
						}}
					/>
				</div>
			)}

			{/* Title centered and moved lower */}
			<div className="mb-4">
				<h1 className="text-2xl font-semibold leading-none tracking-tight text-center">
					{quest.title}
				</h1>
			</div>
		</div>
	);
};

export default SelfExplorationQuestCardHeader;
