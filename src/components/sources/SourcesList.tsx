import React from "react";
import { Source } from "@/types/sources";
import SourceCard from "./SourceCard";
import { Skeleton } from "@/components/ui/data/Skeleton";

interface SourcesListProps {
	sources: Source[] | undefined;
	isLoading: boolean;
	error: unknown;
}

const SourcesList: React.FC<SourcesListProps> = ({ sources, isLoading, error }) => {
	if (isLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-32 w-full" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center text-destructive p-4">
				Error loading sources. Please try again.
			</div>
		);
	}

	if (!sources || sources.length === 0) {
		return (
			<div className="text-center text-muted-foreground p-4">
				No sources available for this course.
			</div>
		);
	}

	return (
		<div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
			{sources.map((source) => (
				<SourceCard key={source.id} source={source} />
			))}
		</div>
	);
};

export default SourcesList;
