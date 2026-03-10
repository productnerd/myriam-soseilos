import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/interactive/ToggleGroup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/Tabs";
import { PointsLeaderboards } from "./leaderboards/PointsLeaderboards";
import { CourseLeaderboard } from "./leaderboards/CourseLeaderboard";
import { TimeRange, UserRank, CourseRank } from "./leaderboards/types";

const LeaderboardsTab = () => {
	const [timeRange, setTimeRange] = useState<TimeRange>("all-time");
	const [activeTab, setActiveTab] = useState<string>("points");

	// Query for top users by dark points
	const { data: darkLeaders, isLoading: loadingDark } = useQuery({
		queryKey: ["admin", "leaderboard", "dark", timeRange],
		queryFn: async () => {
			if (timeRange === "all-time") {
				const { data, error } = await supabase
					.from("profiles")
					.select("id, name, thumbnail, flag, dark_points, grey_points, streak")
					.order("dark_points", { ascending: false })
					.limit(20);

				if (error) throw error;
				return data.map(user => ({
					...user,
					name: user.name || 'Unknown User'
				})) as UserRank[];
			} else {
				const periodDays = timeRange === "weekly" ? 7 : 30;

				const { data: currentData, error: currentError } = await supabase
					.from("profiles")
					.select("id, name, thumbnail, flag, dark_points, grey_points, streak");

				if (currentError) throw currentError;

				const { data: transactions, error: transactionError } = await supabase
					.from("user_transactions")
					.select("user_id, dark_points")
					.gte(
						"created_at",
						new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000).toISOString()
					);

				if (transactionError) throw transactionError;

				const pointIncreases: Record<string, number> = {};
				transactions.forEach((tx) => {
					if (tx.dark_points && tx.dark_points > 0) {
						if (!pointIncreases[tx.user_id]) {
							pointIncreases[tx.user_id] = 0;
						}
						pointIncreases[tx.user_id] += tx.dark_points;
					}
				});

				const usersWithIncreases = currentData
					.map((user) => ({
						...user,
						name: user.name || 'Unknown User',
						dark_points_increase: pointIncreases[user.id] || 0,
					}))
					.sort((a, b) => b.dark_points_increase - a.dark_points_increase)
					.slice(0, 20);

				return usersWithIncreases as UserRank[];
			}
		},
	});

	// Query for top users by grey points
	const { data: greyLeaders, isLoading: loadingGrey } = useQuery({
		queryKey: ["admin", "leaderboard", "grey", timeRange],
		queryFn: async () => {
			if (timeRange === "all-time") {
				const { data, error } = await supabase
					.from("profiles")
					.select("id, name, thumbnail, flag, dark_points, grey_points, streak")
					.order("grey_points", { ascending: false })
					.limit(20);

				if (error) throw error;
				return data.map(user => ({
					...user,
					name: user.name || 'Unknown User'
				})) as UserRank[];
			} else {
				const periodDays = timeRange === "weekly" ? 7 : 30;

				const { data: currentData, error: currentError } = await supabase
					.from("profiles")
					.select("id, name, thumbnail, flag, dark_points, grey_points, streak");

				if (currentError) throw currentError;

				const { data: transactions, error: transactionError } = await supabase
					.from("user_transactions")
					.select("user_id, grey_points")
					.gte(
						"created_at",
						new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000).toISOString()
					);

				if (transactionError) throw transactionError;

				const pointIncreases: Record<string, number> = {};
				transactions.forEach((tx) => {
					if (tx.grey_points && tx.grey_points > 0) {
						if (!pointIncreases[tx.user_id]) {
							pointIncreases[tx.user_id] = 0;
						}
						pointIncreases[tx.user_id] += tx.grey_points;
					}
				});

				const usersWithIncreases = currentData
					.map((user) => ({
						...user,
						name: user.name || 'Unknown User',
						grey_points_increase: pointIncreases[user.id] || 0,
					}))
					.sort((a, b) => b.grey_points_increase - a.grey_points_increase)
					.slice(0, 20);

				return usersWithIncreases as UserRank[];
			}
		},
	});

	// Query for top users by streak
	const { data: streakLeaders, isLoading: loadingStreak } = useQuery({
		queryKey: ["admin", "leaderboard", "streak"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("profiles")
				.select("id, name, thumbnail, flag, dark_points, grey_points, streak")
				.order("streak", { ascending: false })
				.limit(20);

			if (error) throw error;
			return data.map(user => ({
				...user,
				name: user.name || 'Unknown User'
			})) as UserRank[];
		},
	});

	// Query for course-specific leaderboards
	const { data: courseLeaders, isLoading: loadingCourses } = useQuery({
		queryKey: ["admin", "leaderboard", "courses", timeRange],
		queryFn: async () => {
			if (timeRange === "all-time") {
				return {};
			}

			const periodDays = timeRange === "weekly" ? 7 : 30;
			const periodStart = new Date(
				Date.now() - periodDays * 24 * 60 * 60 * 1000
			).toISOString();

			const { data: courses, error: coursesError } = await supabase
				.from("courses")
				.select("id, title");

			if (coursesError) throw coursesError;

			const courseLeaderboards: Record<string, CourseRank[]> = {};

			const { data: users, error: usersError } = await supabase
				.from("profiles")
				.select("id, name, thumbnail, flag, grey_points");

			if (usersError) throw usersError;

			const userMap: Record<string, any> = {};
			users.forEach((user) => {
				userMap[user.id] = user;
			});

			const { data: transactions, error: txError } = await supabase
				.from("user_transactions")
				.select(
					`
          user_id,
          grey_points,
          details
        `
				)
				.gte("created_at", periodStart)
				.not("details", "is", null)
				.order("created_at", { ascending: false });

			if (txError) throw txError;

			const coursePoints: Record<string, Record<string, number>> = {};

			transactions.forEach((tx) => {
				try {
					const details = JSON.parse(tx.details || '{}');
					if (details.course_id && tx.grey_points && tx.grey_points > 0) {
						if (!coursePoints[details.course_id]) {
							coursePoints[details.course_id] = {};
						}
						if (!coursePoints[details.course_id][tx.user_id]) {
							coursePoints[details.course_id][tx.user_id] = 0;
						}
						coursePoints[details.course_id][tx.user_id] += tx.grey_points;
					}
				} catch (e) {
					console.error("Error parsing transaction details:", e);
				}
			});

			courses.forEach((course) => {
				const userPoints = coursePoints[course.id] || {};

				const topUsers = Object.entries(userPoints)
					.filter(([userId]) => userMap[userId]) // Make sure user exists
					.map(([userId, points]) => ({
						id: userId,
						name: userMap[userId].name || 'Unknown User',
						thumbnail: userMap[userId].thumbnail,
						flag: userMap[userId].flag,
						course_id: course.id,
						course_title: course.title,
						grey_points_increase: points,
						total_grey_points: userMap[userId].grey_points || 0,
					}))
					.sort((a, b) => b.grey_points_increase - a.grey_points_increase)
					.slice(0, 10);

				if (topUsers.length > 0) {
					courseLeaderboards[course.id] = topUsers;
				}
			});

			return courseLeaderboards;
		},
		enabled: activeTab === "courses" && timeRange !== "all-time",
	});

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Leaderboards</h2>
				<ToggleGroup
					type="single"
					value={timeRange}
					onValueChange={(value) => value && setTimeRange(value as TimeRange)}
				>
					<ToggleGroupItem value="all-time">All Time</ToggleGroupItem>
					<ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
					<ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
				</ToggleGroup>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="mb-4">
					<TabsTrigger value="points">Points & Streaks</TabsTrigger>
					<TabsTrigger value="courses">Courses</TabsTrigger>
				</TabsList>

				<TabsContent value="points">
					<PointsLeaderboards
						darkLeaders={darkLeaders}
						greyLeaders={greyLeaders}
						streakLeaders={streakLeaders}
						loadingDark={loadingDark}
						loadingGrey={loadingGrey}
						loadingStreak={loadingStreak}
						timeRange={timeRange}
					/>
				</TabsContent>

				<TabsContent value="courses">
					<CourseLeaderboard
						courseLeaders={courseLeaders}
						isLoading={loadingCourses}
						timeRange={timeRange}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default LeaderboardsTab;
