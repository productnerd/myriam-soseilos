/*
	Core implementation of the FSRS (Free Spaced Repetition Scheduler)
   	FSRS is an algorithm that determines optimal review intervals
   	The algorithm uses the inputs (below) along with its neural network weights to calculate the optimal review intervals that maintain the target retention rate while minimizing the number of reviews needed
*/
import { FSRS, FSRSParameters, Card, generatorParameters, State, Rating } from "ts-fsrs";
import { ReviewState, ReviewActivity, NextReviewData } from "@/types/review";

// Configure the FSRS algorithm with our desired parameters
const DEFAULT_PARAMS: FSRSParameters = generatorParameters({
	maximum_interval: 365, // Never schedule a review more than 1 year in the future
	enable_fuzz: true, // Add slight randomness to intervals to prevent all cards being due on the same day
	w: [1, 1, 5, -0.5, -0.5, 0.2, 1.4, -0.12, 0.8, 2, -0.2, 0.2, 1], // Weights for the algorithm's neural network
	request_retention: 0.9, // Target 90% retention rate (probability of remembering)
});

// Initialize scheduler
const fsrs = new FSRS(DEFAULT_PARAMS);

// Mapping between our ReviewState and FSRS's 'State' enum
const STATE_MAPPING: Record<string, State> = {
	New: State.New, // When an activity is first encountered
	Learning: State.Learning, // When the user is in the initial learning phase (first few reviews)
	Review: State.Review, // When the activity has been learnt and is in the spaced repetition phase
	Relearning: State.Relearning, // When the user has forgotten the activity that was previously in the 'Review' state
} as const;

// Reverse mapping for converting FSRS State enum back to our ReviewState
const REVERSE_STATE_MAPPING: Record<State, ReviewState> = {
	[State.New]: "New",
	[State.Learning]: "Learning",
	[State.Review]: "Review",
	[State.Relearning]: "Relearning",
} as const;

/*
	Helper function to convert our database record into the format that FSRS expects (FSRS Card).
	There are two type of activities:
	- Old activities (previously reviewed) - we use the data from the database
	- New activities (never reviewed before) - we provide appropriate initial values that the FSRS algorithm expects for a fresh card
*/
export function toFSRSCard(record: ReviewActivity): Card {
	const now = new Date();

	return {
		// When the card is due for review
		// For old activities, we use 'next_review'
		// For new activities, we use current time as fallback
		due: record.next_review ? new Date(record.next_review) : now,

		// How stable the memory is (higher = more stable)
		stability: record.stability || 0,

		// How difficult the card is for the user (0.0 to 1.0, higher = more difficult)
		difficulty: record.difficulty || 0.3,

		// Days since the last review
		// TODO: This field is deprecated in ts-fsrs v6.0.0. Plan migration when upgrading.
		elapsed_days: record.elapsed_days || 0,

		// Days that were scheduled for the current review
		scheduled_days: record.scheduled_days || 0,

		// Number of steps in the learning phase
		learning_steps: record.learning_steps || 0,

		// Total number of reviews
		reps: record.reps || 0,

		// Number of times the user has forgotten this card
		lapses: record.lapses || 0,

		// Convert string state to FSRS State enum
		state: STATE_MAPPING[record.state || "New"],

		// When the card was last reviewed
		// For old activities, we use 'last_review'
		// For new activities, we use current time as fallback
		last_review: record.last_review ? new Date(record.last_review) : now,
	};
}

/*
	Helper function to convert the user's answer (normally in Anki, this is the user-reported difficulty) into an FSRS rating
	FSRS normally uses a 4-point scale:
	- 1=Again (Wrong Answer)
	- 2=Hard (Correct but Difficult)
	- 3=Good (Correct and Normal Difficulty)
	- 4=Easy (Correct and Easy)
	
	However, since we're not using user-reported difficulty, we use the correctness as a proxy,
	We can therefore simplify to a 2-point scale:
	- 1 (Again) for incorrect answers
	- 3 (Good) for correct answers
*/
export function toFSRSRating(isCorrect: boolean): number {
	return isCorrect ? 3 : 1; // 3 = Good (correct), 1 = Again (incorrect)
}

/* 
	Core function for calculating the next review data based on the current data and user's response
*/
export const calculateNextReview = (
	currentReviewActivity: ReviewActivity,
	isCorrect: boolean
): NextReviewData => {
	const card = toFSRSCard(currentReviewActivity); // Convert our record to FSRS format

	const rating = toFSRSRating(isCorrect); // Convert user's answer to FSRS rating (1=incorrect, 3=correct)

	const now = new Date(); // Current timestamp for the review

	/*
		The `repeat` function returns a RecordLog object with properties for each rating (key).
		Each rating property contains a RecordLogItem (value) with card and log properties.
		i.e. schedules = {
		1: {card: {…}, log: {…}}, 
		2: {card: {…}, log: {…}}, 
		3: {card: {…}, log: {…}}, 
		4: {card: {…}, log: {…}}
		}
		
		Since we only care about the correct/incorrect answers, we only need the schedule for ratings 3 and 1.
	*/

	const schedules = fsrs.repeat(card, now);

	const fsrsRating = rating === 1 ? Rating.Again : Rating.Good; // Convert our rating (1 or 3) to the corresponding FSRS Rating enum

	const newReviewState = schedules[fsrsRating]; // Get the schedule for the specific rating

	// Return the next state to store in our database
	return {
		stability: newReviewState.card.stability,
		difficulty: newReviewState.card.difficulty,
		// TODO: This field is deprecated in ts-fsrs v6.0.0. Plan migration when upgrading.
		elapsed_days: newReviewState.card.elapsed_days,
		scheduled_days: newReviewState.card.scheduled_days,
		learning_steps: newReviewState.card.learning_steps,
		reps: newReviewState.card.reps,
		lapses: newReviewState.card.lapses,
		state: REVERSE_STATE_MAPPING[newReviewState.card.state], // Convert FSRS State enum back to our ReviewState
		last_review: now,
		next_review: newReviewState.card.due,
	};
};
