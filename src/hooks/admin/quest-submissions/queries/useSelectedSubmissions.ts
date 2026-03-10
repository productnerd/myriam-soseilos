
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuestSubmission } from "@/types/quests";
import { processUserData } from "../utils/userDataProcessing";
import { toast } from "sonner";

/**
 * Hook for fetching submissions for a specific sidequest
 */
export function useSelectedSubmissions(selectedSidequest: string | null) {
	return useQuery({
		queryKey: ["quest_submissions", "by_sidequest", selectedSidequest],
		queryFn: async () => {
			if (!selectedSidequest) return [];

			console.debug(`Fetching submissions for sidequest ${selectedSidequest}`);

			try {
				// Fetch submissions for this sidequest
				const { data: submissions, error: submissionsError } = await supabase
					.from("quest_submissions")
					.select(
						`
            id, 
            sidequest_id, 
            user_id, 
            user_sidequest_id,
            image, 
            user_comment, 
            user_description,
            admin_comment, 
            status, 
            created_at, 
            updated_at
          `
					)
					.eq("sidequest_id", selectedSidequest)
					.order("created_at", { ascending: false });

				if (submissionsError) {
					console.error(`Failed to fetch submissions: ${submissionsError.message}`);
					throw new Error(`Failed to fetch submissions: ${submissionsError.message}`);
				}

				if (!submissions || submissions.length === 0) {
					console.debug("No submissions found for this sidequest");
					return [];
				}

				// Fetch sidequest data
				const { data: sidequest, error: sidequestError } = await supabase
					.from("sidequests")
					.select(
						`
            id, 
            title, 
            description,
            dark_token_reward,
            grey_token_reward,
            topic_id,
            require_image,
            require_description,
            instructions,
            topic:topic_id (
              id, 
              title,
              level:level_id (
                id,
                title,
                course:course_id (
                  id,
                  title,
                  color
                )
              )
            )
          `
					)
					.eq("id", selectedSidequest)
					.single();

				if (sidequestError) {
					console.error(`Failed to fetch sidequest details: ${sidequestError.message}`);
				}

				// Get unique user IDs
				const userIds = [...new Set(submissions.map((s) => s.user_id))];

				// Fetch user profiles
				const { data: profiles, error: profilesError } = await supabase
					.from("profiles")
					.select("id, name, email, grey_points, dark_points, flag, tags, thumbnail")
					.in("id", userIds);

				if (profilesError) {
					console.error(`Failed to fetch user profiles: ${profilesError.message}`);
				}

				// Create a profile map for easier lookup
				const profileMap: Record<string, any> = {};
				if (profiles) {
					profiles.forEach((profile) => {
						profileMap[profile.id] = profile;
					});
				}

				// Build complete submission objects
				return submissions.map((submission) => {
					const { userData } = processUserData(
						profileMap[submission.user_id],
						submission.user_id
					);

					return {
						...submission,
						sidequest,
						user: userData,
					} as QuestSubmission;
				});
			} catch (error) {
				console.error("Failed to fetch submissions:", error);
				toast.error("Failed to load submissions. Please try refreshing the page.");
				throw error;
			}
		},
		enabled: !!selectedSidequest,
		retryOnMount: true,
		retry: 3,
		retryDelay: (attempt) => Math.min(attempt > 1 ? 2000 : 1000, 30 * 1000),
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}
