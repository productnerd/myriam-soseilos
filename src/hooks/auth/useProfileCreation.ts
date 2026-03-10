
import { supabase } from "@/integrations/supabase/client";
import { addQuestsOnUserCreation } from "@/utils/quests/addQuestsOnUserCreation";

/**
 * Creates a profile record for a new user and adds initial quests
 * This is needed because the profiles table may not be populated by a trigger
 */
export const createUserProfile = async (userId: string, email: string) => {
	try {
		console.log("[ProfileCreation] Starting profile creation check for user:", userId);

		// First, check if a profile already exists
		const { data: existingProfile, error: checkError } = await supabase
			.from("profiles")
			.select("id")
			.eq("id", userId)
			.maybeSingle();

		if (checkError) {
			console.error("[ProfileCreation] Error checking for existing profile:", checkError);
			return false;
		}

		// If profile already exists, return success
		if (existingProfile) {
			console.log("[ProfileCreation] Profile already exists for user:", userId);
			return true;
		}

		console.log("[ProfileCreation] Creating new profile for user:", userId);

		// Profile doesn't exist, create one
		const { data, error } = await supabase
			.from("profiles")
			.insert({
				id: userId,
				email: email,
				name: email.split("@")[0],
			})
			.select()
			.single();

		if (error) {
			console.error("[ProfileCreation] Error creating user profile:", error);
			return false;
		}

		console.log("[ProfileCreation] Profile created successfully:", data);

		// Add initial quests for the new user (non-topic-linked quests)
		try {
			await addQuestsOnUserCreation(userId);
			console.log("[ProfileCreation] Initial quests added successfully");
		} catch (questError) {
			console.error("[ProfileCreation] Error adding initial quests:", questError);
			// Don't fail profile creation if quest addition fails
		}

		return true;
	} catch (error) {
		console.error("[ProfileCreation] Exception when creating user profile:", error);
		return false;
	}
};
