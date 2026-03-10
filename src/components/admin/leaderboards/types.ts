
export type TimeRange = "all-time" | "weekly" | "monthly";

export interface LeaderboardUser {
	id: string;
	name: string | null;
	email: string | null;
	grey_points: number;
	dark_points: number;
	flag: string | null;
	thumbnail: string | null;
}

export interface UserRank {
	id: string;
	name: string;
	thumbnail: string | null;
	flag: string | null;
	dark_points: number;
	grey_points: number;
	streak: number;
	dark_points_increase?: number;
	grey_points_increase?: number;
}

export interface CourseRank {
	id: string;
	name: string;
	thumbnail: string | null;
	flag: string | null;
	course_id: string;
	course_title: string;
	grey_points_increase: number;
	total_grey_points: number;
}

export interface CourseLeaderboardEntry {
	user_id: string;
	course_id: string;
	score: number;
	completed_topics: number;
	user?: LeaderboardUser;
}
