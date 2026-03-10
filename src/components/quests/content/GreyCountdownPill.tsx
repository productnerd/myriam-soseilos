import React from "react";
import { Badge } from "@/components/ui/data/Badge";
import { Feather } from "@/lib/customIcons";

interface GreyCountdownPillProps {
	greyPointsNeeded: number;
	className?: string;
}

const GreyCountdownPill: React.FC<GreyCountdownPillProps> = ({
	greyPointsNeeded,
	className = "",
}) => {
	return (
		<Badge
			variant="secondary"
			className={`text-xs px-2 py-1 flex items-center gap-1 ${className}`}
			style={{
				backgroundColor: "rgba(55, 65, 81, 0.8)",
				color: "rgb(209, 213, 219)",
				borderColor: "rgb(75, 85, 99)",
				backdropFilter: "blur(4px)",
				border: "1px solid rgb(75, 85, 99)",
			}}
		>
			<Feather size={12} className="flex-shrink-0" />
			{greyPointsNeeded} to unlock
		</Badge>
	);
};

export default GreyCountdownPill;
