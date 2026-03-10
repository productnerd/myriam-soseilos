import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/types/supabase";

interface QuestSubmissionData {
	userId: string;
	sidequestId: string;
	userSidequestId?: string;
	image?: File | null;
	comment?: string;
	description?: string;
}

type QuestSubmission = Database["public"]["Tables"]["quest_submissions"]["Row"];

// Service for submitting a quest for review
export const submitQuestForReview = async ({
	userId,
	sidequestId,
	userSidequestId,
	image,
	comment,
	description,
}: QuestSubmissionData): Promise<QuestSubmission> => {
	console.debug(`Submitting quest ${sidequestId} for review by user ${userId}`);

	try {
		let imageUrl = null;

		// 1. If there's an image, upload it first
		if (image) {
			console.debug(`Uploading image for quest submission: ${image.name}`);

			const fileExt = image.name.split(".").pop();
			const fileName = `${userId}/${sidequestId}-${Math.random()
				.toString(36)
				.substring(2)}.${fileExt}`;

			const { data: uploadData, error: uploadError } = await supabase.storage
				.from("quest-submissions")
				.upload(fileName, image, {
					cacheControl: "3600",
					upsert: false,
				});

			if (uploadError) {
				console.error("Failed to upload image:", uploadError);
				throw new Error(`Failed to upload image: ${uploadError.message}`);
			}

			console.debug("Image uploaded successfully:", uploadData.path);

			// Get the public URL for the image
			const { data: urlData } = supabase.storage
				.from("quest-submissions")
				.getPublicUrl(uploadData.path);

			imageUrl = urlData.publicUrl;
			console.debug("Image public URL:", imageUrl);
		}

		// 2. Update the user_sidequest status to IN_REVIEW first (optimistic update)
		if (userSidequestId) {
			console.debug(`Updating user_sidequest ${userSidequestId} status to IN_REVIEW`);

			const { error: updateError } = await supabase.rpc("update_user_sidequest_state", {
				p_user_sidequest_id: userSidequestId,
				p_new_state: "IN_REVIEW" as const,
				p_completed_at: null,
			});

			if (updateError) {
				console.error("Failed to update user_sidequest status:", updateError);
				throw new Error(`Failed to update quest status: ${updateError.message}`);
			}

			console.debug("User quest status updated to IN_REVIEW successfully");
		}

		// 3. Create the submission record
		const { data: submissionData, error: submissionError } = await supabase
			.from("quest_submissions")
			.insert({
				user_id: userId,
				sidequest_id: sidequestId,
				user_sidequest_id: userSidequestId,
				image: imageUrl,
				user_comment: comment,
				user_description: description,
				status: "pending",
			})
			.select()
			.single();

		if (submissionError) {
			console.error("Failed to create submission:", submissionError);

			// Revert the status update if submission creation fails
			if (userSidequestId) {
				await supabase.rpc("update_user_sidequest_state", {
					p_user_sidequest_id: userSidequestId,
					p_new_state: "LIVE" as const,
					p_completed_at: null,
				});
			}

			throw new Error(`Failed to create submission: ${submissionError.message}`);
		}

		console.debug("Submission created successfully:", submissionData);
		return submissionData;
	} catch (error) {
		console.error("Error in submitQuestForReview:", error);
		throw error;
	}
};

// Notifications related to submission operations
export const submissionNotifications = {
	onSuccess: (data: QuestSubmission) => {
		toast.success("Quest submitted for review");
		console.debug("Quest submission successful:", data);
	},
	onError: (error: Error) => {
		toast.error(`Failed to submit quest: ${error.message}`);
		console.error("Quest submission error:", error);
	},
};
