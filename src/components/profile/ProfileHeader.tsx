import React, { useState } from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Pen, LogOut } from "lucide-react";
import ProfilePictureUpload from "./ProfilePictureUpload";
import NameEditor from "./NameEditor";
import FlagDialog from "./FlagDialog";
import EmojiDialog from "../emoji/EmojiDialog";
import ProfileBadges from "./ProfileBadges";

interface ProfileHeaderProps {
	name: string;
	email: string;
	avatarUrl: string;
	isUploading: boolean;
	onSignOut: () => void;
	onProfilePictureUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onNameUpdate?: (newName: string) => Promise<void> | void;
	flag?: string;
	favoriteEmoji?: string;
	tags?: string[] | null;
	onFlagUpdate?: (flag: string, country: string) => Promise<void> | void;
	onEmojiUpdate?: (emoji: string) => Promise<void> | void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
	name,
	email,
	avatarUrl,
	isUploading,
	onSignOut,
	onProfilePictureUpload,
	onNameUpdate,
	flag,
	favoriteEmoji,
	tags,
	onFlagUpdate,
	onEmojiUpdate,
}) => {
	const [isFlagDialogOpen, setIsFlagDialogOpen] = useState(false);
	const [isEmojiDialogOpen, setIsEmojiDialogOpen] = useState(false);
	const [tempEmoji, setTempEmoji] = useState("");

	const handleFlagClick = () => {
		setIsFlagDialogOpen(true);
	};

	const handleEmojiClick = () => {
		setTempEmoji(favoriteEmoji || "");
		setIsEmojiDialogOpen(true);
	};

	const handleFlagSelect = (flagEmoji: string, countryName: string) => {
		if (onFlagUpdate) {
			onFlagUpdate(flagEmoji, countryName);
		}
		setIsFlagDialogOpen(false);
	};

	const handleEmojiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTempEmoji(e.target.value);
	};

	const handleEmojiSave = () => {
		if (onEmojiUpdate && tempEmoji) {
			onEmojiUpdate(tempEmoji);
		}
		setIsEmojiDialogOpen(false);
	};

	return (
		<div className="text-left">
			<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
				<ProfilePictureUpload
					avatarUrl={avatarUrl}
					isUploading={isUploading}
					onProfilePictureUpload={onProfilePictureUpload}
					name={name}
					email={email}
				/>

				<div className="flex-1 text-left">
					<div className="flex items-center gap-2 mb-2">
						<NameEditor name={name} onNameUpdate={onNameUpdate} />
						<Button
							variant="outline"
							size="sm"
							onClick={handleFlagClick}
							className="h-8 w-8 p-0"
						>
							{flag || "🏳️"}
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={handleEmojiClick}
							className="h-8 w-8 p-0"
						>
							{favoriteEmoji || "😊"}
						</Button>
					</div>

					<ProfileBadges
						tags={tags}
						onFlagClick={handleFlagClick}
						onEmojiClick={handleEmojiClick}
					/>

					<p className="text-muted-foreground mb-2 text-left">{email}</p>
				</div>
			</div>

			<FlagDialog
				isOpen={isFlagDialogOpen}
				onOpenChange={setIsFlagDialogOpen}
				onFlagSelect={handleFlagSelect}
			/>

			<EmojiDialog
				isOpen={isEmojiDialogOpen}
				onOpenChange={setIsEmojiDialogOpen}
				tempEmoji={tempEmoji}
				onEmojiChange={handleEmojiChange}
				onEmojiSave={handleEmojiSave}
			/>
		</div>
	);
};

export default ProfileHeader;
