import React from "react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/types/user";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileSettings from "./ProfileSettings";
import ProfileFriends from "./ProfileFriends";
import ProfileAdminSection from "./ProfileAdminSection";
import { Pen, LogOut, Shield, Mail } from "lucide-react";
import { Button } from "@/components/ui/interactive/Button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/overlay/Tooltip";

interface ProfileContainerProps {
	profile: UserProfile | null;
	avatarUrl: string | null;
	isUploading: boolean;
	isAdmin?: boolean;
	onSignOut: () => void;
	onProfilePictureUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onNameUpdate?: (newName: string) => Promise<void> | void;
	onFlagUpdate?: (flag: string, country: string) => Promise<void> | void;
	onEmojiUpdate?: (emoji: string) => Promise<void> | void;
	onNotificationToggle?: (
		type: "email_alerts" | "push_notifications",
		value: boolean
	) => Promise<void> | void;
	onSharingToggle?: (
		type: "poll_sharing" | "score_sharing",
		value: boolean
	) => Promise<void> | void;
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({
	profile,
	avatarUrl,
	isUploading,
	isAdmin = false,
	onSignOut,
	onProfilePictureUpload,
	onNameUpdate,
	onFlagUpdate,
	onEmojiUpdate,
	onNotificationToggle,
	onSharingToggle,
}) => {
	const navigate = useNavigate();

	if (!profile) return null;

	const greyPoints = profile.grey_points || 0;
	const hasEnoughPoints = greyPoints >= 400;
	const isContributor = profile.tags ? profile.tags.includes("CONTRIBUTOR") : false;

	return (
		<div className="container max-w-screen-md mx-auto px-4 py-6">
			<ProfileHeader
				name={profile.name || ""}
				email={profile.email || ""}
				avatarUrl={avatarUrl || ""}
				isUploading={isUploading}
				onSignOut={onSignOut}
				onProfilePictureUpload={onProfilePictureUpload}
				onNameUpdate={onNameUpdate}
				flag={profile.flag}
				favoriteEmoji={profile.favorite_emoji}
				tags={profile.tags?.length ? profile.tags : null}
				onFlagUpdate={onFlagUpdate}
				onEmojiUpdate={onEmojiUpdate}
			/>

			<ProfileStats
				darkPoints={profile.dark_points || 0}
				greyPoints={greyPoints}
				streakPoints={profile.streak || 0}
			/>

			<ProfileFriends accessCodeId={profile.access_code} userName={profile.name} />

			<ProfileSettings
				profile={profile}
				onNotificationToggle={onNotificationToggle}
				onSharingToggle={onSharingToggle}
			/>

			{isAdmin && <ProfileAdminSection />}

			<div className="mt-6 space-y-4 pt-4 border-t border-border">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="text-left">
								<Button
									variant="secondary"
									size="sm"
									onClick={() => navigate("/contributors")}
									className="justify-start"
									disabled={!hasEnoughPoints && !isContributor}
								>
									{isContributor ? (
										<>
											<Pen className="h-4 w-4 mr-2" />
											Contributor Lounge
										</>
									) : (
										<>
											<Shield className="h-4 w-4 mr-2" />
											Become a Contributor
										</>
									)}
								</Button>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							{!isContributor && !hasEnoughPoints
								? "You need 400 grey points to become a contributor"
								: "Access the contributor area"}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<div className="text-left">
					<Button
						variant="secondary"
						size="sm"
						onClick={onSignOut}
						className="justify-start"
					>
						<LogOut className="h-4 w-4 mr-2" />
						Sign Out
					</Button>
				</div>
			</div>

			<div className="mt-4 pt-2 border-t border-border text-left">
				<a
					href="mailto:support@example.com"
					className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
					aria-label="Contact Support"
				>
					<Mail className="h-4 w-4" />
				</a>
			</div>
		</div>
	);
};

export default ProfileContainer;
