import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Input } from "@/components/ui/form/Input";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { generateInviteLink } from "@/utils/invite/inviteLinks";

interface InviteLinkProps {
	accessCodeId: string | null;
	isLoading?: boolean;
}

const InviteLink: React.FC<InviteLinkProps> = ({ accessCodeId, isLoading }) => {
	const [copied, setCopied] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	// Use the shared utility function for invite link generation
	const inviteLink = generateInviteLink(accessCodeId);

	const copyToClipboard = () => {
		if (!accessCodeId) {
			toast.error("No invite code available");
			return;
		}

		if (inputRef.current) {
			// Select the text
			inputRef.current.select();

			// Copy to clipboard
			navigator.clipboard
				.writeText(inviteLink)
				.then(() => {
					// Show success feedback
					setCopied(true);
					toast.success("Link copied to clipboard");

					// Reset copied state after 2 seconds
					setTimeout(() => setCopied(false), 2000);
				})
				.catch((err) => {
					console.error("Failed to copy text: ", err);
					toast.error("Failed to copy link");
				});
		}
	};

	return (
		<div className="flex items-center w-full gap-2 mb-4">
			<div className="flex-1 relative">
				<Input
					ref={inputRef}
					value={inviteLink}
					readOnly
					className="pr-10"
					onClick={copyToClipboard}
					placeholder={isLoading ? "Loading invite link..." : "No invite link available"}
					disabled={isLoading || !accessCodeId}
				/>
			</div>
			<Button
				onClick={copyToClipboard}
				size="icon"
				variant={copied ? "default" : "outline"}
				className="flex items-center justify-center h-10 w-10 min-w-10"
				disabled={isLoading || !accessCodeId}
			>
				<Copy size={16} />
			</Button>
		</div>
	);
};

export default InviteLink;
