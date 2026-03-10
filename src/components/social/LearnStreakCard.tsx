// TODO: This component is not used anywhere

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/Card";
import StreakProgressIndicator from "../streaks/StreakProgressIndicator";
import { useStreak } from "@/hooks/streak/useStreak";
import { Flame } from "lucide-react";
import StreakProtectionBadge from "../streaks/StreakProtectionBadge";

const LearnStreakCard: React.FC = () => {
	const { currentStreak, dailyProgress, goalCompleted } = useStreak(user?.id || null);

	return (
		<Card className="overflow-hidden">
			<CardHeader className="bg-primary/10 px-4 py-3 flex flex-row items-center justify-between">
				<CardTitle className="text-base font-medium flex items-center gap-2">
					<Flame className={`h-5 w-5 ${goalCompleted ? "text-amber-500" : ""}`} />
					Daily Progress
					<StreakProtectionBadge className="ml-1" />
				</CardTitle>

				<span className={`text-sm font-medium ${goalCompleted ? "text-amber-500" : ""}`}>
					{currentStreak > 0 && (
						<span>
							{currentStreak} day{currentStreak !== 1 ? "s" : ""}
						</span>
					)}
				</span>
			</CardHeader>

			<CardContent className="p-4">
				<StreakProgressIndicator />

				<p className="text-xs text-muted-foreground mt-2">
					{goalCompleted
						? "You've reached today's goal! Keep the streak going tomorrow."
						: `Complete ${
								20 - dailyProgress
						  } more activities to reach your daily goal.`}
				</p>
			</CardContent>
		</Card>
	);
};

export default LearnStreakCard;
