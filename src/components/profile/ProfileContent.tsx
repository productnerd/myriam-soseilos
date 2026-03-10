import React from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileSettings from "./ProfileSettings";
import ProfileFriends from "../profile/ProfileFriends";
import ProfileAdminSection from "./ProfileAdminSection";
import { UserProfile } from "@/types/user";

interface ProfileContentProps {
	user: UserProfile | null;
	avatarUrl: string;
	isUploading: boolean;
	onSignOut: () => void;
	onProfilePictureUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onNameUpdate?: (newName: string) => Promise<void> | void;
	onFlagUpdate?: (flag: string, country: string) => Promise<void> | void;
	onEmojiUpdate?: (emoji: string) => Promise<void> | void;
	onNotificationToggle?: (setting: string, value: boolean) => Promise<void> | void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
	user,
	avatarUrl,
	isUploading,
	onSignOut,
	onProfilePictureUpload,
	onNameUpdate,
	onFlagUpdate,
	onEmojiUpdate,
	onNotificationToggle,
}) => {
	if (!user) return null;

	return (
		<div className="container max-w-4xl mx-auto py-8 px-4">
			<ProfileHeader
				name={user.name || ""}
				email={user.email || ""}
				avatarUrl={avatarUrl}
				isUploading={isUploading}
				onSignOut={onSignOut}
				onProfilePictureUpload={onProfilePictureUpload}
				onNameUpdate={onNameUpdate}
				flag={user.flag}
				favoriteEmoji={user.favorite_emoji}
				tags={user.tags}
				onFlagUpdate={onFlagUpdate}
				onEmojiUpdate={onEmojiUpdate}
			/>

			<ProfileStats
				darkPoints={user.dark_points || 0}
				greyPoints={user.grey_points || 0}
				streakPoints={user.streak || 0}
			/>

			<ProfileFriends accessCodeId={user.access_code} userName={user.name} />

			<ProfileSettings profile={user} onNotificationToggle={onNotificationToggle} />

			{user.isAdmin && <ProfileAdminSection />}
		</div>
	);
};

export default ProfileContent;
