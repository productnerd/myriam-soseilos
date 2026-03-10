import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FriendOnCourse } from "@/types/course";
import { useFriends } from "@/hooks/friends/useFriends";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/overlay/Tooltip";
import { getAvatarFallback } from "@/utils/ui/avatarUtils";

interface CourseFriendsProps {
	courseId: string;
}

const CourseFriends: React.FC<CourseFriendsProps> = ({ courseId }) => {
	const friendsData = useFriends();

	const { data: friendsOnCourse = [] } = useQuery<FriendOnCourse[]>({
		queryKey: ["friendsOnCourse", courseId],
		queryFn: async () => {
			if (!friendsData.friends || friendsData.friends.length === 0) return [];

			try {
				// Get all friend IDs
				const friendIds = friendsData.friends.map((friend) => friend.id);

				// Create a map of friend data for quick lookup
				const friendMap = friendsData.friends.reduce((acc, friend) => {
					acc[friend.id] = friend;
					return acc;
				}, {} as Record<string, (typeof friendsData.friends)[0]>);

				// Query for friend progress in this course
				const { data, error } = await supabase
					.from("user_progress")
					.select("user_id")
					.eq("course_id", courseId)
					.eq("status", "INPROGRESS")
					.in("user_id", friendIds);

				if (error) {
					console.error("Error fetching friends on course:", error);
					return [];
				}

				// Map the results using the friend data from our friendMap
				return (data || []).map((item) => {
					const friend = friendMap[item.user_id];
					return {
						user_id: item.user_id,
						profiles: {
							name: friend?.name || null,
							thumbnail: friend?.thumbnail || null,
						},
					};
				}) as FriendOnCourse[];
			} catch (err) {
				console.error("Error in friendsOnCourse query:", err);
				return [];
			}
		},
		enabled: !!friendsData.friends && friendsData.friends.length > 0,
	});

	const hasFriendsOnCourse = friendsOnCourse && friendsOnCourse.length > 0;

	if (!hasFriendsOnCourse) {
		return null;
	}

	return (
		<div className="flex -space-x-2">
			<TooltipProvider>
				{friendsOnCourse.slice(0, 5).map((friend, index) => (
					<Tooltip key={index}>
						<TooltipTrigger asChild>
							<Avatar className="h-7 w-7 border-2 border-background">
								<AvatarImage
									src={friend.profiles?.thumbnail || ""}
									alt={friend.profiles?.name || "Friend"}
								/>
								<AvatarFallback className="text-xs">
									{getAvatarFallback(friend.profiles?.name, null)}
								</AvatarFallback>
							</Avatar>
						</TooltipTrigger>
						<TooltipContent>
							<p>{friend.profiles?.name || "Friend"}</p>
						</TooltipContent>
					</Tooltip>
				))}

				{friendsOnCourse.length > 5 && (
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
								+{friendsOnCourse.length - 5}
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>{friendsOnCourse.length - 5} more friends</p>
						</TooltipContent>
					</Tooltip>
				)}
			</TooltipProvider>
		</div>
	);
};

export default CourseFriends;
