import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/Card";
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

interface CourseRank {
	id: string;
	name: string;
	thumbnail: string | null;
	flag: string | null;
	course_id: string;
	course_title: string;
	grey_points_increase: number;
	total_grey_points: number;
}

interface CourseLeaderboardProps {
	courseLeaders: Record<string, CourseRank[]> | undefined;
	isLoading: boolean;
	timeRange: "all-time" | "monthly" | "weekly";
}

export const CourseLeaderboard: React.FC<CourseLeaderboardProps> = ({
	courseLeaders,
	isLoading,
	timeRange,
}) => {
	if (timeRange === "all-time") {
		return (
			<div className="py-10 text-center">
				<p className="text-muted-foreground">
					Course leaderboards are only available for weekly and monthly views.
				</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="py-10 text-center">
				<p className="text-muted-foreground">Loading course leaderboards...</p>
			</div>
		);
	}

	if (!courseLeaders || Object.keys(courseLeaders).length === 0) {
		return (
			<div className="py-10 text-center">
				<p className="text-muted-foreground">No course data available.</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{Object.entries(courseLeaders).map(([courseId, users]) => {
				if (!users || users.length === 0) return null;

				return (
					<Card key={courseId}>
						<CardHeader>
							<CardTitle>{users[0].course_title}</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-12">#</TableHead>
										<TableHead>User</TableHead>
										<TableHead className="text-right">
											{timeRange === "weekly" ? "Weekly" : "Monthly"} Grey
											Points Gain
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{users.map((user, index) => (
										<TableRow key={user.id}>
											<TableCell className="font-medium">
												{index + 1}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<Avatar className="h-8 w-8">
														<AvatarImage
															src={
																user.thumbnail || "/placeholder.svg"
															}
															alt={user.name || "User"}
														/>
														<AvatarFallback>
															{getAvatarFallback(user.name, null)}
														</AvatarFallback>
													</Avatar>
													<span>{user.name || "Unnamed User"}</span>
													{user.flag && (
														<Badge
															variant="outline"
															className="px-2 py-0 h-6"
														>
															{user.flag}
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell className="text-right">
												{user.grey_points_increase || 0}
												<span className="text-xs text-muted-foreground ml-1">
													(Total: {user.total_grey_points})
												</span>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
};
