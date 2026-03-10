import { BaseSubmission } from "./submissions";

// Quest type
export type QuestType = "all" | "real-life-task" | "self-exploration-quiz";

// Quest submission type
export interface QuestSubmission extends BaseSubmission {
	sidequest_id: string;
	user_sidequest_id: string | null;
	image: string | null;
	user_comment: string | null;
	user_description: string | null;
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
	user?: {
		id: string;
		name: string | null;
		email: string | null;
		thumbnail: string | null;
		grey_points: number;
		dark_points: number;
		flag: string | null;
		tags: string[];
	};
}

// Group of quest submissions
export interface QuestSubmissionGroup {
	sidequest: QuestSubmission["sidequest"];
	pendingCount: number;
	totalCount: number;
	submissions: QuestSubmission[];
}

export type Sidequest = {
	id: string;
	title: string;
	description: string;
	dark_token_reward: number;
	grey_token_reward: number;
	topic_id: string | null;
	require_image?: boolean;
	require_description?: boolean;
	instructions?: string;
	status?: string;
	completion_count?: number;
	created_at?: string;
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

// Re-export UserSidequest from user types
export type { UserSidequest } from "./user";
