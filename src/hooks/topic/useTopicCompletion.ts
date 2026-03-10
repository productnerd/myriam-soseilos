import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Topic } from "@/types/topic";

/**
 * Hook for managing topic completion status
 *
 * @param topicId - The ID of the topic
 * @param userId - The ID of the authenticated user
 * @returns Topic completion state and functions
 */
export function useTopicCompletion(topicId: string | undefined, userId: string) {
	const [isCompleting, setIsCompleting] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [nextTopic, setNextTopic] = useState<Topic | null>(null);
	const [currentLevelId, setCurrentLevelId] = useState<string | null>(null);

	// Mark a topic as completed
	const completeTopic = async () => {
		if (!topicId) return;

		setIsCompleting(true);
		setError(null);

		try {
			// Get the topic details to get the level and course
			const { data: topic, error: topicError } = await supabase
				.from("topics")
				.select("level_id, order_number")
				.eq("id", topicId)
				.single();

			if (topicError) {
				throw new Error(`Failed to get topic details: ${topicError.message}`);
			}

			const levelId = topic.level_id;
			setCurrentLevelId(levelId);

			// Get the course ID from the level
			const { data: level, error: levelError } = await supabase
				.from("levels")
				.select("course_id")
				.eq("id", levelId)
				.single();

			if (levelError) {
				throw new Error(`Failed to get level details: ${levelError.message}`);
			}

			const courseId = level.course_id;

			// Mark this topic as completed in user_completed_topics
			const { error: completedError } = await supabase.from("user_completed_topics").upsert(
				{
					user_id: userId,
					course_id: courseId,
					level_id: levelId,
					topic_id: topicId,
					updated_at: new Date().toISOString(),
				},
				{
					onConflict: "user_id,course_id,topic_id",
				}
			);

			if (completedError) {
				throw new Error(`Failed to mark topic as completed: ${completedError.message}`);
			}

			// Check if all topics in this level are now completed
			const { data: topicsInLevel } = await supabase
				.from("topics")
				.select("id")
				.eq("level_id", levelId)
				.order("order_number", { ascending: true });

			const { data: completedTopics } = await supabase
				.from("user_completed_topics")
				.select("topic_id")
				.eq("user_id", userId)
				.eq("level_id", levelId);

			const allTopicsInLevelCompleted =
				topicsInLevel && completedTopics && topicsInLevel.length === completedTopics.length;

			if (allTopicsInLevelCompleted) {
				// If all topics in this level are completed, set current_topic_id to null
				// But do NOT change current_level_id
				await supabase
					.from("user_progress")
					.update({
						current_topic_id: null,
						current_activity_id: null,
						updated_at: new Date().toISOString(),
					})
					.eq("user_id", userId)
					.eq("course_id", courseId);

				setNextTopic(null);
				setIsCompleted(true);
				return;
			}

			// Find the next topic in the SAME level
			const { data: nextTopicData } = await supabase
				.from("topics")
				.select("*")
				.eq("level_id", levelId)
				.gt("order_number", topic.order_number)
				.order("order_number", { ascending: true })
				.limit(1)
				.maybeSingle();

			if (nextTopicData) {
				// Update user_progress to point to the next topic in the SAME level
				await supabase
					.from("user_progress")
					.update({
						current_topic_id: nextTopicData.id,
						current_activity_id: null,
						updated_at: new Date().toISOString(),
					})
					.eq("user_id", userId)
					.eq("course_id", courseId);

				setNextTopic(nextTopicData as Topic);
			} else {
				// This was the last topic in the level
				// Set current_topic_id to null but keep the current_level_id
				await supabase
					.from("user_progress")
					.update({
						current_topic_id: null,
						current_activity_id: null,
						updated_at: new Date().toISOString(),
					})
					.eq("user_id", userId)
					.eq("course_id", courseId);

				setNextTopic(null);
			}

			setIsCompleted(true);
		} catch (err) {
			console.error("[useTopicCompletion] Error completing topic:", err);
			setError(err instanceof Error ? err : new Error("Unknown error occurred"));
		} finally {
			setIsCompleting(false);
		}
	};

	// Fetch the topic completion status when the component mounts
	useEffect(() => {
		if (!topicId) return;

		const checkCompletionStatus = async () => {
			try {
				const { data } = await supabase
					.from("user_completed_topics")
					.select("*")
					.eq("user_id", userId)
					.eq("topic_id", topicId)
					.maybeSingle();

				setIsCompleted(!!data);
			} catch (err) {
				console.error("[useTopicCompletion] Error checking topic completion:", err);
			}
		};

		checkCompletionStatus();
	}, [topicId, userId]);

	return {
		completeTopic,
		isCompleting,
		isCompleted,
		error,
		nextTopic,
		currentLevelId,
	};
}
