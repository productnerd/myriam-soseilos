import React from "react";

interface LevelTestHeaderProps {
	currentIndex: number;
	totalActivities: number;
}

const LevelTestHeader: React.FC<LevelTestHeaderProps> = ({ currentIndex, totalActivities }) => {
	return (
		<div className="flex items-center justify-between mb-4">
			<h2 className="text-xl font-semibold">Level Test</h2>
			<div className="text-sm text-muted-foreground">
				{currentIndex + 1} of {totalActivities}
			</div>
		</div>
	);
};

export default LevelTestHeader;
