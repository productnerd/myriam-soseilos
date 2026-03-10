import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateAvatarFromName } from "@/utils/ui/avatarUtils";

/**
 * Hook to update avatars for users without thumbnails
 * This should be called in a higher-level component or context
 */
export function useAutomaticAvatars() {
	useEffect(() => {
		const updateMissingAvatars = async () => {
			try {
				// First, find all profiles without thumbnails or with placeholder thumbnails
				const { data: profiles, error } = await supabase
					.from("profiles")
					.select("id, name, thumbnail")
					.or("thumbnail.is.null,thumbnail.eq./placeholder.svg");

				if (error) {
					throw error;
				}

				if (!profiles || profiles.length === 0) {
					return; // No profiles need updating
				}

				console.log(`Found ${profiles.length} profiles without custom avatars`);

				// Update each profile with a generated avatar
				for (const profile of profiles) {
					if (profile.name) {
						const avatarUrl = generateAvatarFromName(profile.name);

						const { error: updateError } = await supabase
							.from("profiles")
							.update({ thumbnail: avatarUrl })
							.eq("id", profile.id);

						if (updateError) {
							console.error(`Error updating avatar for ${profile.id}:`, updateError);
						}
					}
				}

				console.log("Avatar update process complete");
			} catch (err) {
				console.error("Error in updateMissingAvatars:", err);
			}
		};

		updateMissingAvatars();
	}, []);
}
