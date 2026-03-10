// Valid states for review activities
export type ReviewState = "New" | "Learning" | "Review" | "Relearning";

// The complete review activity data from the database (all fields)
export interface ReviewActivity {
	id: string;
	user_id: string;
	activity_id: string;
	created_at: string;
	stability: number | null;
	difficulty: number | null;
	elapsed_days: number | null;
	scheduled_days: number | null;
	learning_steps: number | null;
	reps: number | null;
	lapses: number | null;
	state: ReviewState;
	last_review: string | null;
	next_review: string | null;
}

// The review metadata (from the database)
export interface ReviewData {
	stability: number | null; // How well the memory is retained (higher = more stable)
	difficulty: number | null; // How hard this is for the user (0.0 to 1.0)
	elapsed_days: number | null; // Days since last review
	scheduled_days: number | null; // Days that were scheduled for the current review
	learning_steps: number | null; // Progress in the learning phase
	reps: number | null; // Total number of reviews
	lapses: number | null; // Number of times forgotten
	state: ReviewState; // Current state in SRS ("New", "Learning", "Review", "Relearning")
	last_review: Date | null; // When this was last reviewed
	next_review: Date | null; // When this should be reviewed next
}

// The new review state (as calculated by the FSRS algorithm)
export interface NextReviewData {
	stability: number;
	difficulty: number;
	elapsed_days: number;
	scheduled_days: number;
	learning_steps: number;
	reps: number;
	lapses: number;
	state: ReviewState;
	last_review: Date;
	next_review: Date;
}
