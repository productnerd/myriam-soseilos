import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/types/supabase";

type QuestSubmission = Database["public"]["Tables"]["quest_submissions"]["Row"] & {
	sidequest?: {
		grey_token_reward: number;
		dark_token_reward: number;
	};
};

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Hook for quest submission mutations (approve/reject)
 */
export function useQuestSubmissionsMutation() {
	const queryClient = useQueryClient();

	// Mutation to approve a submission
	const approveMutation = useMutation({
		mutationFn: async ({
			submissionId,
			adminComment,
		}: {
			submissionId: string;
			adminComment: string;
		}): Promise<QuestSubmission> => {
			console.debug(
				`Approving quest submission ${submissionId} with comment: ${adminComment}`
			);

			try {
				// 1. First update the submission status and admin comment
				const { data: updatedSubmission, error: updateError } = await supabase
					.from("quest_submissions")
					.update({
						status: "approved",
						admin_comment: adminComment,
					})
					.eq("id", submissionId)
					.select(
						"*, user_id, sidequest_id, user_sidequest_id, sidequest:sidequests(grey_token_reward, dark_token_reward)"
					)
					.single();

				if (updateError) {
					console.error(
						`Failed to update quest submission ${submissionId}:`,
						updateError
					);
					throw new Error(`Failed to update submission: ${updateError.message}`);
				}

				if (!updatedSubmission) {
					throw new Error("No submission data returned after update");
				}

				// Get necessary data for next steps
				const {
					user_id: userId,
					sidequest_id: sidequestId,
					user_sidequest_id: userSidequestId,
					sidequest,
				} = updatedSubmission;

				if (!sidequest) {
					throw new Error("Sidequest data not found in the updated submission");
				}

				const { grey_token_reward, dark_token_reward } = sidequest;

				// 2. Update the user_sidequests table using the custom function
				// If user_sidequest_id is available, use that for the update
				let userQuestResult;

				if (userSidequestId) {
					console.debug(`Updating user_sidequest by ID: ${userSidequestId}`);
					userQuestResult = await supabase.rpc("update_user_sidequest_state", {
						p_user_sidequest_id: userSidequestId,
						p_new_state: "COMPLETED" as const,
						p_completed_at: new Date().toISOString(),
					});
				} else {
					// Otherwise use user_id and sidequest_id for the update
					console.debug(
						`Updating user_sidequest by user_id and sidequest_id: ${userId}, ${sidequestId}`
					);
					userQuestResult = await supabase.rpc("update_user_sidequest_by_ids", {
						p_user_id: userId,
						p_sidequest_id: sidequestId,
						p_new_state: "COMPLETED" as const,
						p_completed_at: new Date().toISOString(),
					});
				}

				if (userQuestResult.error) {
					console.error("Failed to update user_sidequest:", userQuestResult.error);
					throw new Error(
						`Failed to update user_sidequest: ${userQuestResult.error.message}`
					);
				}

				console.debug("User quest updated successfully:", userQuestResult.data);

				// 3. Award points to user
				if (grey_token_reward > 0 || dark_token_reward > 0) {
					console.debug(
						`Awarding ${grey_token_reward} grey tokens and ${dark_token_reward} dark tokens to user ${userId}`
					);

					// Get current points first
					const { data: profileData, error: profileError } = await supabase
						.from("profiles")
						.select("grey_points, dark_points")
						.eq("id", userId)
						.single();

					if (profileError) {
						console.error("Failed to get user profile:", profileError);
						throw new Error(`Failed to get user profile: ${profileError.message}`);
					}

					if (!profileData) {
						throw new Error("No profile data found");
					}

					// Calculate new point values
					const newGreyPoints = (profileData.grey_points || 0) + grey_token_reward;
					const newDarkPoints = (profileData.dark_points || 0) + dark_token_reward;

					// Update the profile with new point values
					const { error: pointsUpdateError } = await supabase
						.from("profiles")
						.update({
							grey_points: newGreyPoints,
							dark_points: newDarkPoints,
							updated_at: new Date().toISOString(),
						})
						.eq("id", userId);

					if (pointsUpdateError) {
						console.error("Failed to award points:", pointsUpdateError);
						throw new Error(`Failed to award points: ${pointsUpdateError.message}`);
					}
				}

				return updatedSubmission;
			} catch (error) {
				console.error("Error in approve mutation:", error);
				throw error;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["quest_submissions"] });
			toast.success("Quest submission approved");
		},
		onError: (error) => {
			console.error("Approval mutation error:", error);
			toast.error(
				`Approval failed: ${error instanceof Error ? error.message : "Unknown error"}`
			);
		},
	});

	// Mutation to reject a submission
	const rejectMutation = useMutation({
		mutationFn: async ({
			submissionId,
			adminComment,
		}: {
			submissionId: string;
			adminComment: string;
		}): Promise<QuestSubmission[]> => {
			console.debug(
				`Rejecting quest submission ${submissionId} with comment: ${adminComment}`
			);

			// Update the submission status to rejected
			const { data, error } = await supabase
				.from("quest_submissions")
				.update({
					status: "rejected",
					admin_comment: adminComment,
				})
				.eq("id", submissionId)
				.select();

			if (error) {
				console.error(`Failed to reject submission ${submissionId}:`, error);
				throw new Error(`Failed to reject submission: ${error.message}`);
			}

			if (!data) {
				throw new Error("No data returned after rejection");
			}

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["quest_submissions"] });
			toast.success("Quest submission rejected");
		},
		onError: (error) => {
			console.error("Reject mutation error:", error);
			toast.error(
				`Rejection failed: ${error instanceof Error ? error.message : "Unknown error"}`
			);
		},
	});

	return {
		approveSubmission: approveMutation.mutate,
		rejectSubmission: rejectMutation.mutate,
	};
}
