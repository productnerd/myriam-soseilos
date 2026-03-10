import React from "react";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/layout/Card";
import { Badge } from "@/components/ui/data/Badge";
import { Sidequest } from "@/types/quests";
import { pointTypes } from "@/lib/ui";

interface UnlockedQuestCardProps {
	quest: Sidequest;
}

const UnlockedQuestCard: React.FC<UnlockedQuestCardProps> = ({ quest }) => {
	const { grey, dark } = pointTypes;

	return (
		<Card className={`hover:shadow-md transition-all hover:scale-[1.01]`}>
			<CardHeader className="pb-2">
				{quest.topic && (
					<Badge
						variant="outline"
						className="text-xs mb-1.5 w-fit"
						style={{
							borderColor: quest.topic.level?.course?.color || "#4B5563",
							color: quest.topic.level?.course?.color || "#4B5563",
							backgroundColor: `${quest.topic.level?.course?.color || "#4B5563"}10`,
						}}
					>
						{quest.topic.title}
					</Badge>
				)}
				<CardTitle className="text-lg">{quest.title}</CardTitle>
				<CardDescription className="text-sm mt-1">{quest.description}</CardDescription>
			</CardHeader>

			<CardFooter className="pt-0 flex justify-between items-center">
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-1">
						<grey.icon className={`h-4 w-4 ${grey.textColor}`} />
						<span className="text-sm font-medium">{quest.grey_token_reward}</span>
					</div>
					{quest.dark_token_reward > 0 && (
						<div className="flex items-center gap-1">
							<dark.icon className={`h-4 w-4 ${dark.textColor}`} />
							<span className="text-sm font-medium">{quest.dark_token_reward}</span>
						</div>
					)}
				</div>
			</CardFooter>
		</Card>
	);
};

export default UnlockedQuestCard;
