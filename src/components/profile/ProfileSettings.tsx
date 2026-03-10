import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/Card";
import { Switch } from "@/components/ui/form/Switch";
import { Label } from "@/components/ui/form/Label";
import { UserProfile } from "@/types/user";
import { toast } from "sonner";

interface ProfileSettingsProps {
	profile: UserProfile;
	onNotificationToggle?: (
		type: "email_alerts" | "push_notifications",
		value: boolean
	) => Promise<void> | void;
	onSharingToggle?: (
		type: "poll_sharing" | "score_sharing",
		value: boolean
	) => Promise<void> | void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
	profile,
	onNotificationToggle,
	onSharingToggle,
}) => {
	const [localProfile, setLocalProfile] = React.useState(profile);

	// Update local state when profile prop changes
	React.useEffect(() => {
		setLocalProfile(profile);
	}, [profile]);

	const handleEmailAlertsChange = async (checked: boolean) => {
		// Update local state immediately for responsive UI
		setLocalProfile((prev) => ({ ...prev, email_alerts: checked }));

		if (onNotificationToggle) {
			try {
				await onNotificationToggle("email_alerts", checked);
				toast.success(`Email notifications ${checked ? "enabled" : "disabled"}`);
			} catch (error) {
				// Revert on error
				setLocalProfile((prev) => ({ ...prev, email_alerts: !checked }));
			}
		}
	};

	const handlePushNotificationsChange = async (checked: boolean) => {
		// Update local state immediately for responsive UI
		setLocalProfile((prev) => ({ ...prev, push_notifications: checked }));

		if (onNotificationToggle) {
			try {
				await onNotificationToggle("push_notifications", checked);
				toast.success(`In-app notifications ${checked ? "enabled" : "disabled"}`);
			} catch (error) {
				// Revert on error
				setLocalProfile((prev) => ({ ...prev, push_notifications: !checked }));
			}
		}
	};

	const handlePollSharingChange = async (checked: boolean) => {
		// Update local state immediately for responsive UI
		setLocalProfile((prev) => ({ ...prev, poll_sharing: checked }));

		if (onSharingToggle) {
			try {
				await onSharingToggle("poll_sharing", checked);
			} catch (error) {
				// Revert on error
				setLocalProfile((prev) => ({ ...prev, poll_sharing: !checked }));
			}
		}
	};

	const handleScoreSharingChange = async (checked: boolean) => {
		// Update local state immediately for responsive UI
		setLocalProfile((prev) => ({ ...prev, score_sharing: checked }));

		if (onSharingToggle) {
			try {
				await onSharingToggle("score_sharing", checked);
			} catch (error) {
				// Revert on error
				setLocalProfile((prev) => ({ ...prev, score_sharing: !checked }));
			}
		}
	};

	return (
		<div className="space-y-6 mt-6">
			{/* Notifications Section */}
			<Card>
				<CardHeader className="pb-1">
					<h3>Notifications</h3>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="text-left">
							<Label htmlFor="email-notifications" className="text-sm font-medium">
								Email notifications
							</Label>
							<p className="text-sm text-muted-foreground">
								Receive updates via email
							</p>
						</div>
						<Switch
							id="email-notifications"
							checked={localProfile?.email_alerts || false}
							onCheckedChange={handleEmailAlertsChange}
						/>
					</div>

					<div className="flex items-center justify-between">
						<div className="text-left">
							<Label htmlFor="push-notifications" className="text-sm font-medium">
								In-app notifications
							</Label>
							<p className="text-sm text-muted-foreground">
								Receive push notifications in the app
							</p>
						</div>
						<Switch
							id="push-notifications"
							checked={localProfile?.push_notifications || false}
							onCheckedChange={handlePushNotificationsChange}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Friend Sharing Section */}
			<Card>
				<CardHeader className="pb-1">
					<h3>Friend Sharing</h3>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="text-left">
							<Label htmlFor="poll-sharing" className="text-sm font-medium">
								Share poll answers
							</Label>
							<p className="text-sm text-muted-foreground">
								Let friends see your answers in polls
							</p>
						</div>
						<Switch
							id="poll-sharing"
							checked={localProfile?.poll_sharing !== false}
							onCheckedChange={handlePollSharingChange}
						/>
					</div>

					<div className="flex items-center justify-between">
						<div className="text-left">
							<Label htmlFor="score-sharing" className="text-sm font-medium">
								Share test scores
							</Label>
							<p className="text-sm text-muted-foreground">
								Let friends see how you performed in tests
							</p>
						</div>
						<Switch
							id="score-sharing"
							checked={localProfile?.score_sharing !== false}
							onCheckedChange={handleScoreSharingChange}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ProfileSettings;
