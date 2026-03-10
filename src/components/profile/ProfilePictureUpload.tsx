import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/interactive/Button";
import { getAvatarFallback } from "@/utils/ui/avatarUtils";

interface ProfilePictureUploadProps {
	avatarUrl: string | null;
	onProfilePictureUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isUploading: boolean;
	name?: string | null;
	email?: string | null;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
	avatarUrl,
	onProfilePictureUpload,
	isUploading,
	name,
	email,
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleUploadClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<div className="relative">
			<Avatar className="h-28 w-28 border-2 border-app-blue overflow-hidden">
				<AvatarImage
					src={avatarUrl || ""}
					alt="User profile"
					className="object-cover w-full h-full"
					loading="lazy"
				/>
				<AvatarFallback className="text-2xl bg-app-blue text-white">
					{getAvatarFallback(name, email)}
				</AvatarFallback>
			</Avatar>

			<Button
				size="icon"
				variant="secondary"
				className="absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-md border border-border"
				onClick={handleUploadClick}
				disabled={isUploading}
			>
				{isUploading ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<Camera className="h-4 w-4" />
				)}
			</Button>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={onProfilePictureUpload}
				disabled={isUploading}
			/>
		</div>
	);
};

export default ProfilePictureUpload;
