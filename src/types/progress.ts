// Comprehensive progress-related types to standardize the system

// Standardized status values used across the application
export type ProgressStatus = "not_started" | "in_progress" | "completed";
export type CourseStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
export type TopicStatus = "locked" | "in_progress" | "completed";

// Core progress data structures
export interface UserProgress {
	id: string;
	user_id: string;
	course_id: string;
	current_topic_id: string | null;
	current_activity_id: string | null;
	current_level_id: string | null;
	status: ProgressStatus;
	created_at: string;
	updated_at: string;
}

export interface UserTopicProgress {
	id: string;
	user_id: string;
	course_id: string;
	level_id: string;
	topic_id: string;
	status: TopicStatus;
	created_at: string;
	updated_at: string;
}

export interface UserCompletedTopic {
	id: string;
	user_id: string;
	course_id: string;
	level_id: string;
	topic_id: string;
	created_at: string;
	updated_at: string;
}

// Enhanced topic type with progress information
export interface TopicWithProgress {
	id: string;
	title: string;
	order_number: number;
	level_id: string;
	tags: string[] | null;
	status: TopicStatus;
	is_completed: boolean;
	is_current: boolean;
}

// Enhanced level type with progress information
export interface LevelWithProgress {
	id: string;
	title: string;
	order_number: number;
	course_id: string;
	topics: TopicWithProgress[];
	is_completed: boolean;
	is_unlocked: boolean;
}

// Enhanced course type with progress information
export interface CourseWithProgress {
	id: string;
	title: string;
	description: string;
	image: string;
	color: string;
	icon?: string;
	skill_tags?: string[];
	status: CourseStatus;
	progress_percentage: number;
	current_topic_id?: string | null;
	current_level_id?: string | null;
	is_completed: boolean;
}

// Unified progress state for the entire application
export interface UnifiedProgressState {
	// Current user context
	userId: string | null;
	
	// Course-level progress
	selectedCourseId: string | null;
	courses: CourseWithProgress[];
	currentCourse: CourseWithProgress | null;
	
	// Level-level progress
	levels: LevelWithProgress[];
	currentLevel: LevelWithProgress | null;
	
	// Topic-level progress
	topics: TopicWithProgress[];
	currentTopic: TopicWithProgress | null;
	
	// Activity-level progress
	currentActivityId: string | null;
	currentActivityIndex: number;
	
	// Loading and error states
	isLoading: boolean;
	error: string | null;
	
	// Optimistic updates tracking
	optimisticUpdates: Record<string, any>;
}

// Action types for progress updates
export type ProgressAction = 
	| { type: "SET_USER_ID"; payload: string | null }
	| { type: "SET_SELECTED_COURSE"; payload: string | null }
	| { type: "SET_COURSES"; payload: CourseWithProgress[] }
	| { type: "SET_LEVELS"; payload: LevelWithProgress[] }
	| { type: "SET_TOPICS"; payload: TopicWithProgress[] }
	| { type: "SET_CURRENT_TOPIC"; payload: TopicWithProgress | null }
	| { type: "SET_CURRENT_ACTIVITY"; payload: { id: string | null; index: number } }
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_ERROR"; payload: string | null }
	| { type: "APPLY_OPTIMISTIC_UPDATE"; payload: { key: string; value: any } }
	| { type: "CLEAR_OPTIMISTIC_UPDATES" }
	| { type: "UPDATE_TOPIC_STATUS"; payload: { topicId: string; status: TopicStatus } }
	| { type: "COMPLETE_TOPIC"; payload: string }
	| { type: "RESET_PROGRESS" };

// API response types
export interface ProgressApiResponse<T = any> {
	data: T | null;
	error: string | null;
	success: boolean;
}

// Progress query parameters
export interface ProgressQueryParams {
	userId: string;
	courseId?: string;
	topicId?: string;
	includeCompleted?: boolean;
}

// Progress update parameters
export interface ProgressUpdateParams {
	userId: string;
	courseId: string;
	topicId?: string;
	activityId?: string;
	status?: ProgressStatus;
}