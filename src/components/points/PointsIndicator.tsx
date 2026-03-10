import React, { useState } from "react";
import { useProfileData } from "@/hooks/profile/useProfileData";
import { pointTypes } from "@/lib/ui";
import PointsExplanationModal from "./PointsExplanationModal";
import { useStreak } from "@/hooks/streak/useStreak";
import { useUserContext } from "@/contexts/UserContext";
import FlowPointIndicator from "./FlowPointsIndicator";
import { Shield } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/overlay/Tooltip";

const PointsIndicator: React.FC = () => {
	const { user } = useUserContext();
	const { profile } = useProfileData(user?.id || null);
	const { currentStreak, streakProtected } = useStreak(user?.id || null);
	const { grey, dark, streak } = pointTypes;
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	// Don't render if user details are not available yet
	if (!user) {
		return null;
	}

	return (
		<>
			<TooltipProvider>
				<div
					className="flex items-center gap-2 cursor-pointer text-left"
					onClick={handleOpenModal}
				>
					<Tooltip>
						<TooltipTrigger asChild>
							<div
								className={`flex items-center space-x-1 px-3 py-1 rounded-full ${grey.bgDark} border ${grey.borderDark}`}
							>
								<grey.icon
									className={`h-5 w-5 min-w-[1.25rem] ${grey.textColor}`}
								/>
								<span className="text-xs font-medium text-left">
									{profile?.grey_points || 0}
								</span>
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom" className="text-xs">
							<p>
								Wise Points: Earned by completing learning activities and
								internalizing knowledge.
							</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<div
								className={`flex items-center space-x-1 px-3 py-1 rounded-full ${dark.bgDark} border ${dark.borderDark}`}
							>
								<dark.icon
									className={`h-5 w-5 min-w-[1.25rem] ${dark.textColor}`}
								/>
								<span className="text-xs font-medium text-left">
									{profile?.dark_points || 0}
								</span>
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom" className="text-xs">
							<p>
								Coins: Earned by completing quests and achievements, spent in the
								shop.
							</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<div
								className={`flex items-center space-x-1 px-3 py-1 rounded-full ${streak.bgDark} border ${streak.borderDark} relative`}
							>
								<streak.icon
									className={`h-5 w-5 min-w-[1.25rem] ${streak.textColor}`}
								/>
								<span className="text-xs font-medium text-left">
									{currentStreak}
								</span>
								{streakProtected && currentStreak > 0 && (
									<Shield className="h-4 w-4 text-green-500 absolute -top-1 -right-1 bg-background rounded-full p-0.5 fill-green-500" />
								)}
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom" className="text-xs">
							<p>
								Streak: Increased by learning daily, lost when missing a day of
								learning.
							</p>
						</TooltipContent>
					</Tooltip>

					<FlowPointIndicator />
				</div>
			</TooltipProvider>

			<PointsExplanationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</>
	);
};

export default PointsIndicator;
