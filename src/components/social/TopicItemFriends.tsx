// TODO: This component is not used anywhere

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/overlay/Tooltip";
import { useFriendProgress } from "@/hooks/friends/useFriendProgress";
import { getAvatarFallback } from "@/utils/ui/avatarUtils";

interface TopicItemFriendsProps {
	topicId: string;
}

const TopicItemFriends: React.FC<TopicItemFriendsProps> = ({ topicId }) => {
	const { data: friendsProgress, isLoading } = useFriendProgress();

	if (isLoading || !friendsProgress || friendsProgress.length === 0) {
		return null;
	}

	// Filter friends who are on this topic
	const friendsOnTopic = friendsProgress.filter((friend) => friend.currentTopicId === topicId);

	if (friendsOnTopic.length === 0) {
		return null;
	}

	// Only show up to 3 friends, with a +X indicator if there are more
	const displayedFriends = friendsOnTopic.slice(0, 3);
	const extraFriendsCount = friendsOnTopic.length - displayedFriends.length;

	return (
		<div className="mt-2 flex items-center">
			<span className="text-xs text-muted-foreground mr-2">Friends here:</span>
			<div className="flex -space-x-2">
				<TooltipProvider>
					{displayedFriends.map((friend) => (
						<Tooltip key={friend.userId}>
							<TooltipTrigger asChild>
								<Avatar className="h-6 w-6 border border-background">
									<AvatarImage
										src={friend.thumbnail || ""}
										alt={friend.name || "Friend"}
									/>
									<AvatarFallback className="text-xs">
										{getAvatarFallback(friend.name, null)}
									</AvatarFallback>
								</Avatar>
							</TooltipTrigger>
							<TooltipContent>
								<p>{friend.name || "Friend"}</p>
							</TooltipContent>
						</Tooltip>
					))}

					{extraFriendsCount > 0 && (
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border border-background">
									+{extraFriendsCount}
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>
									{extraFriendsCount} more{" "}
									{extraFriendsCount === 1 ? "friend" : "friends"}
								</p>
							</TooltipContent>
						</Tooltip>
					)}
				</TooltipProvider>
			</div>
		</div>
	);
};

export default TopicItemFriends;
