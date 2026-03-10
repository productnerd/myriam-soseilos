import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Share2 } from "lucide-react";
import { generateInviteLink } from "@/utils/invite/inviteLinks";
import { toast } from "sonner";

interface ShareInviteButtonProps {
	accessCodeId?: string;
	userName?: string;
	className?: string;
}

const ShareInviteButton: React.FC<ShareInviteButtonProps> = ({
	accessCodeId,
	userName,
	className = "",
}) => {
	const handleShare = async () => {
		try {
			const inviteLink = generateInviteLink(accessCodeId || null);
			const shareText = userName
				? `Join me on this learning platform! 🎓 - ${userName}`
				: "Join me on this learning platform! 🎓";

			if (navigator.share) {
				await navigator.share({
					title: "Join me on this learning platform!",
					text: shareText,
					url: inviteLink,
				});
			} else {
				// Fallback to clipboard
				await navigator.clipboard.writeText(`${shareText}\n${inviteLink}`);
				toast.success("Invite link copied to clipboard!");
			}
		} catch (error) {
			console.error("Error sharing:", error);
			toast.error("Failed to share invite link");
		}
	};

	return (
		<Button
			onClick={handleShare}
			variant="outline"
			size="sm"
			className={`flex items-center gap-2 ${className}`}
		>
			<Share2 className="h-4 w-4" />
			Share with Friends
		</Button>
	);
};

export default ShareInviteButton;
