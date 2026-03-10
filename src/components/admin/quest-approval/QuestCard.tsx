import React from "react";
import { QuestSubmissionGroup } from "@/types/quests";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/layout/Card";
import { Badge } from "@/components/ui/data/Badge";
import { formatDistanceToNow } from "date-fns";
import { Trophy, Award } from "lucide-react";
import { pointTypes } from "@/lib/ui";

interface QuestCardProps {
	group: QuestSubmissionGroup;
	isSelected: boolean;
	onClick: () => void;
}

const QuestCard: React.FC<QuestCardProps> = ({ group, isSelected, onClick }) => {
	const { sidequest, pendingCount, totalCount, submissions } = group;

	// Get oldest submission time for "time ago" display
	const oldestPendingSubmission = submissions
		.filter((s) => s.status === "pending")
		.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];

	const timeAgo = oldestPendingSubmission
		? formatDistanceToNow(new Date(oldestPendingSubmission.created_at), { addSuffix: true })
		: null;

	const topicColor = sidequest.topic?.level?.course?.color || "gray";
	const { grey, dark } = pointTypes;

	return (
		<Card
			className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
				isSelected ? "border-primary ring-2 ring-primary/30" : "border-border"
			}`}
			onClick={onClick}
		>
			<CardHeader className="p-3">
				<div className="flex justify-between items-start mb-1">
					<div className="w-full">
						<div className="flex justify-between items-center mb-1">
							{sidequest.topic && (
								<Badge
									className="text-xs w-fit"
									style={{
										backgroundColor: `${topicColor}30`,
										color: topicColor,
										borderColor: topicColor,
									}}
								>
									{sidequest.topic.title}
								</Badge>
							)}
							{/* Show timeAgo at top right without "Submission age:" label */}
							{timeAgo && pendingCount > 0 && (
								<span className="text-xs text-muted-foreground">{timeAgo}</span>
							)}
						</div>
						<CardTitle className="text-sm font-medium truncate">
							{sidequest.title}
						</CardTitle>
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-3 pt-0 text-xs text-muted-foreground">
				{sidequest.instructions && (
					<div className="mb-2 text-xs text-primary-foreground bg-primary/10 p-2 rounded border border-primary/20">
						<strong>Instructions:</strong> {sidequest.instructions}
					</div>
				)}
				<p className="line-clamp-2 h-8">{sidequest.description}</p>
				<div className="flex items-center mt-2 space-x-2">
					<div className="flex items-center">
						<Trophy className={`h-4 w-4 mr-1 ${grey.textColor}`} />
						<span>{sidequest.grey_token_reward}</span>
					</div>
					<div className="flex items-center">
						<Award className={`h-4 w-4 mr-1 ${dark.textColor}`} />
						<span>{sidequest.dark_token_reward}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default QuestCard;
