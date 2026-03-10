import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useUserMessages } from "@/hooks/messages";
import { useUnclaimedRewards } from "@/hooks/quests/useUnclaimedRewards";
import { Icons } from "@/components/ui/Icons";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/overlay/Tooltip";

interface TabBarProps {
	className?: string;
}

const TabBar: React.FC<TabBarProps> = ({ className }) => {
	const location = useLocation();
	const currentPath = location.pathname;
	const { hasUnreadMessages } = useUserMessages();
	const { data: unclaimedRewardsCount = 0 } = useUnclaimedRewards();

	const tabs = [
		{
			path: "/learn",
			icon: Icons.learningTree,
			label: "Learn",
			exact: false,
		},
		{
			path: "/quests",
			icon: Icons.quests,
			label: "Sidequests",
			exact: false,
			hasNotification: unclaimedRewardsCount > 0,
		},
		{
			path: "/store",
			icon: Icons.store,
			label: "Store",
			exact: false,
		},
		{
			path: "/inbox",
			icon: Icons.inbox,
			label: "Inbox",
			exact: false,
			hasNotification: hasUnreadMessages,
		},
		{
			path: "/profile",
			icon: Icons.profile,
			label: "Profile",
			exact: false,
		},
	];

	return (
		<TooltipProvider>
			<div
				className={cn(
					"fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border flex justify-around items-center h-16 px-0 md:px-4 z-40",
					className
				)}
			>
				{tabs.map((tab) => {
					const isActive = tab.exact
						? currentPath === tab.path
						: currentPath.startsWith(tab.path);

					const IconComponent = tab.icon;
					if (!IconComponent) {
						console.warn(`Missing icon for tab: ${tab.label}`);
						return null;
					}

					return (
						<Tooltip key={tab.path}>
							<TooltipTrigger asChild>
								<Link
									to={tab.path}
									className={cn(
										"flex flex-col items-center justify-center space-y-1 w-full h-full py-2 transition-all duration-300",
										isActive && "text-primary"
									)}
								>
									<div className="relative">
										<div
											className={cn(
												"transition-opacity",
												isActive ? "opacity-100" : "opacity-20"
											)}
										>
											<IconComponent />
										</div>
										{tab.hasNotification && (
											<span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-orange-500 ring-2 ring-background"></span>
										)}
									</div>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="top" className="text-xs">
								<p>{tab.label}</p>
							</TooltipContent>
						</Tooltip>
					);
				})}
			</div>
		</TooltipProvider>
	);
};

export default TabBar;
