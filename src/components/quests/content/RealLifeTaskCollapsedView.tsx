import React from "react";
import { UserSidequest } from "@/types/user";
import { Progress } from "@/components/ui/data/Progress";
import { Badge } from "@/components/ui/data/Badge";
import { useProfileData } from "@/hooks/profile/useProfileData";
import { Feather } from "@/lib/customIcons";
interface RealLifeTaskCollapsedViewProps {
	quest: UserSidequest;
	isLocked: boolean;
	topicColor: string;
	hasProgress: boolean;
	onToggleHidden: (quest: UserSidequest) => void;
}
const RealLifeTaskCollapsedView: React.FC<RealLifeTaskCollapsedViewProps> = ({
	quest,
	isLocked,
	topicColor,
	hasProgress,
	onToggleHidden,
}) => {
	const { profile } = useProfileData(user?.id || null);
	// Use ONLY the database icon from sidequests table
	const sidequestIcon = quest.sidequest?.icon;
	const greyUnlock = quest.sidequest?.grey_unlock;

	// Check if quest should be locked due to grey points requirement
	const userGreyPoints = profile?.grey_points || 0;
	const shouldShowLocked = isLocked || (greyUnlock && userGreyPoints < greyUnlock);
	const greyPointsNeeded =
		greyUnlock && userGreyPoints < greyUnlock ? greyUnlock - userGreyPoints : 0;
	return (
		<div className={`px-4 pt-2 pb-4 ${shouldShowLocked ? "opacity-50" : ""} relative`}>
			{/* For real-life quests with topic but no image/icon display - only if no image */}
			{!quest.sidequest?.image && !sidequestIcon}

			{/* Title and description with added top margin for spacing from image */}
			<div className="text-left mt-3">
				<h1 className="font-semibold text-left mb-0.5">{quest.sidequest?.title}</h1>
				<p className="text-sm text-muted-foreground text-left mb-1">
					{quest.sidequest?.description}
				</p>
			</div>

			{hasProgress && (
				<div className="mt-2 space-y-1">
					<div className="flex justify-between text-xs text-muted-foreground">
						<span>Progress</span>
						<span>{quest.progress}%</span>
					</div>
					<Progress
						value={quest.progress}
						className="h-2"
						indicatorClassName="bg-blue-500"
					/>
				</div>
			)}
		</div>
	);
};
export default RealLifeTaskCollapsedView;
