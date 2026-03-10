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

export type TimeRange = "all-time" | "monthly" | "weekly";
