import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/Card";
import { Button } from "@/components/ui/interactive/Button";
import { Input } from "@/components/ui/form/Input";
import { Copy, Users } from "lucide-react";
import { toast } from "sonner";
import FriendsList from "../friends/FriendsList";

interface ProfileFriendsProps {
	accessCodeId?: string;
	userName?: string;
}

const ProfileFriends: React.FC<ProfileFriendsProps> = ({ accessCodeId, userName }) => {
	const inviteLink = `${window.location.origin}/invite/${accessCodeId}`;

	const copyInviteLink = () => {
		navigator.clipboard.writeText(inviteLink);
		toast.success("Invite link copied to clipboard!");
	};

	return (
		<Card className="mt-6">
			<CardHeader className="pb-1">
				<h3>Invite Friends</h3>
			</CardHeader>
			<CardContent className="space-y-4 px-4 sm:px-6">
				<div className="text-left">
					<div className="flex flex-col sm:flex-row gap-2">
						<Input value={inviteLink} readOnly className="flex-1 text-xs sm:text-sm" />
						<Button
							onClick={copyInviteLink}
							variant="outline"
							className="w-full sm:w-auto sm:min-w-[120px] md:min-w-[140px]"
						>
							<Copy className="h-4 w-4 mr-2" />
							Copy Link
						</Button>
					</div>
				</div>

				<div className="mt-6">
					<h4>Your Friends</h4>
					<div className="w-full overflow-hidden">
						<FriendsList />
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default ProfileFriends;
