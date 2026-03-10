import { supabase } from "@/integrations/supabase/client";

// Define a type for submissions with profiles
interface SubmissionWithProfile {
	id: string;
	user_id: string;
	sidequest_id: string;
	status: string;
	image?: string;
	user_description?: string;
	user_comment?: string;
	admin_comment?: string;
	created_at: string;
	updated_at: string;
	user_sidequest_id?: string;
	user_name?: string;
	user_avatar?: string;
	sidequest_title?: string;
}

// Function to get submissions with profiles manually
export async function getSubmissionsWithProfiles(): Promise<SubmissionWithProfile[] | null> {
	try {
		// First, get all submissions
		const { data: submissions, error: submissionsError } = await supabase
			.from("quest_submissions")
			.select("*");

		if (submissionsError) {
			console.error("Failed to get submissions:", submissionsError);
			return null;
		}

		// Get all profiles for these submissions
		const userIds = submissions.map((submission) => submission.user_id);
		const { data: profiles, error: profilesError } = await supabase
			.from("profiles")
			.select("id, name, thumbnail")
			.in("id", userIds);

		if (profilesError) {
			console.error("Failed to get profiles:", profilesError);
			return null;
		}

		// Get all sidequests
		const sidequestIds = submissions.map((submission) => submission.sidequest_id);
		const { data: sidequests, error: sidequestsError } = await supabase
			.from("sidequests")
			.select("id, title")
			.in("id", sidequestIds);

		if (sidequestsError) {
			console.error("Failed to get sidequests:", sidequestsError);
			return null;
		}

		// Join the data manually
		const submissionsWithProfiles = submissions.map((submission) => {
			const profile = profiles.find((p) => p.id === submission.user_id);
			const sidequest = sidequests.find((s) => s.id === submission.sidequest_id);

			return {
				...submission,
				user_name: profile?.name || "Unknown User",
				user_avatar: profile?.thumbnail || null,
				sidequest_title: sidequest?.title || "Unknown Quest",
			};
		});

		return submissionsWithProfiles;
	} catch (error) {
		console.error("Error in getSubmissionsWithProfiles:", error);
		return null;
	}
}
