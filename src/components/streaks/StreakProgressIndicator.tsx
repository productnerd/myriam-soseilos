import React from "react";
import { Progress } from "@/components/ui/data/Progress";
import { useStreak } from "@/hooks/streak/useStreak";
import { Flame, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import StreakProtectionBadge from "./StreakProtectionBadge";

interface StreakProgressIndicatorProps {
	className?: string;
	showLabel?: boolean;
	showCount?: boolean;
	size?: "sm" | "md" | "lg";
	hideStreakDays?: boolean;
}

const StreakProgressIndicator: React.FC<StreakProgressIndicatorProps> = ({
	className,
	showLabel = true,
	showCount = true,
	size = "md",
	hideStreakDays = false,
}) => {
	const { currentStreak, dailyProgress, progressPercentage, goalCompleted, streakProtected } =
		useStreak(user?.id || null);

	// Adjusting sizes based on the size prop
	const getSize = () => {
		switch (size) {
			case "sm":
				return { height: "h-1", icon: "h-3 w-3", text: "text-xs" };
			case "lg":
				return { height: "h-4", icon: "h-5 w-5", text: "text-base" };
			default:
				return { height: "h-2", icon: "h-4 w-4", text: "text-sm" };
		}
	};

	const sizeClasses = getSize();

	return (
		<div className={cn("flex flex-col space-y-1", className)}>
			{showLabel && (
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-1">
						<Flame
							className={cn(
								sizeClasses.icon,
								goalCompleted ? "text-amber-500" : "text-muted-foreground"
							)}
						/>
						<span className={cn(sizeClasses.text, "font-medium")}>Daily Goal</span>
						<StreakProtectionBadge className="ml-2" />
					</div>

					{showCount && (
						<div className="flex items-center gap-1">
							<span
								className={cn(
									sizeClasses.text,
									"font-medium",
									goalCompleted ? "text-amber-500" : "text-muted-foreground"
								)}
							>
								{dailyProgress}/20
							</span>
							{streakProtected && currentStreak > 0 && (
								<ShieldCheck className="h-4 w-4 text-green-500 fill-current" />
							)}
						</div>
					)}
				</div>
			)}

			<Progress
				value={progressPercentage}
				className={cn("w-full", sizeClasses.height)}
				indicatorClassName={cn(goalCompleted ? "bg-amber-500" : "bg-primary")}
			/>

			{currentStreak > 0 && !hideStreakDays && (
				<div
					className={cn(
						"flex items-center gap-1 justify-start",
						goalCompleted ? "text-amber-500" : "text-muted-foreground"
					)}
				>
					<Flame className={sizeClasses.icon} />
					<span className={cn(sizeClasses.text)}>
						Streak: {currentStreak} {currentStreak === 1 ? "day" : "days"}
					</span>
					{streakProtected && currentStreak > 0 && (
						<ShieldCheck className="h-4 w-4 text-green-500 ml-1 fill-current" />
					)}
				</div>
			)}
		</div>
	);
};

export default StreakProgressIndicator;
