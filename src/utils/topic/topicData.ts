import { supabase } from "@/integrations/supabase/client";
import { Topic } from "@/types/topic";

/**
 * Get topic's information
 */
export async function getTopicById(topicId: string): Promise<Topic | null> {
	try {
		if (!topicId) return null;

		const { data, error } = await supabase
			.from("topics")
			.select("*")
			.eq("id", topicId)
			.single();

		if (error) {
			console.error("Error fetching topic by ID:", error);
			return null;
		}

		return data as Topic;
	} catch (error) {
		console.error("Error in getTopicById:", error);
		return null;
	}
}

/**
 * Get the next topic in the same level
 */
export async function getNextTopicInLevel(
	topicId: string
): Promise<{ id: string; title: string } | null> {
	try {
		if (!topicId) return null;

		// Get current topic's information (including level_id and order_number)
		const currentTopic = await getTopicById(topicId);

		if (!currentTopic) return null;

		// Get the next topic in the same level
		const { data, error } = await supabase
			.from("topics")
			.select("id, title")
			.eq("level_id", currentTopic.level_id)
			.gt("order_number", currentTopic.order_number)
			.order("order_number", { ascending: true })
			.limit(1)
			.maybeSingle();

		if (error) {
			console.error("Error fetching next topic:", error);
			return null;
		}

		return data;
	} catch (error) {
		console.error("Error in getNextTopicInLevel:", error);
		return null;
	}
}

/**
 * Get all topics for a level
 */
export async function getTopicsForLevel(levelId: string): Promise<Topic[]> {
	try {
		if (!levelId) return [];

		const { data, error } = await supabase
			.from("topics")
			.select("*")
			.eq("level_id", levelId)
			.order("order_number");

		if (error) {
			console.error("Error fetching topics for level:", error);
			return [];
		}

		return data as Topic[];
	} catch (error) {
		console.error("Error in getTopicsForLevel:", error);
		return [];
	}
}

/**
 * Get all topics for a course (across all levels)
 */
export async function getTopicsByCourse(courseId: string): Promise<Topic[]> {
	try {
		if (!courseId) return [];

		// First get all level IDs for this course
		const { data: levels, error: levelsError } = await supabase
			.from("levels")
			.select("id")
			.eq("course_id", courseId);

		if (levelsError) {
			console.error("Error fetching levels for course:", levelsError);
			return [];
		}

		if (!levels || levels.length === 0) return [];

		const levelIds = levels.map((l) => l.id);

		// Then get all topics for these levels
		const { data: topicsData, error: topicsError } = await supabase
			.from("topics")
			.select("*")
			.in("level_id", levelIds)
			.order("order_number");

		if (topicsError) {
			console.error("Error fetching topics for course:", topicsError);
			return [];
		}

		return topicsData;
	} catch (error) {
		console.error("Error in getTopicsByCourse:", error);
		return [];
	}
}
