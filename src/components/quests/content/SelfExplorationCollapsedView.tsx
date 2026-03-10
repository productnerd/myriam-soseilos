import React from "react";
import { UserSidequest } from "@/types/user";
import { Badge } from "@/components/ui/data/Badge";
import { Button } from "@/components/ui/interactive/Button";
import { Eye, EyeOff, Lock, LockOpen } from "lucide-react";
import { useProfileData } from "@/hooks/profile/useProfileData";
import { Feather } from "@/lib/customIcons";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SelfExplorationCollapsedViewProps {
	quest: UserSidequest;
	isLocked: boolean;
	isHidden: boolean;
	topicColor: string;
	hasProgress: boolean;
	onToggleHidden: (quest: UserSidequest) => void;
	currentTab?: "active" | "hidden" | "inReview" | "completed" | "expired" | "locked";
}

const SelfExplorationCollapsedView: React.FC<SelfExplorationCollapsedViewProps> = ({
	quest,
	isLocked,
	isHidden,
	topicColor,
	hasProgress,
	onToggleHidden,
	currentTab = "active",
}) => {
	const { profile } = useProfileData(user?.id || null);

	// Check if topic is completed for the current user
	const { data: isTopicCompleted } = useQuery({
		queryKey: ["topicCompleted", quest?.self_exploration_quest?.topic_id, profile?.id],
		queryFn: async () => {
			if (!quest?.self_exploration_quest?.topic_id || !profile?.id) return false;

			const { data } = await supabase
				.from("user_completed_topics")
				.select("id")
				.eq("user_id", profile.id)
				.eq("topic_id", quest.self_exploration_quest.topic_id)
				.single();

			return !!data;
		},
		enabled:
			!!quest?.self_exploration_quest?.topic_id && !!profile?.id && currentTab === "locked",
	});

	const greyUnlock = quest?.self_exploration_quest?.grey_unlock;
	const userGreyPoints = profile?.grey_points || 0;
	const shouldShowLocked = isLocked || (greyUnlock && userGreyPoints < greyUnlock);
	const greyPointsNeeded =
		greyUnlock && userGreyPoints < greyUnlock ? greyUnlock - userGreyPoints : 0;

	const handleToggleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onToggleHidden(quest);
	};

	return (
		<div className={`px-4 pt-4 pb-4 ${shouldShowLocked ? "opacity-50" : ""} relative`}>
			{/* Topic badge at the top */}
			{quest?.self_exploration_quest?.topic && (
				<Badge
					variant="outline"
					className="text-xs mb-3 w-fit flex items-center gap-1"
					style={{
						borderColor: topicColor,
						color: topicColor,
						backgroundColor: `${topicColor}10`,
					}}
				>
					{currentTab === "locked" &&
						quest?.self_exploration_quest?.topic_id &&
						(isTopicCompleted ? (
							<LockOpen size={10} className="flex-shrink-0" />
						) : (
							<Lock size={10} className="flex-shrink-0" />
						))}
					{quest.self_exploration_quest.topic.title}
				</Badge>
			)}

			{/* Grey points needed countdown if applicable */}
			{greyPointsNeeded > 0 && (
				<Badge
					variant="secondary"
					className="text-xs px-2 py-1 flex items-center gap-1 mb-2"
					style={{
						backgroundColor: "rgba(55, 65, 81, 0.8)",
						color: "rgb(209, 213, 219)",
						borderColor: "rgb(75, 85, 99)",
						backdropFilter: "blur(4px)",
						border: "1px solid rgb(75, 85, 99)",
					}}
				>
					<Feather size={12} className="flex-shrink-0" />
					{greyPointsNeeded} to unlock
				</Badge>
			)}

			{/* Title and description */}
			<div className="text-left">
				<h1 className="font-semibold text-left mb-0.5">
					{quest?.self_exploration_quest?.title}
				</h1>
				<p className="text-sm text-muted-foreground text-left mb-1">
					{quest?.self_exploration_quest?.description}
				</p>
			</div>

			{/* Hide/Show button for active and hidden tabs */}
			{currentTab === "active" && !shouldShowLocked && (
				<Button
					variant="ghost"
					size="sm"
					onClick={handleToggleClick}
					className="absolute top-2 right-2 h-6 w-6 p-0 bg-black/40 hover:bg-black/60 rounded-full opacity-50"
				>
					{isHidden ? (
						<Eye className="h-2.5 w-2.5 text-white" />
					) : (
						<EyeOff className="h-2.5 w-2.5 text-white" />
					)}
				</Button>
			)}

			{currentTab === "hidden" && !shouldShowLocked && (
				<Button
					variant="ghost"
					size="sm"
					className="absolute top-2 right-2 h-5 w-5 p-0 bg-black/20 hover:bg-black/30 opacity-50"
					style={{
						borderWidth: "0.5px",
						borderColor: "rgba(139, 121, 94, 0.5)",
						border: "0.5px solid rgba(139, 121, 94, 0.5)",
					}}
					onClick={handleToggleClick}
				>
					<Eye className="h-2.5 w-2.5" style={{ color: "rgba(245, 245, 220, 0.5)" }} />
				</Button>
			)}
		</div>
	);
};

export default SelfExplorationCollapsedView;
