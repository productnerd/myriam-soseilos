import React from "react";
import { useUserContext } from "@/contexts/UserContext";
import { useFlowPoints } from "@/hooks/points/useFlowPoints";
import { pointTypes } from "@/lib/ui";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/overlay/Tooltip";

const FlowPointsIndicator: React.FC = () => {
	const { user } = useUserContext();

	const { flowBalance, config, getTimeUntilReplenishment } = useFlowPoints(user?.id || null);

	const timeUntilReplenishment = getTimeUntilReplenishment();
	const { flow } = pointTypes;

	// Don't render if user details are not available yet
	if (!user) {
		return null;
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div
						className={`flex items-center space-x-1 px-3 py-1 rounded-full ${flow.bgDark} border ${flow.borderDark}`}
					>
						<flow.icon className={`h-5 w-5 min-w-[1.25rem] ${flow.textColor}`} />
						<span className="text-xs font-medium text-left">
							{flowBalance}
							<span className="text-[10px]">/{config.maxPoints}</span>
						</span>
					</div>
				</TooltipTrigger>
				<TooltipContent side="bottom" className="text-xs">
					<p>
						Flow Points: Used for learning activities. Replenishes{" "}
						{config.replenishAmount} points every {config.replenishIntervalHours} hours.
						{timeUntilReplenishment > 0 && (
							<span className="block mt-1">
								Next replenishment in{" "}
								{Math.ceil(timeUntilReplenishment / (1000 * 60))}m
							</span>
						)}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default FlowPointsIndicator;
