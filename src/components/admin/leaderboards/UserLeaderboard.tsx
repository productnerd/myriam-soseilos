import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/data/Table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/data/Badge";
import { getAvatarFallback } from "@/utils/ui/avatarUtils";
import { UserRank } from "@/types/leaderboards";

interface UserLeaderboardProps {
	users: UserRank[] | undefined;
	isLoading: boolean;
	pointsType: "dark" | "grey" | "streak";
	timeRange: "all-time" | "monthly" | "weekly";
}

export const UserLeaderboard: React.FC<UserLeaderboardProps> = ({
	users,
	isLoading,
	pointsType,
	timeRange,
}) => {
	if (isLoading) {
		return (
			<div className="py-10 text-center">
				<p className="text-muted-foreground">Loading leaderboard data...</p>
			</div>
		);
	}

	if (!users || users.length === 0) {
		return (
			<div className="py-10 text-center">
				<p className="text-muted-foreground">No users found.</p>
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-12">#</TableHead>
					<TableHead>User</TableHead>
					<TableHead className="text-right">
						{timeRange !== "all-time" && pointsType !== "streak"
							? `${timeRange === "weekly" ? "Weekly" : "Monthly"} Gain`
							: pointsType === "dark"
							? "Dark Points"
							: pointsType === "grey"
							? "Grey Points"
							: "Streak"}
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users.map((user, index) => (
					<TableRow key={user.id}>
						<TableCell className="font-medium">{index + 1}</TableCell>
						<TableCell>
							<div className="flex items-center gap-2">
								<Avatar className="h-8 w-8">
									<AvatarImage
										src={user.thumbnail || "/placeholder.svg"}
										alt={user.name || "User"}
									/>
									<AvatarFallback>
										{getAvatarFallback(user.name, null)}
									</AvatarFallback>
								</Avatar>
								<span>{user.name || "Unnamed User"}</span>
								{user.flag && (
									<Badge variant="outline" className="px-2 py-0 h-6">
										{user.flag}
									</Badge>
								)}
							</div>
						</TableCell>
						<TableCell className="text-right">
							{timeRange !== "all-time" && pointsType !== "streak"
								? (pointsType === "dark"
										? user.dark_points_increase
										: user.grey_points_increase) || 0
								: pointsType === "dark"
								? user.dark_points
								: pointsType === "grey"
								? user.grey_points
								: user.streak}
							{timeRange !== "all-time" && pointsType !== "streak" && (
								<span className="text-xs text-muted-foreground ml-1">
									(Total:{" "}
									{pointsType === "dark" ? user.dark_points : user.grey_points})
								</span>
							)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
