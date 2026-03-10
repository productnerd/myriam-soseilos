import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FriendResponse, PollData } from "@/types/integrations";

/**
 * Hook for managing poll data
 *
 * @param userId - The ID of the authenticated user
 * @param activityId - The ID of the activity
 * @returns Poll data state and functions
 */
export function usePollData(userId: string, activityId: string | undefined) {
	const [data, setData] = useState<PollData>({
		statistics: {},
		friendResponses: {},
		userResponse: null,
		isLoading: true,
		error: null,
	});

	// Fetch poll statistics and responses
	useEffect(() => {
		if (!activityId) return;

		const fetchPollData = async () => {
			try {
				// Fetch activity statistics
				const { data: activityData, error: activityError } = await supabase
					.from("activities")
					.select("statistics")
					.eq("id", activityId)
					.single();

				if (activityError) throw activityError;

				// Fetch user's response
				// We need to use the generic query method to avoid TypeScript errors
				const { data: userResponseData, error: userResponseError } = (await supabase
					.from("poll_responses")
					.select("selected_option")
					.eq("activity_id", activityId)
					.eq("user_id", userId)
					.maybeSingle()) as any; // Using 'any' to bypass type checking

				if (userResponseError) throw userResponseError;

				// Fetch friend responses
				const { data: friends, error: friendsError } = await supabase
					.from("user_friends")
					.select("friend_id")
					.eq("user_id", userId);

				if (friendsError) throw friendsError;

				const friendIds = friends.map((f) => f.friend_id);

				// Only fetch if there are friends
				let friendResponses: Record<string, FriendResponse[]> = {};
				if (friendIds.length > 0) {
					// Get friend responses and their sharing preferences
					const { data: friendsData, error: friendsDataError } = (await supabase
						.from("poll_responses")
						.select(
							`
              selected_option,
              profiles:user_id(name, thumbnail, poll_sharing)
            `
						)
						.eq("activity_id", activityId)
						.in("user_id", friendIds)) as any;

					if (friendsDataError) throw friendsDataError;

					// Group friend responses by option, filtering out friends who have poll_sharing=false
					friendResponses = ((friendsData || []) as any[])
						.filter((item) => {
							const profile = item.profiles as {
								name: string;
								thumbnail: string | null;
								poll_sharing: boolean;
							};
							return profile.poll_sharing !== false; // Only include friends who share poll answers
						})
						.reduce<Record<string, FriendResponse[]>>((acc, item) => {
							const vote = item.selected_option;
							const profile = item.profiles as {
								name: string;
								thumbnail: string | null;
								poll_sharing: boolean;
							};

							if (!acc[vote]) {
								acc[vote] = [];
							}

							acc[vote].push({
								name: profile.name || "Anonymous",
								thumbnail: profile.thumbnail,
								vote,
								poll_sharing: profile.poll_sharing,
							});

							return acc;
						}, {});
				}

				// Parse statistics or use an empty object if null
				const statistics: Record<string, number> =
					(activityData?.statistics as Record<string, number>) || {};

				// Ensure no negative values in statistics
				const validatedStats: Record<string, number> = {};
				for (const [key, value] of Object.entries(statistics)) {
					validatedStats[key] = Math.max(0, value);
				}

				setData({
					statistics: validatedStats,
					friendResponses,
					userResponse: userResponseData?.selected_option || null,
					isLoading: false,
					error: null,
				});
			} catch (error) {
				console.error("Error fetching poll data:", error);
				setData((prev) => ({ ...prev, isLoading: false, error: error as Error }));
			}
		};

		fetchPollData();

		// Set up real-time subscription for poll responses
		const channel = supabase
			.channel("poll-updates")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "poll_responses",
					filter: `activity_id=eq.${activityId}`,
				},
				() => {
					// When any changes happen, refetch the data
					fetchPollData();
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [activityId, userId]);

	// Function to submit a poll response
	const submitResponse = async (option: string) => {
		if (!activityId) return;

		try {
			// Using 'any' to bypass type checking for the poll_responses table
			const { error } = await (supabase.from("poll_responses") as any).upsert(
				{
					activity_id: activityId,
					user_id: userId,
					selected_option: option,
				},
				{ onConflict: "user_id,activity_id" }
			);

			if (error) throw error;

			// The trigger will update statistics automatically
			// We'll get the updated data via the realtime subscription
		} catch (error) {
			console.error("Error submitting poll response:", error);
			setData((prev) => ({ ...prev, error: error as Error }));
		}
	};

	return {
		...data,
		submitResponse,
	};
}
