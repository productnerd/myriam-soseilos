import React from "react";
import { Calendar } from "lucide-react";
import { formatReleaseDate } from "@/utils/formatting/formatters";
import { cn } from "@/lib/utils";

interface ReleaseDateBadgeProps {
	releaseDate: string | null;
	className?: string;
}

const ReleaseDateBadge: React.FC<ReleaseDateBadgeProps> = ({ releaseDate, className }) => {
	const formattedDate = formatReleaseDate(releaseDate);

	if (!formattedDate) return null;

	return (
		<div
			className={cn(
				"absolute top-2 right-2 z-10 bg-black/80 text-white px-2 py-1 rounded-md text-xs flex items-center",
				className
			)}
		>
			<Calendar className="h-3 w-3 mr-1" />
			<span>Drops: {formattedDate}</span>
		</div>
	);
};

export default ReleaseDateBadge;
