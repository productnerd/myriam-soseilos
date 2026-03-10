import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/Card";
import { UserLeaderboard } from "./UserLeaderboard";
import { UserRank } from "@/types/leaderboards";

interface PointsLeaderboardsProps {
	darkLeaders: UserRank[] | undefined;
	greyLeaders: UserRank[] | undefined;
	streakLeaders: UserRank[] | undefined;
	loadingDark: boolean;
	loadingGrey: boolean;
	loadingStreak: boolean;
	timeRange: "all-time" | "monthly" | "weekly";
}

export const PointsLeaderboards: React.FC<PointsLeaderboardsProps> = ({
	darkLeaders,
	greyLeaders,
	streakLeaders,
	loadingDark,
	loadingGrey,
	loadingStreak,
	timeRange,
}) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Dark Points</CardTitle>
				</CardHeader>
				<CardContent>
					<UserLeaderboard
						users={darkLeaders}
						isLoading={loadingDark}
						pointsType="dark"
						timeRange={timeRange}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Grey Points</CardTitle>
				</CardHeader>
				<CardContent>
					<UserLeaderboard
						users={greyLeaders}
						isLoading={loadingGrey}
						pointsType="grey"
						timeRange={timeRange}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Streaks</CardTitle>
				</CardHeader>
				<CardContent>
					<UserLeaderboard
						users={streakLeaders}
						isLoading={loadingStreak}
						pointsType="streak"
						timeRange={timeRange}
					/>
				</CardContent>
			</Card>
		</div>
	);
};
