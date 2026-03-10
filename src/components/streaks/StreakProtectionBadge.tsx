import React from "react";
import { useSundayCheck } from "@/hooks/activity/useSundayCheck";
import { Shield, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/data/Badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/overlay/Tooltip";

interface StreakProtectionBadgeProps {
	className?: string;
}

const StreakProtectionBadge: React.FC<StreakProtectionBadgeProps> = ({ className }) => {
	const { isSundayProtection } = useSundayCheck();

	if (!isSundayProtection) {
		return null;
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Badge
						variant="outline"
						className={`bg-green-100 text-green-800 border-green-300 flex items-center gap-1 ${className}`}
					>
						<Shield className="h-3 w-3" />
						<span>Streak Protected</span>
						<Calendar className="h-3 w-3 ml-1" />
					</Badge>
				</TooltipTrigger>
				<TooltipContent>
					<p>
						It's Sunday! Your streak is protected today, so you won't lose it even if
						you don't complete your daily goal.
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default StreakProtectionBadge;
