import { supabase } from "@/integrations/supabase/client";
import { UserSidequest } from "@/types/user";

// Service for fetching user sidequests (real-life tasks only) with associated sidequest and topic information
export async function fetchUserQuests(userId: string): Promise<UserSidequest[]> {
	console.debug("fetchUserQuests - Starting quest fetch");

	try {
		console.debug("fetchUserQuests - Fetching quests for user:", userId);

		const { data: userQuests, error } = await supabase
			.from("user_sidequests")
			.select(
				`
        *,
        sidequest:sidequests(
          *,
          topic:topics(
            *,
            level:levels(
              *,
              course:courses(*)
            )
          )
        )
      `
			)
			.eq("user_id", userId)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("fetchUserQuests - Database error:", error);
			throw error;
		}

		console.debug("fetchUserQuests - Raw quest data from database:", {
			totalQuests: userQuests?.length || 0,
			questsWithDetails:
				userQuests?.map((q) => ({
					id: q.id,
					title: q.sidequest?.title,
					state: q.state,
					imageFromDB: q.sidequest?.image,
					iconFromDB: q.sidequest?.icon,
					hasValidImage:
						q.sidequest?.image && q.sidequest?.image.startsWith("/lovable-uploads/"),
					hasValidIcon:
						q.sidequest?.icon && q.sidequest?.icon.startsWith("/lovable-uploads/"),
					topicTitle: q.sidequest?.topic?.title,
					courseColor: q.sidequest?.topic?.level?.course?.color,
					hasTopic: !!q.sidequest?.topic,
					questStatus: q.sidequest?.status,
				})) || [],
		});

		// Filter out quests where the sidequest itself is not ACTIVE
		const activeQuests =
			userQuests?.filter((q) => {
				const isActive = q.sidequest?.status === "ACTIVE";
				if (!isActive) {
					console.debug("Filtering out inactive quest:", {
						title: q.sidequest?.title,
						status: q.sidequest?.status,
					});
				}
				return isActive;
			}) || [];

		console.debug("fetchUserQuests - FINAL ACTIVE QUESTS WITH VALID ASSETS:", {
			activeQuestsCount: activeQuests.length,
			realLifeQuests: activeQuests.length, // All are real-life quests now
			questsWithValidImages: activeQuests.filter(
				(q) => q.sidequest?.image && q.sidequest?.image.startsWith("/lovable-uploads/")
			).length,
			questsWithValidIcons: activeQuests.filter(
				(q) => q.sidequest?.icon && q.sidequest?.icon.startsWith("/lovable-uploads/")
			).length,
			allAssetData: activeQuests.map((q) => ({
				title: q.sidequest?.title,
				image: q.sidequest?.image,
				icon: q.sidequest?.icon,
				imageIsValid:
					q.sidequest?.image && q.sidequest?.image.startsWith("/lovable-uploads/"),
				iconIsValid: q.sidequest?.icon && q.sidequest?.icon.startsWith("/lovable-uploads/"),
			})),
		});

		// Type assertion to ensure compatibility with UserSidequest interface
		return activeQuests as UserSidequest[];
	} catch (error) {
		console.error("fetchUserQuests - Failed to fetch quests:", error);
		throw error;
	}
}
