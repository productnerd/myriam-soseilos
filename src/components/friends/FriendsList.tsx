import React, { useEffect } from "react";
import { useFriends } from "@/hooks/friends/useFriends";
import FriendCard from "./FriendCard";
import FriendsLoadingState from "./FriendsLoadingState";
import FriendsErrorState from "./FriendsErrorState";

const FriendsList: React.FC = () => {
	const { friends, isLoading, isError, refetch, removeFriend } = useFriends();

	useEffect(() => {
		refetch();
	}, [refetch]);

	if (isLoading) {
		return <FriendsLoadingState />;
	}

	if (isError) {
		return <FriendsErrorState onRetry={refetch} />;
	}

	if (!friends || friends.length === 0) {
		return null;
	}

	return (
		<div className="space-y-3">
			{friends.map((friend) => (
				<FriendCard key={friend.id} friend={friend} onRemove={removeFriend} />
			))}
		</div>
	);
};

export default FriendsList;
