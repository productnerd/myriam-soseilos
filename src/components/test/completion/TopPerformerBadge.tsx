import React from "react";
import { Badge } from "@/components/ui/data/Badge";
import { Trophy } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/overlay/Tooltip";

interface TopPerformerBadgeProps {
	percentile: 1 | 5 | 10 | null;
	className?: string;
}

const TopPerformerBadge: React.FC<TopPerformerBadgeProps> = ({ percentile, className = "" }) => {
	if (!percentile) return null;

	const getTooltipText = (percentile: 1 | 5 | 10) => {
		return `You scored in the top ${percentile}% of all users who have taken this test!`;
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Badge
						className={`flex items-center gap-1 px-2 py-1 font-medium text-xs
            ${
				percentile === 1
					? "bg-yellow-500 hover:bg-yellow-600 text-white"
					: percentile === 5
					? "bg-blue-500 hover:bg-blue-600 text-white"
					: "bg-purple-500 hover:bg-purple-600 text-white"
			} 
            ${className}`}
					>
						<Trophy className="h-3 w-3" />
						TOP {percentile}%
					</Badge>
				</TooltipTrigger>
				<TooltipContent>
					<p>{getTooltipText(percentile)}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default TopPerformerBadge;
