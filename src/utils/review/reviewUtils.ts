import { supabase } from "@/integrations/supabase/client";
import { Activity, ActivityType, LearningActivity } from "@/types/activity";
import { ReviewState } from "@/types/review";
import { normalizeActivityType } from "@/utils/activities/activityOperations";
import { calculateNextReview } from "./fsrsUtils";

/**
 * Function to check if a user has any activities due for review
 *
 * This function queries the `user_review_activities` table to see if there are
 * any activities where `next_review <= now` (i.e., activities that are due for review).
 *
 * @param userId - The user's ID
 * @returns True if there are activities due for review, False otherwise
 */
export async function hasReviewActivities(userId: string): Promise<boolean> {
	try {
		const now = new Date().toISOString();
		console.log("🔍 Checking for review activities due before:", now);

		const { data, error } = await supabase
			.from("user_review_activities")
			.select("*")
			.eq("user_id", userId)
			/* Filter activities that:
			 * Are/were due for review (i.e. next_review <= now)
			 * Are new (i.e. next_review is null)
			 */
			.or(`next_review.lte.${now}, next_review.is.null`);

		if (error) {
			console.error("Error checking for review activities:", error);
			throw error;
		}

		const hasReviews = data && data.length > 0;
		console.log("🔍 Found", data?.length || 0, "review activities due");

		return hasReviews;
	} catch (error) {
		console.error("Error in hasReviewActivities:", error);
		throw error;
	}
}

// Function to fetch activities that are due for review
export const fetchReviewActivities = async (userId: string): Promise<LearningActivity[]> => {
	try {
		const now = new Date().toISOString();

		// Query the database for pending reviews
		// This joins the `user_review_activities` table (review metadata) with the `activities` table (activity content)
		const { data, error } = await supabase
			.from("user_review_activities")
			.select(
				`
				activity_id,
				activities (*),
				stability,
				difficulty,
				elapsed_days,
				scheduled_days,
				learning_steps,
				reps,
				lapses,
				state,
				last_review,
				next_review
			`
			)
			.eq("user_id", userId)
			.or(`next_review.lte.${now}, next_review.is.null`)
			// TODO: Should new activites be shown first or last?
			.order("next_review", { ascending: true, nullsFirst: true }) // Show new activities first, then by due date
			.limit(20); // Cap daily reviews at 20

		if (error) {
			console.error("Error fetching review activities:", error);
			return [];
		}

		if (!data || data.length === 0) {
			return [];
		}

		// Transform the data to extract the activity objects with review data
		const activities = data
			.filter((item) => Boolean(item.activities)) // This filters out items where the join failed
			.map((item) => {
				const activity = item.activities as Activity;
				return {
					...activity, // Spread the activity content (questions, answers, etc)
					type: normalizeActivityType(activity.type) as ActivityType, // Ensure the activity type is in consistent format
					reviewData: {
						stability: item.stability,
						difficulty: item.difficulty,
						elapsed_days: item.elapsed_days,
						scheduled_days: item.scheduled_days,
						learning_steps: item.learning_steps,
						reps: item.reps,
						lapses: item.lapses,
						state: item.state as ReviewState,
						last_review: item.last_review ? new Date(item.last_review) : null,
						next_review: item.next_review ? new Date(item.next_review) : null,
					},
				};
			});

		return activities;
	} catch (error) {
		console.error("Error in fetchReviewActivities:", error);
		return [];
	}
};

// Function to update a review activity
export const updateReviewActivity = async (
	userId: string,
	activityId: string,
	isCorrect: boolean
): Promise<boolean> => {
	try {
		console.log("🔍 Updating review state for activity:", activityId);

		// TODO: Consider passing the actual activity instead of activityId to avoid extra query
		// Fetch current review activity
		const { data: reviewActivity, error: reviewActivityError } = await supabase
			.from("user_review_activities")
			.select("*")
			.eq("user_id", userId)
			.eq("activity_id", activityId)
			.single();

		if (reviewActivityError) {
			console.error("Error fetching review activity:", reviewActivityError);
			return false;
		}

		// Update the review state based on FSRS
		const nextReviewState = calculateNextReview(
			{ ...reviewActivity, state: reviewActivity.state as ReviewState },
			isCorrect
		);

		const updateData = {
			...nextReviewState,
			// Note: These need to be converted to ISO format as this is what the database expects
			last_review: nextReviewState.last_review.toISOString(),
			next_review: nextReviewState.next_review.toISOString(),
		};

		const { error: updateError } = await supabase
			.from("user_review_activities")
			.update(updateData)
			.eq("user_id", userId)
			.eq("activity_id", activityId);

		if (updateError) {
			console.error("Error updating review activity:", updateError);
			return false;
		}

		console.log("Review state updated successfully");
		return true;
	} catch (error) {
		console.error("Error in updateReviewActivity:", error);
		return false;
	}
};

/**
 * Function to mark review as skipped by updating last_review for all review activities
 * This ensures the 24-hour cooldown works properly when users skip review
 *
 * @param userId - The user's ID
 * @param skippedActivities - Array of activities that were skipped
 * @returns True if successful, false otherwise
 */
export async function markReviewActivitiesAsSkipped(
	userId: string,
	skippedActivities: LearningActivity[]
): Promise<boolean> {
	try {
		const now = new Date().toISOString();
		console.log(`🔍 Marking ${skippedActivities.length} as skipped`);

		// Only update 'last_review' for the skipped activities in the review session
		// Completed activities (up to the point of skipping) have their individual 'last_review' times updated via the 'updateReviewActivity' function
		if (skippedActivities.length > 0) {
			const { error: updateError } = await supabase
				.from("user_review_activities")
				.update({
					last_review: now,
				})
				.eq("user_id", userId)
				.in(
					"activity_id",
					skippedActivities.map((a) => a.id)
				);

			if (updateError) {
				console.error("Error marking review activities as skipped:", updateError);
				return false;
			}

			console.log(
				`✅ Successfully marked ${skippedActivities.length} review activities as skipped`
			);
		}

		return true;
	} catch (error) {
		console.error("Error in markReviewActivitiesAsSkipped:", error);
		return false;
	}
}

// Simplified implementations of review-related functions
export const getReviewRequests = async (topicId: string) => {
	try {
		const { data, error } = await supabase
			.from("activities")
			.select("*")
			.eq("topic_id", topicId);

		if (error) {
			console.error("Error fetching review requests:", error);
			return [];
		}

		return data || [];
	} catch (error) {
		console.error("Error fetching review requests:", error);
		return [];
	}
};

export const getActivitySubmission = async (submissionId: string) => {
	try {
		const { data, error } = await supabase
			.from("activities")
			.select("*")
			.eq("id", submissionId)
			.single();

		if (error) {
			console.error("Error fetching activity submission:", error);
			return null;
		}

		return data;
	} catch (error) {
		console.error("Error fetching activity submission:", error);
		return null;
	}
};

export const approveActivitySubmission = async (submissionId: string, dark_points?: number) => {
	try {
		const { error } = await supabase
			.from("activities")
			.update({
				updated_at: new Date().toISOString(),
				// No status field in activities table, so we'll just update the timestamp
			})
			.eq("id", submissionId);

		if (error) {
			console.error("Error approving activity submission:", error);
			return false;
		}

		return true;
	} catch (error) {
		console.error("Error approving activity submission:", error);
		return false;
	}
};

export const rejectActivitySubmission = async (submissionId: string, adminComment: string) => {
	try {
		// Since activities table doesn't have status or admin_comment fields,
		// we'll log the rejection without updating the database
		console.log(`Activity ${submissionId} rejected with comment: ${adminComment}`);
		return true;
	} catch (error) {
		console.error("Error rejecting activity submission:", error);
		return false;
	}
};

// TODO: Replace 'any' with the correct type
export const updateActivitySubmission = async (submissionId: string, updates: any) => {
	try {
		// Filter updates to only include fields that exist in activities table
		const validUpdates = {
			main_text: updates.main_text,
			correct_answer: updates.correct_answer,
			type: updates.type,
			options: updates.options,
			explanation: updates.explanation,
			updated_at: new Date().toISOString(),
		};

		const { error } = await supabase
			.from("activities")
			.update(validUpdates)
			.eq("id", submissionId);

		if (error) {
			console.error("Error updating activity submission:", error);
			return false;
		}

		return true;
	} catch (error) {
		console.error("Error updating activity submission:", error);
		return false;
	}
};

export const getActivitySubmissionCounts = async (topicId: string) => {
	try {
		const { data, error } = await supabase
			.from("activities")
			.select("id")
			.eq("topic_id", topicId);

		if (error) {
			console.error("Error fetching activity submission counts:", error);
			return null;
		}

		// Since there's no status field, we just count the total activities
		const counts = {
			total_submissions: data?.length || 0,
			approved_submissions: data?.length || 0, // Assuming all are approved
			rejected_submissions: 0, // No rejected status in activities table
		};

		return counts;
	} catch (error) {
		console.error("Error fetching activity submission counts:", error);
		return null;
	}
};

// Placeholder functions that don't do anything since we don't have the relevant tables
export const incrementSubmissionCount = async (
	topicId: string,
	type: "total" | "approved" | "rejected"
): Promise<boolean> => {
	console.log(`Incrementing ${type} count for topic ${topicId}`);
	return true;
};

export const decrementSubmissionCount = async (
	topicId: string,
	type: "total" | "approved" | "rejected"
): Promise<boolean> => {
	console.log(`Decrementing ${type} count for topic ${topicId}`);
	return true;
};

// Example implementation that safely avoids the error:
export const getFeedback = async (activityId: string) => {
	try {
		const { data: activity } = await supabase
			.from("activities")
			.select("explanation")
			.eq("id", activityId)
			.single();

		return activity?.explanation || null;
	} catch (error) {
		console.error("Error fetching feedback:", error);
		return null;
	}
};
