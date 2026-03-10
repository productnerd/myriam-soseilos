/**
 * This file defines the core types for our learning activities and their review system.
 * It includes both the activity content types and the spaced repetition metadata.
 */

import { ReviewData } from "./review";
import { BaseSubmission } from "./submissions";

/**
 * Defines all possible types of learning activities in the system.
 * Activities are interactive elements that users can engage with to learn and test their knowledge.
 */
export type ActivityType =
	// Primary activity types (canonical)
	| "multiple_choice" // Standard multiple choice question
	| "true_false" // Simple true/false question
	| "text_input" // Free-form text answer
	| "sorting" // Drag-and-drop sorting exercise
	| "image_multiple_choice" // Multiple choice with images
	| "poll" // Standard opinion poll
	| "image_poll" // Poll with image options
	| "text_poll" // Poll with text options
	| "myth_or_reality" // True/false with myth-busting context
	| "eduntainment" // Educational entertainment content
	| "pair_matching"; // Match pairs of related items

export interface Activity {
	id: string; // Unique identifier for the activity
	author_id?: string; // ID of the content creator
	topic_id?: string; // Associated topic/category
	type: ActivityType; // The type of activity (see ActivityType above)
	main_text: string; // The main content/question of the activity
	options?: string[] | Record<string, any>[]; // Possible answers/choices
	correct_answer: string | null; // The correct answer (null for polls/surveys)
	// TODO: This field is of type JSON in the database, so why do we have additional types (string, null)?
	explanation: Record<string, string> | string | null; // Explanation shown after answering
	order_number: number; // Position in a sequence of activities
	embed_url?: string; // URL for embedded content (videos, etc.)
	correct_answer_count?: number; // Number of correct submissions
	statistics?: Record<string, number>; // Usage/performance statistics
	community_note?: string; // Additional community context/notes
	difficulty?: string | null; // Difficulty level of the activity
}

export type LearningActivity = Activity & { reviewData?: ReviewData };

export interface ActivityRating {
	id: string;
	user_id: string;
	activity_id: string;
	is_positive: boolean;
	comment: string;
	created_at: string;
	formattedDate: string;
	status: string;
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
	activity?: {
		id?: string;
		main_text?: string;
		correct_answer?: string;
		explanation?: string;
		type?: string;
		options?: any;
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

export interface ActivitySubmission extends BaseSubmission {
	topic_id: string;
	type: string;
	main_text: string;
	options?: string[] | Record<string, any>[];
	correct_answer: string;
	explanation: string | null;
	source_link?: string | null;
	reviewed_at?: string | null;
	reviewed_by?: string | null;
	dark_points_awarded?: number;
	course_id: string;
	user?: {
		id: string;
		name: string | null;
		email: string | null;
		grey_points: number;
		dark_points: number;
		flag: string | null;
		tags: string[];
	};
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
}

// TODO: This is not used anywhere
export interface ActivitySubmissionForm {
	id?: string;
	course_id: string;
	topic_id: string;
	type: string;
	main_text: string;
	correct_answer: string;
	options?: string[];
	explanation?: string | Record<string, string>;
	user_id?: string;
	image?: File;
	image_urls?: string;
	embed_url?: string;
	source_link?: string;
}

export interface ActivityFormData {
	course_id: string;
	topic_id: string;
	type: string;
	main_text: string;
	correct_answer?: string;
	options?: string[];
	explanation?: string;
	explanationDefault?: string;
	explanationOptions?: Record<string, string>;
	image?: File;
	image_urls?: string;
	embed_url?: string;
	source_link?: string;
}
