import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { shouldShowToast } from "@/utils/ui/toastUtils";

/**
 * Checks for and unlocks quests based on user's grey points
 */
export async function checkGreyPointQuestUnlocks(userId: string): Promise<void> {
	try {
		console.log(
			`[checkGreyPointQuestUnlocks] Checking grey point quest unlocks for user ${userId}`
		);

		// Get user's grey points
		const { data: profile, error: profileError } = await supabase
			.from("profiles")
			.select("grey_points")
			.eq("id", userId)
			.single();

		if (profileError) {
			console.error(
				"[checkGreyPointQuestUnlocks] Error fetching user profile:",
				profileError
			);
			return;
		}

		const greyPoints = profile?.grey_points || 0;
		console.log(`[checkGreyPointQuestUnlocks] User has ${greyPoints} grey points`);

		// Get user's existing quests
		const { data: existingQuests, error: existingError } = await supabase
			.from("user_sidequests")
			.select("sidequest_id")
			.eq("user_id", userId);

		if (existingError) {
			console.error(
				"[checkGreyPointQuestUnlocks] Error fetching existing quests:",
				existingError
			);
			return;
		}

		const existingQuestIds = new Set(existingQuests?.map((q) => q.sidequest_id) || []);

		// Find quests that should be unlocked based on grey points
		const { data: unlockableQuests, error: questsError } = await supabase
			.from("sidequests")
			.select("id, title, grey_unlock")
			.eq("status", "ACTIVE")
			.gt("grey_unlock", 0) // Only include quests with grey point requirements
			.lte("grey_unlock", greyPoints); // Only quests where user meets the requirement

		if (questsError) {
			console.error(
				"[checkGreyPointQuestUnlocks] Error fetching unlockable quests:",
				questsError
			);
			return;
		}

		if (!unlockableQuests || unlockableQuests.length === 0) {
			console.log("[checkGreyPointQuestUnlocks] No grey point quests available to unlock");
			return;
		}

		// Filter to find quests that need to be added
		const newUnlocks = unlockableQuests.filter((quest) => !existingQuestIds.has(quest.id));

		if (newUnlocks.length === 0) {
			console.log("[checkGreyPointQuestUnlocks] No new grey point quests to unlock");
			return;
		}

		console.log(
			`[checkGreyPointQuestUnlocks] Adding ${newUnlocks.length} new grey point quests for user`
		);
		newUnlocks.forEach((quest) => {
			console.log(
				`[checkGreyPointQuestUnlocks] Unlocking quest "${quest.title}" (required ${quest.grey_unlock} grey points)`
			);
		});

		// Create user_sidequests entries
		const userQuestsToCreate = newUnlocks.map((quest) => ({
			user_id: userId,
			sidequest_id: quest.id,
			state: "LIVE",
			created_at: new Date().toISOString(),
		}));

		const { error: insertError } = await supabase
			.from("user_sidequests")
			.insert(userQuestsToCreate);

		if (insertError) {
			console.error(
				"[checkGreyPointQuestUnlocks] Error creating user grey point quests:",
				insertError
			);
			return;
		}

		// Use the debouncer to prevent duplicate toast notifications
		const toastMessage =
			newUnlocks.length === 1
				? "New quest unlocked with your grey points!"
				: `${newUnlocks.length} new quests unlocked with your grey points!`;

		if (shouldShowToast(toastMessage)) {
			// Show notification in the top-right position
			toast.success(toastMessage, {
				position: "top-right",
			});
		}

		console.log(
			`[checkGreyPointQuestUnlocks] Successfully added ${newUnlocks.length} grey point quests for user ${userId}`
		);
	} catch (error) {
		console.error(
			"[checkGreyPointQuestUnlocks] Error checking grey point quest unlocks:",
			error
		);
	}
}
