import PageTransition from "@/components/ui/PageTransition";
import { useProfileData } from "@/hooks/profile/useProfileData";
import { useUserContext } from "@/contexts/UserContext";
import { useSignOut } from "@/hooks/auth/useSignOut";
import { useProfilePicture } from "@/hooks/profile/useProfilePicture";
import { useProfileUpdates } from "@/hooks/profile/useProfileUpdates";
import { useNotificationSettings } from "@/hooks/profile/useNotificationSettings";
import { useSharingSettings } from "@/hooks/profile/useSharingSettings";
import ProfileContainer from "@/components/profile/ProfileContainer";
import ProfileLoading from "@/components/profile/ProfileLoading";
import ProfileError from "@/components/profile/ProfileError";

const ProfilePage = () => {
	const { user } = useUserContext();
	const isAdmin = user!.isAdmin;

	const { handleSignOut } = useSignOut();

	const { profile, isLoading, error } = useProfileData(user!.id);
	const { avatarUrl, isUploading, handleProfilePictureUpload } = useProfilePicture(user!.id);
	const { handleNameUpdate, handleFlagUpdate, handleEmojiUpdate } = useProfileUpdates(profile);
	const { handleNotificationToggle } = useNotificationSettings(profile);
	const { handleSharingToggle } = useSharingSettings(profile);

	if (isLoading) {
		return <ProfileLoading />;
	}

	if (error) {
		return <ProfileError errorMessage={error.message} />;
	}

	return (
		<PageTransition>
			<div className="w-full">
				<ProfileContainer
					profile={profile || null}
					avatarUrl={avatarUrl}
					isUploading={isUploading}
					isAdmin={isAdmin}
					onSignOut={handleSignOut}
					onProfilePictureUpload={handleProfilePictureUpload}
					onNameUpdate={handleNameUpdate}
					onFlagUpdate={handleFlagUpdate}
					onEmojiUpdate={handleEmojiUpdate}
					onNotificationToggle={handleNotificationToggle}
					onSharingToggle={handleSharingToggle}
				/>
			</div>
		</PageTransition>
	);
};

export default ProfilePage;
