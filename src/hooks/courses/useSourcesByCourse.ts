import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Source } from "@/types/sources";
import { useEffect } from "react";

// Sample sources for display when no real sources exist
const sampleSources: Source[] = [
	{
		id: "sample-1",
		title: "Trainable Spaced Repetition Model for Language Learning",
		author: "Burr Settles, Brendan Meeder",
		source_type: "paper",
		image_url: "https://picsum.photos/id/24/200/200",
	},
	{
		id: "sample-2",
		title: "Deep Work",
		author: "Cal Newport",
		source_type: "book",
		image_url: "https://picsum.photos/id/306/200/200",
	},
	{
		id: "sample-3",
		title: "Hardcore History",
		author: "Dan Carlin",
		source_type: "podcast",
		image_url: "https://picsum.photos/id/1073/200/200",
	},
];

export function useSourcesByCourse(courseId: string | null) {
	// Get the query client to manually invalidate queries
	const queryClient = useQueryClient();

	// When the courseId changes, invalidate the previous query
	useEffect(() => {
		if (courseId) {
			// Invalidate the query when courseId changes
			queryClient.invalidateQueries({
				queryKey: ["sources", courseId],
			});
		}
	}, [courseId, queryClient]);

	return useQuery({
		queryKey: ["sources", courseId],
		queryFn: async () => {
			if (!courseId) return [];

			console.log("[useSourcesByCourse] Fetching sources for course", courseId);

			const { data, error } = await supabase
				.from("course_sources")
				.select("*, source:sources(*)")
				.eq("course_id", courseId);

			if (error) {
				console.error("[useSourcesByCourse] Error fetching sources:", error);
				throw error;
			}

			// Extract sources from the joined data
			let sources = data.map((item) => item.source) as Source[];

			// If no sources found, provide sample sources for visualization purposes
			if (sources.length === 0) {
				console.log("[useSourcesByCourse] No sources found, using sample data");
				sources = sampleSources;
			}

			console.log(
				`[useSourcesByCourse] Found ${sources.length} sources for course ${courseId}`,
				sources
			);
			return sources;
		},
		enabled: !!courseId,
	});
}
