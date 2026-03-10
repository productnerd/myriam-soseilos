export interface UserProfile {
	id: string;
	email: string | null;
	name: string | null;
	thumbnail: string | null;
	dark_points: number | null;
	grey_points: number | null;
	streak: number | null;
	last_active: string | null;
	flag: string | null;
	country: string | null;
	favorite_emoji: string | null;
	access_code: string | null;
	invited_by: string | null;
	email_alerts: boolean | null;
	push_notifications: boolean | null;
	poll_sharing: boolean | null;
	score_sharing: boolean | null;
	tags: string[] | null;
	isAdmin?: boolean;
	strikes: number;
	roles?: string[] | null;
}

// User sidequest state
export interface UserSidequest {
	id: string;
	user_id: string;
	sidequest_id?: string;
	self_exploration_quest_id?: string;
	state: string;
	progress?: number;
	created_at: string;
	completed_at?: string;
	rewards_claimed: boolean;
	is_hidden?: boolean;
	current_question_index?: number;
	session_id?: string;
	sidequest?: {
		id: string;
		title: string;
		description: string;
		dark_token_reward: number;
		grey_token_reward: number;
		topic_id: string | null;
		require_image?: boolean;
		require_description?: boolean;
		instructions?: string;
		image?: string;
		icon?: string;
		grey_unlock?: number;
		prerequisite_sidequest_id?: string | null;
		topic?: {
			id?: string;
			title?: string;
			level?: {
				id?: string;
				title?: string;
				course?: {
					id?: string;
					title?: string;
					color?: string;
				};
			};
		};
	};
	self_exploration_quest?: {
		id: string;
		title: string;
		description: string;
		dark_token_reward: number;
		grey_token_reward: number;
		topic_id: string | null;
		image?: string;
		icon?: string;
		grey_unlock?: number;
		completion_count?: number;
		status?: string;
		created_at?: string;
		personalised_result?: string;
		questions?: any[];
		show_quest_social_stats?: boolean;
		quest_type?: "general" | "grouping";
		custom_prompt?: string;
		topic?: {
			id?: string;
			title?: string;
			level?: {
				id?: string;
				title?: string;
				course?: {
					id?: string;
					title?: string;
					color?: string;
				};
			};
		};
	};
}

export type UserFeedback = {
	id: string;
	user_id: string;
	comment: string;
	created_at: string;
	formattedDate: string;
	user?: {
		name: string | null;
		email: string | null;
		grey_points: number | null;
		dark_points: number | null;
		flag: string | null;
		tags: string[];
		days_as_user?: number;
		error?: boolean;
	};
};

export type UserDataWithError = {
	id: string;
	name: string | null;
	email: string | null;
	thumbnail: string | null;
	grey_points: number;
	dark_points: number;
	flag: string | null;
	tags: string[];
	error?: boolean;
};

export type UserProgress = {
	id: string;
	user_id: string;
	course_id: string;
	current_topic_id: string | null;
	status: string;
	current_level_id?: string | null;
};
