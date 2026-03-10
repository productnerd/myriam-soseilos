import { supabase } from "@/integrations/supabase/client";

/**
 * Gets the first topic ID for a course
 */
export async function getFirstTopicId(courseId: string): Promise<string | null> {
	try {
		// Try using the DB function first
		const { data: firstTopicId, error: rpcError } = await supabase.rpc(
			"get_first_topic_for_course",
			{
				p_course_id: courseId,
			}
		);

		if (!rpcError && firstTopicId) {
			return firstTopicId;
		}

		// Fallback logic if RPC fails
		// Get the first level ID in this course
		const { data: firstLevel, error: levelError } = await supabase
			.from("levels")
			.select("id")
			.eq("course_id", courseId)
			.order("order_number", { ascending: true })
			.limit(1)
			.single();

		if (levelError || !firstLevel) {
			console.error("Error getting first level:", levelError);
			return null;
		}

		// Get the first topic ID in this level
		const { data: firstTopic, error: topicError } = await supabase
			.from("topics")
			.select("id")
			.eq("level_id", firstLevel.id)
			.order("order_number", { ascending: true })
			.limit(1)
			.single();

		if (topicError || !firstTopic) {
			console.error("Error getting first topic:", topicError);
			return null;
		}

		return firstTopic.id;
	} catch (error) {
		console.error("Error getting first topic ID:", error);
		return null;
	}
}

/**
 * Get the next topic in sequence
 */
export async function getNextTopic(
	levelId: string,
	currentTopicOrderNumber: number
): Promise<{ id: string; title: string } | null> {
	try {
		const { data: nextTopic, error } = await supabase
			.from("topics")
			.select("id, title")
			.eq("level_id", levelId)
			.gt("order_number", currentTopicOrderNumber)
			.order("order_number")
			.limit(1)
			.maybeSingle();

		if (error) {
			console.error("Error getting next topic:", error);
			return null;
		}

		return nextTopic;
	} catch (error) {
		console.error("Error in getNextTopic:", error);
		return null;
	}
}
