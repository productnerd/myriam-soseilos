import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { awardDarkPoints } from "@/utils/points/pointsUtils";
import { ActivitySubmission } from "@/types/activity";

export function useActivitySubmissions() {
	const queryClient = useQueryClient();

	const approve = useMutation({
		mutationFn: async ({ id, darkPoints = 1 }: { id: string; darkPoints?: number }) => {
			const { data, error } = await supabase
				.from("new_activity_submissions")
				.update({
					status: "approved",
					reviewed_at: new Date().toISOString(),
					dark_points_awarded: darkPoints,
				})
				.eq("id", id)
				.select("user_id");

			if (error) throw error;

			if (data?.[0]?.user_id) {
				// Award custom amount of dark points (1-3)
				await awardDarkPoints(data[0].user_id, darkPoints);
			}

			return data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["activity-submissions"] });
			toast.success(
				`Submission approved and ${variables.darkPoints} dark point${
					variables.darkPoints !== 1 ? "s" : ""
				} awarded`
			);
		},
		onError: (error) => {
			toast.error(`Error approving submission: ${error.message}`);
		},
	});

	const reject = useMutation({
		mutationFn: async ({ id, comment }: { id: string; comment: string | null }) => {
			const { data, error } = await supabase
				.from("new_activity_submissions")
				.update({
					status: "rejected",
					admin_comment: comment,
					reviewed_at: new Date().toISOString(),
				})
				.eq("id", id)
				.select();

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["activity-submissions"] });
			toast.success("Submission rejected");
		},
		onError: (error) => {
			toast.error(`Error rejecting submission: ${error.message}`);
		},
	});

	const { data: submissions, isLoading, error } = useActivitySubmissionsQuery();

	return {
		submissions,
		isLoading,
		error,
		approve: approve.mutate,
		reject: reject.mutate,
		isApproving: approve.isPending,
		isRejecting: reject.isPending,
	};
}

const useActivitySubmissionsQuery = () => {
	return useQuery({
		queryKey: ["activity-submissions"],
		queryFn: async (): Promise<ActivitySubmission[]> => {
			// First, fetch all pending submissions
			const { data: submissionsData, error: submissionsError } = await supabase
				.from("new_activity_submissions")
				.select("*")
				.eq("status", "pending")
				.order("created_at", { ascending: false });

			if (submissionsError) {
				console.error("Error fetching activity submissions:", submissionsError);
				throw submissionsError;
			}

			// Then, for each submission, fetch the user profile separately
			const submissions: ActivitySubmission[] = await Promise.all(
				submissionsData.map(async (submission) => {
					// Fetch user profile data
					const { data: userData, error: userError } = await supabase
						.from("profiles")
						.select("name, email, grey_points, dark_points, flag, tags")
						.eq("id", submission.user_id)
						.single();

					let user = {
						id: submission.user_id,
						name: "Unknown User",
						email: null,
						grey_points: 0,
						dark_points: 0,
						flag: null,
						tags: [],
					};

					if (!userError && userData) {
						user = {
							id: submission.user_id,
							name: userData.name || "Unknown User",
							email: userData.email,
							grey_points: userData.grey_points || 0,
							dark_points: userData.dark_points || 0,
							flag: userData.flag,
							tags: userData.tags || [],
						};
					} else {
						console.warn(
							`Could not fetch user data for submission ${submission.id}:`,
							userError
						);
					}

					// Cast status to the correct type to satisfy TypeScript
					const status = submission.status as "pending" | "approved" | "rejected";

					// Build the final submission object with properly typed data
					return {
						...submission,
						status,
						user,
						topic: submission.topic_id ? { title: "Unknown Topic" } : undefined,
					} as ActivitySubmission; // Use type assertion to handle options property
				})
			);

			return submissions;
		},
	});
};
