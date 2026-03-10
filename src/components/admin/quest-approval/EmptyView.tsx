import React from "react";

const EmptyView: React.FC = () => {
	return (
		<div className="flex flex-col items-center justify-center h-64 space-y-4">
			<p className="text-muted-foreground text-lg">No quest submissions found.</p>
			<p className="text-sm text-muted-foreground">
				Once users submit their quests for approval, they will appear here.
			</p>
		</div>
	);
};

export default EmptyView;
