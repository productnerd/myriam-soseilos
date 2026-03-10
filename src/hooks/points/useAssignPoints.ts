
import { useState } from "react";
import { assignPointsToUser } from "@/utils/points/learnPointsAssigment/topicPoints";
import { assignLevelCompletionPoints } from "@/utils/points/learnPointsAssigment/levelPoints";
import { assignInvitePoints } from "@/utils/points/invitePointsAssignment";
import { assignQuestRewards } from "@/utils/points/questPointsAssignment";
import { useToast } from "@/hooks/ui/useToast";
import { supabase } from "@/integrations/supabase/client";

export function useAssignPoints() {
	const [isAssigning, setIsAssigning] = useState(false);
	const { toast: uiToast } = useToast();

	/**
	 * Assigns points to a user when they complete a topic
	 */
	const assignTopicCompletionPoints = async (
		userId: string | undefined,
		topicId: string | undefined
	) => {
		setIsAssigning(true);
		try {
			const result = await assignPointsToUser(userId, topicId);
			return result;
		} finally {
			setIsAssigning(false);
		}
	};

	/**
	 * Assigns points to a user when they pass a level test
	 */
	const assignLevelPoints = async (userId: string | undefined, levelId: string | undefined) => {
		setIsAssigning(true);
		try {
			const result = await assignLevelCompletionPoints(userId, levelId);
			return result;
		} finally {
			setIsAssigning(false);
		}
	};

	/**
	 * Assigns points to both users when an invite is used
	 */
	const assignFriendInvitePoints = async (inviterId: string, inviteeId: string) => {
		setIsAssigning(true);
		try {
			const result = await assignInvitePoints(inviterId, inviteeId);
			return result;
		} finally {
			setIsAssigning(false);
		}
	};

	/**
	 * Assigns both dark and grey points to a user, typically for quest completion
	 */
	const assignQuestPointsWrapper = async (
		darkPointsAmount: number = 0,
		greyPointsAmount: number = 0,
		questTitle: string
	) => {
		setIsAssigning(true);
		try {
			// Get the current user
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				throw new Error("User not authenticated");
			}

			const result = await assignQuestRewards(
				user.id,
				greyPointsAmount,
				darkPointsAmount,
				questTitle
			);
			return result;
		} finally {
			setIsAssigning(false);
		}
	};

	return {
		assignTopicCompletionPoints,
		assignLevelPoints,
		assignQuestPoints: assignQuestPointsWrapper,
		assignFriendInvitePoints,
		isAssigning,
	};
}
