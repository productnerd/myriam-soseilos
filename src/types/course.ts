// Type definitions for course-related data
export type Course = {
	id: string;
	title: string;
	description: string;
	image: string;
	color: string;
	icon?: string;
	skill_tags?: string[];
	status?: "NOT_STARTED" | "INPROGRESS" | "COMPLETED" | "ACTIVE" | "COMING_SOON";
};

export type CourseStatus =
	| {
			status: string;
			current_level_id?: string | null;
	  }
	| "NOT_STARTED";

export type FriendOnCourse = {
	user_id: string;
	profiles?: {
		name: string | null;
		thumbnail: string | null;
	};
};
