import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { FriendScore } from "@/types/tests";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/overlay/Tooltip";
import { Users } from "lucide-react";

interface FriendScoreThumbnailsProps {
	friendScores: FriendScore[];
	userScore: number;
}

const FriendScoreThumbnails: React.FC<FriendScoreThumbnailsProps> = ({
	friendScores,
	userScore,
}) => {
	if (!friendScores || friendScores.length === 0) {
		return null;
	}

	// Sort friends by score
	const sortedScores = [...friendScores].sort((a, b) => b.score - a.score);

	return (
		<div className="mt-4">
			<div className="flex items-center gap-2 mb-2">
				<Users className="h-4 w-4 text-muted-foreground" />
				<h3 className="text-sm text-muted-foreground">Friend Scores</h3>
			</div>

			<div className="flex flex-wrap justify-center gap-3">
				<TooltipProvider>
					{sortedScores.map((friend, index) => (
						<Tooltip key={friend.id || index}>
							<TooltipTrigger asChild>
								<div
									className={`flex flex-col items-center ${
										friend.score > userScore
											? "text-amber-500"
											: friend.score === userScore
											? "text-blue-500"
											: "text-gray-500"
									}`}
								>
									<Avatar className="h-10 w-10 border-2 border-current">
										<AvatarImage
											src={friend.avatar_url || ""}
											alt={friend.name || "Friend"}
										/>
										<AvatarFallback>
											{friend.name?.substring(0, 2) || "FR"}
										</AvatarFallback>
									</Avatar>
									<span className="text-xs mt-1 font-semibold">
										{friend.score}%
									</span>
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>{friend.name || "Friend"}</p>
							</TooltipContent>
						</Tooltip>
					))}
				</TooltipProvider>
			</div>
		</div>
	);
};

export default FriendScoreThumbnails;
