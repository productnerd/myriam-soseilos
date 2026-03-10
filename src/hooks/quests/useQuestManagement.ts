import { useCallback } from "react";
import { addQuestsOnCourseStart } from "@/utils/quests/addQuestsOnCourseStart";
import { addQuestsOnUserCreation } from "@/utils/quests/addQuestsOnUserCreation";

/**
 * Hook to manage quest creation for new users and course starts
 *
 * @param userId - The ID of the authenticated user
 * @returns Quest management functions
 */
export const useQuestManagement = (userId: string) => {
	const handleCourseStart = useCallback(
		async (courseId: string) => {
			try {
				await addQuestsOnCourseStart(userId, courseId);
			} catch (error) {
				console.error("Error adding quests on course start:", error);
			}
		},
		[userId]
	);

	const handleUserCreation = useCallback(async (newUserId: string) => {
		try {
			await addQuestsOnUserCreation(newUserId);
		} catch (error) {
			console.error("Error adding quests on user creation:", error);
		}
	}, []);

	return {
		handleCourseStart,
		handleUserCreation,
	};
};
