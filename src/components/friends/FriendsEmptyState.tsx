import React from "react";

const FriendsEmptyState: React.FC = () => {
	return (
		<div className="text-center py-8">
			<p className="text-gray-500">You don't have any friends yet</p>
			<p className="text-sm text-gray-400 mt-1">Add friends using their email address</p>
		</div>
	);
};

export default FriendsEmptyState;
