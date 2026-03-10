import React from "react";

const ReviewEmptyState: React.FC = () => {
	return (
		<div className="text-center py-8">
			<h3 className="text-lg font-medium mb-2">No review activities available</h3>
			<p className="text-muted-foreground">
				Great job! You're all caught up with your reviews. Come back later for more spaced
				repetition practice.
			</p>
		</div>
	);
};

export default ReviewEmptyState;
