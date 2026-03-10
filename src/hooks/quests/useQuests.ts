import { useQuestsQuery } from "./useQuestsQuery";
import { useSelfExplorationQuestsQuery } from "./useSelfExplorationQuests";
import { useQuestsMutation } from "./useQuestsMutation";
import { useClaimQuestRewards } from "./useClaimQuestRewards";

/**
 * Hook for working with quests, combining query and mutation functionality.
 *
 * @param userId - The ID of the authenticated user
 * @returns Quest data and mutation functions
 */
export function useQuests(userId: string) {
	const {
		data: userQuests,
		isLoading: isLoadingRealLife,
		error: errorRealLife,
	} = useQuestsQuery(userId);

	const {
		data: selfExplorationQuests,
		isLoading: isLoadingSelfExploration,
		error: errorSelfExploration,
	} = useSelfExplorationQuestsQuery(userId);

	const { toggleQuestHiddenStatus, submitQuestForReview, completeQuest } = useQuestsMutation();

	const {
		mutate: claimQuestRewardsMutate,
		isPending: isClaimingRewards,
		celebrationQuest,
		clearCelebration,
	} = useClaimQuestRewards();

	// Combine loading and error states
	const isLoading = isLoadingRealLife || isLoadingSelfExploration;
	const error = errorRealLife || errorSelfExploration;

	// Create a combined submit function that handles image uploads
	const submitQuest = async (
		questData: any,
		imageFile: File | null,
		comment: string | null,
		description: string | null
	) => {
		console.debug("useQuests.submitQuest called with:", {
			questId: questData.id,
			sidequest_id: questData.sidequest_id,
			hasImageFile: !!imageFile,
			commentLength: comment?.length || 0,
			descriptionLength: description?.length || 0,
			questState: questData.state,
			questRequirements: {
				requireImage: questData.sidequest?.require_image,
				requireDescription: questData.sidequest?.require_description,
			},
		});

		try {
			console.debug("useQuests.submitQuest - Current user:", {
				userId: userId,
				questUserId: questData.user_id,
			});

			// Check if we need to handle auto-completion for quests that don't require submission
			const requiresNoSubmission =
				!questData.sidequest?.require_image && !questData.sidequest?.require_description;

			if (requiresNoSubmission) {
				console.debug(
					"useQuests.submitQuest - Quest requires no submission, marking as completed"
				);
				// If the quest doesn't require any submission, mark it as complete directly
				await completeQuest.mutate(questData);
				return;
			}

			console.debug("useQuests.submitQuest - Submitting with userId:", {
				originalId: questData.id,
				userId: userId,
				sidequestId: questData.sidequest_id,
			});

			// Submit the quest with the correct parameters
			await submitQuestForReview.mutate({
				userId,
				sidequestId: questData.sidequest_id,
				userSidequestId: questData.id,
				image: imageFile,
				comment,
				description,
			});
		} catch (error) {
			console.error("useQuests.submitQuest:", error);
			// Re-throw the error so it can be handled by the UI
			throw error;
		}
	};

	return {
		userQuests,
		selfExplorationQuests,
		isLoading,
		error,
		toggleQuestHiddenStatus,
		submitQuest,
		completeQuest,
		submitQuestForReview,
		claimQuestRewards: claimQuestRewardsMutate,
		isClaimingRewards,
		celebrationQuest,
		clearCelebration,
	};
}
