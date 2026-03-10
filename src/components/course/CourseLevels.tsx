// TODO: This component is not used anywhere

import React from "react";
import { Skeleton } from "@/components/ui/data/Skeleton";
import LevelAccordion from "../test/level/LevelAccordion";
import { Level } from "@/types/level";

interface CourseLevelsProps {
	levels: Level[] | undefined;
	isLoading: boolean;
	error: unknown;
	courseId: string;
	courseColor?: string;
	levelCompletionMap?: Record<string, boolean>;
}

const CourseLevels: React.FC<CourseLevelsProps> = ({
	levels,
	isLoading,
	error,
	courseId,
	courseColor = "",
	levelCompletionMap = {},
}) => {
	if (isLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-12 w-full rounded-md" />
				<Skeleton className="h-64 w-full rounded-md" />
				<Skeleton className="h-12 w-full rounded-md" />
				<Skeleton className="h-64 w-full rounded-md" />
			</div>
		);
	}

	if (error) {
		return <div className="text-destructive">Error loading levels</div>;
	}

	if (!levels || levels.length === 0) {
		return <div className="text-muted-foreground">No levels found for this course</div>;
	}

	// Function to determine if the previous level is completed
	// First level is always considered to have a completed previous level
	const isPreviousLevelCompleted = (index: number): boolean => {
		if (index === 0) return true; // First level is always unlocked

		const previousLevel = levels[index - 1];
		return levelCompletionMap[previousLevel.id] || false;
	};

	return (
		<div className="space-y-6">
			{levels.map((level, index) => (
				<LevelAccordion
					key={level.id}
					level={level}
					courseColor={courseColor}
					courseId={courseId}
					previousLevelCompleted={isPreviousLevelCompleted(index)}
				/>
			))}
		</div>
	);
};

export default CourseLevels;
