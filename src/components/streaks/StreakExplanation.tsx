import React from "react";
import { useStreak } from "@/hooks/streak/useStreak";
import { CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/data/Progress";
import { pointTypes } from "@/lib/ui";
import StreakProtectionBadge from "./StreakProtectionBadge";

interface StreakExplanationProps {
	className?: string;
}

const StreakExplanation: React.FC<StreakExplanationProps> = ({ className }) => {
	const { currentStreak, dailyProgress, progressPercentage, goalCompleted } = useStreak(
		user?.id || null
	);
	const { streak } = pointTypes;

	return (
		<div className={`space-y-2 ${className}`}>
			<div className="space-y-2 p-4 bg-secondary/20 rounded-md">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-1.5">
						<streak.icon className="h-4 w-4 text-muted-foreground" />
						<p className="text-sm font-medium">Daily Activity Goal</p>
						<StreakProtectionBadge className="ml-1" />
					</div>
					<p className="text-sm font-medium text-muted-foreground">{dailyProgress}/20</p>
				</div>

				<Progress
					value={progressPercentage}
					className="h-2.5 w-full"
					indicatorClassName={goalCompleted ? streak.textColor : undefined}
				/>

				<div className="flex items-center gap-1.5 mt-2">
					{goalCompleted ? (
						<>
							<CheckCircle className="h-4 w-4 text-green-500" />
							<p className="text-sm text-green-500">
								Goal reached for today! Keep it up.
							</p>
						</>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default StreakExplanation;
