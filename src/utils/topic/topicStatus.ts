import { supabase } from "@/integrations/supabase/client";

/**
 * Get the topic status (completed/in_progress) for a user
 */
export async function getTopicStatus(
	userId: string,
	topicId: string
): Promise<"completed" | "in_progress" | undefined> {
	try {
		if (!userId || !topicId) return undefined;

		// Check if the topic is completed
		const { data: completedData } = await supabase
			.from("user_completed_topics")
			.select("*")
			.eq("user_id", userId)
			.eq("topic_id", topicId)
			.maybeSingle();

		if (completedData) {
			return "completed";
		}

		// Check if the topic is the current_topic_id in user_progress
		// Get the level_id for this topic first
		const { data: topicData } = await supabase
			.from("topics")
			.select("level_id")
			.eq("id", topicId)
			.single();

		if (!topicData) return undefined;

		// Get the course_id for this level
		const { data: levelData } = await supabase
			.from("levels")
			.select("course_id")
			.eq("id", topicData.level_id)
			.single();

		if (!levelData) return undefined;

		// Check the user_progress record
		const { data: progressData } = await supabase
			.from("user_progress")
			.select("current_topic_id")
			.eq("user_id", userId)
			.eq("course_id", levelData.course_id)
			.maybeSingle();

		if (progressData && progressData.current_topic_id === topicId) {
			return "in_progress";
		}

		return undefined;
	} catch (error) {
		console.error("[topicStatus] Error in getTopicStatus:", error);
		return undefined;
	}
}

/**
 * Get all topic statuses for a level
 */
export async function getTopicStatusesForLevel(
	userId: string,
	levelId: string
): Promise<Record<string, "completed" | "in_progress">> {
	try {
		if (!userId || !levelId) return {};

		// Get all topics for this level
		const { data: topics } = await supabase
			.from("topics")
			.select("id,level_id")
			.eq("level_id", levelId);

		if (!topics || topics.length === 0) return {};

		// Get the course_id for this level
		const { data: levelData } = await supabase
			.from("levels")
			.select("course_id")
			.eq("id", levelId)
			.single();

		if (!levelData) return {};

		// Get all completed topics
		const { data: completedTopics } = await supabase
			.from("user_completed_topics")
			.select("topic_id")
			.eq("user_id", userId)
			.eq("level_id", levelId);

		// Get the current progress
		const { data: progressData } = await supabase
			.from("user_progress")
			.select("current_topic_id")
			.eq("user_id", userId)
			.eq("course_id", levelData.course_id)
			.maybeSingle();

		// Create the result map
		const result: Record<string, "completed" | "in_progress"> = {};

		// Mark all completed topics
		completedTopics?.forEach((item) => {
			result[item.topic_id] = "completed";
		});

		// Mark the current topic as in_progress
		if (progressData?.current_topic_id) {
			// Only if the topic is not already marked as completed
			if (!result[progressData.current_topic_id]) {
				// And only if it's in this level
				if (topics.some((t) => t.id === progressData.current_topic_id)) {
					result[progressData.current_topic_id] = "in_progress";
				}
			}
		}

		return result;
	} catch (error) {
		console.error("[topicStatus] Error in getTopicStatusesForLevel:", error);
		return {};
	}
}

/**
 * Mark a topic as completed
 */
export async function markTopicAsCompleted(
	userId: string,
	topicId: string,
	levelId: string,
	courseId: string
): Promise<void> {
	console.log("[topicStatus] Marking topic as completed:", topicId);
	const timestamp = new Date().toISOString();

	const { error } = await supabase.from("user_completed_topics").upsert(
		{
			user_id: userId,
			topic_id: topicId,
			level_id: levelId,
			course_id: courseId,
			updated_at: timestamp,
		},
		{
			onConflict: "user_id,course_id,topic_id",
			ignoreDuplicates: false,
		}
	);

	if (error) {
		console.error("[topicStatus] Error marking topic as completed:", error);
		throw error;
	}
}

/**
 * Mark a topic as in-progress
 * TODO: This is not used anywhere
 */
export async function markTopicAsInProgress(
	userId: string,
	topicId: string,
	levelId: string,
	courseId: string
): Promise<void> {
	console.log("Marking topic as in_progress:", topicId);
	const timestamp = new Date().toISOString();

	// Update the user_progress record to set this as the current_topic_id
	const { error } = await supabase
		.from("user_progress")
		.update({
			current_topic_id: topicId,
			current_level_id: levelId,
			updated_at: timestamp,
		})
		.eq("user_id", userId)
		.eq("course_id", courseId);

	if (error) {
		console.error("Error marking topic as in_progress:", error);
		throw error;
	}
}
