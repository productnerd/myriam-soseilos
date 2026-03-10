import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useProfilePicture(profileId: string | undefined) {
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

	const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			setIsUploading(true);

			if (!e.target.files || e.target.files.length === 0) {
				throw new Error("You must select an image to upload.");
			}

			if (!profileId) {
				throw new Error("Profile ID is required to upload an image.");
			}

			const file = e.target.files[0];
			const fileExt = file.name.split(".").pop();
			const fileName = `${profileId}/profile-picture.${fileExt}`;
			const filePath = `${fileName}`;

			// Upload image to Supabase Storage
			const { error: uploadError } = await supabase.storage
				.from("profile_pictures")
				.upload(filePath, file, { upsert: true });

			if (uploadError) throw uploadError;

			// Get public URL of the uploaded image
			const { data: urlData } = supabase.storage
				.from("profile_pictures")
				.getPublicUrl(filePath);

			if (!urlData.publicUrl) {
				throw new Error("Failed to get public URL for uploaded image");
			}

			// Update profile with the new profile picture URL
			const { error: updateError } = await supabase
				.from("profiles")
				.update({ thumbnail: urlData.publicUrl })
				.eq("id", profileId);

			if (updateError) throw updateError;

			setAvatarUrl(urlData.publicUrl);

			toast.success("Profile picture updated successfully!");
		} catch (error: any) {
			console.error("Error uploading profile picture:", error);
			toast.error(error.message || "Failed to upload profile picture.");
		} finally {
			setIsUploading(false);
		}
	};

	return {
		isUploading,
		avatarUrl,
		setAvatarUrl,
		handleProfilePictureUpload,
	};
}
