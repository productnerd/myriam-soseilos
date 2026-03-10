import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuestSubmissionGroup, QuestSubmission } from "@/types/quests";
import { processUserData } from "../utils/userDataProcessing";
import { toast } from "sonner";

/**
 * Hook for fetching quest submissions grouped by sidequest
 */
export function useSubmissionGroups() {
	return useQuery({
		queryKey: ["quest_submissions", "grouped"],
		queryFn: async () => {
			console.debug("Fetching quest submissions grouped by sidequest");

			try {
				// Fetch submissions using a more resilient approach
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
					.order("created_at", { ascending: false });

				if (submissionsError) {
					console.error("Failed to fetch submissions:", submissionsError);
					throw new Error(`Failed to fetch submissions: ${submissionsError.message}`);
				}

				if (!submissions || submissions.length === 0) {
					console.debug("No quest submissions found");
					return [];
				}

				// Get unique sidequest IDs to fetch sidequest details
				const sidequestIds = [...new Set(submissions.map((s) => s.sidequest_id))];

				// Fetch sidequest data separately
				const { data: sidequests, error: sidequestsError } = await supabase
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
					.in("id", sidequestIds);

				if (sidequestsError) {
					console.error("Failed to fetch sidequest details:", sidequestsError);
					throw new Error(
						`Failed to fetch sidequest details: ${sidequestsError.message}`
					);
				}

				// Get unique user IDs to fetch user details
				const userIds = [...new Set(submissions.map((s) => s.user_id))];

				// Fetch user profiles separately
				const { data: profiles, error: profilesError } = await supabase
					.from("profiles")
					.select("id, name, email, grey_points, dark_points, flag, tags, thumbnail")
					.in("id", userIds);

				if (profilesError) {
					console.error("Failed to fetch user profiles:", profilesError);
				}

				// Create lookup objects for faster access
				const sidequestMap = Object.fromEntries(
					(sidequests || []).map((sidequest) => [sidequest.id, sidequest])
				);

				const profileMap = Object.fromEntries(
					(profiles || []).map((profile) => [profile.id, profile])
				);

				// Combine data manually
				const enhancedSubmissions = submissions.map((submission) => {
					const sidequest = sidequestMap[submission.sidequest_id];
					const userProfile = profileMap[submission.user_id];

					const { userData } = processUserData(userProfile, submission.user_id);

					return {
						...submission,
						sidequest,
						user: userData,
					} as QuestSubmission;
				});

				return processSubmissionsIntoGroups(enhancedSubmissions);
			} catch (error) {
				console.error("Failed to fetch quest submissions:", error);
				toast.error("Failed to load submissions. Please try refreshing the page.");
				throw error;
			}
		},
		retry: 3,
		retryDelay: (attempt) => Math.min(attempt > 1 ? 2000 : 1000, 30 * 1000),
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

/**
 * Helper function to process submissions into grouped format
 */
function processSubmissionsIntoGroups(submissions: QuestSubmission[]): QuestSubmissionGroup[] {
	// Group submissions by sidequest
	const groupedSubmissions: Record<string, QuestSubmissionGroup> = {};

	submissions.forEach((submission) => {
		if (!submission.sidequest) {
			console.warn("[WARN] Submission without sidequest found:", submission.id);
			return;
		}

		const sidequestId = submission.sidequest.id;

		if (!groupedSubmissions[sidequestId]) {
			groupedSubmissions[sidequestId] = {
				sidequest: submission.sidequest,
				pendingCount: 0,
				totalCount: 0,
				submissions: [],
			};
		}

		groupedSubmissions[sidequestId].submissions.push(submission);
		groupedSubmissions[sidequestId].totalCount += 1;

		if (submission.status === "pending") {
			groupedSubmissions[sidequestId].pendingCount += 1;
		}
	});

	// Convert the record to an array and sort by pending count (desc)
	return Object.values(groupedSubmissions).sort(
		(a, b) => b.pendingCount - a.pendingCount || b.totalCount - a.totalCount
	);
}
