import React from "react";

const LearningEmptyState: React.FC = () => {
	return (
		<div className="text-center py-8">
			<h3 className="text-lg font-medium mb-2">No activities found</h3>
			<p className="text-muted-foreground">This topic doesn't have any activities yet.</p>
		</div>
	);
};

export default LearningEmptyState;
