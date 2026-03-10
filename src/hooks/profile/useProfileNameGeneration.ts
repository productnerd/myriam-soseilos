import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateRandomName } from "@/utils/profile/nameGenerator";
import { generateAvatarFromName } from "@/utils/ui/avatarUtils";

export function useProfileNameGeneration() {
	const [isGenerating, setIsGenerating] = useState(false);

	const generateProfileName = async (userId: string) => {
		try {
			setIsGenerating(true);

			// Generate a random name
			const generatedName = generateRandomName();

			// Generate an avatar from the name
			const avatarUrl = generateAvatarFromName(generatedName);

			// Update the profile
			const { error } = await supabase
				.from("profiles")
				.update({
					name: generatedName,
					thumbnail: avatarUrl,
				})
				.eq("id", userId);

			if (error) throw error;

			return generatedName;
		} catch (error) {
			console.error("Error generating profile name:", error);
			return null;
		} finally {
			setIsGenerating(false);
		}
	};

	return {
		generateProfileName,
		isGenerating,
	};
}
