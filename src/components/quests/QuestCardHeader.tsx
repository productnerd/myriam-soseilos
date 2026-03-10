import React from "react";
import { Clock, Check, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/interactive/Button";
import { Badge } from "@/components/ui/data/Badge";
import { UserSidequest } from "@/types/user";

interface QuestCardHeaderProps {
	quest: UserSidequest;
	onToggleHidden?: (quest: UserSidequest) => void;
	isCompleted?: boolean;
	isPending?: boolean;
	isExpired?: boolean;
	isExpanded?: boolean;
	onToggleExpand?: () => void;
	currentTab?: "active" | "hidden" | "inReview" | "completed" | "expired";
}

const QuestCardHeader: React.FC<QuestCardHeaderProps> = ({
	quest,
	onToggleHidden,
	isCompleted,
	isPending,
	isExpired,
	isExpanded,
	onToggleExpand,
	currentTab = "active",
}) => {
	// Calculate if the quest is new (created within the last 24 hours)
	const isNew = () => {
		if (!quest.created_at) return false;
		const createdAt = new Date(quest.created_at);
		const now = new Date();
		const timeDiff = now.getTime() - createdAt.getTime();
		const hoursDiff = timeDiff / (1000 * 60 * 60);
		return hoursDiff < 24;
	};

	// Determine state badge visibility and properties
	const showStateBadge = quest.state !== "LIVE";
	const getStateBadgeIcon = () => {
		if (quest.state === "IN_REVIEW") return <Clock className="h-3 w-3 mr-1" />;
		if (quest.state === "COMPLETED") return <Check className="h-3 w-3 mr-1" />;
		return null;
	};

	const stateBadgeVariant =
		quest.state === "IN_REVIEW"
			? "outline"
			: quest.state === "COMPLETED"
			? "default"
			: "outline";
	const stateBadgeText =
		quest.state === "IN_REVIEW"
			? "In Review"
			: quest.state === "COMPLETED"
			? "Completed"
			: quest.state === "EXPIRED"
			? "Expired"
			: "";

	const handleBack = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onToggleExpand) {
			onToggleExpand();
		}
	};

	const handleHideClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onToggleHidden) {
			onToggleHidden(quest);
		}
	};

	return (
		<div className="flex justify-between items-center gap-2 mb-2">
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-2">
					{/* Show NEW badge for recently added quests */}
					{isNew() && (
						<Badge variant="destructive" className="text-[0.65rem] px-1 py-0">
							NEW
						</Badge>
					)}

					{/* Show state badge if not in LIVE state */}
					{showStateBadge && (
						<Badge
							variant={stateBadgeVariant as any}
							className="text-[0.65rem] px-1 py-0"
						>
							{getStateBadgeIcon()}
							{stateBadgeText}
						</Badge>
					)}
				</div>
			</div>

			<div className="flex items-center gap-2">
				{/* Hide button with icon - only show in active tab, if not expanded, and if not completed */}
				{currentTab === "active" && !isExpanded && !isCompleted && onToggleHidden && (
					<Button
						variant="ghost"
						size="sm"
						className="h-8 w-8 p-0 opacity-70 hover:opacity-100"
						onClick={handleHideClick}
					>
						<EyeOff className="h-4 w-4" />
					</Button>
				)}

				{isExpanded && (
					<Button variant="ghost" size="sm" className="text-xs" onClick={handleBack}>
						Back
					</Button>
				)}
			</div>
		</div>
	);
};

export default QuestCardHeader;
