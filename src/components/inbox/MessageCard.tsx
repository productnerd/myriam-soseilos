import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/layout/Card";
import { Badge } from "@/components/ui/data/Badge";
import { Button } from "@/components/ui/interactive/Button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatMessageDate } from "@/utils/formatting/messageUtils";
import { UserMessage } from "@/types/messages";
import { supabase } from "@/integrations/supabase/client";
interface MessageCardProps {
	message: UserMessage;
	isExpanded: boolean;
	onMessageClick: () => void;
	forceRead?: boolean;
}
const MessageCard: React.FC<MessageCardProps> = ({
	message,
	isExpanded,
	onMessageClick,
	forceRead = false,
}) => {
	const [isReadState, setIsReadState] = useState(message.is_read);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [isTextTruncated, setIsTextTruncated] = useState(false);
	const textRef = useRef<HTMLParagraphElement>(null);

	// Update read state when forceRead prop changes
	useEffect(() => {
		if (forceRead && !isReadState) {
			setIsReadState(true);
		}
	}, [forceRead, isReadState]);

	// Handle image URL from Supabase storage
	useEffect(() => {
		if (message.image_url) {
			// Check if it's already a full URL (external) or a storage path
			if (message.image_url.startsWith("http")) {
				setImageUrl(message.image_url);
			} else {
				// Get the public URL from Supabase storage
				const { data } = supabase.storage
					.from("message-images")
					.getPublicUrl(message.image_url);
				setImageUrl(data.publicUrl);
			}
		}
	}, [message.image_url]);

	// Check if text is actually truncated when collapsed
	useEffect(() => {
		if (!isExpanded && textRef.current) {
			const element = textRef.current;
			const isOverflowing = element.scrollHeight > element.clientHeight;
			setIsTextTruncated(isOverflowing);
		}
	}, [isExpanded, message.payload]);
	return (
		<Card
			className={`w-full transition-all duration-300 ${
				!isReadState ? "border-primary/40 bg-primary/5" : "bg-card/60"
			}`}
		>
			<CardHeader className="p-4 pb-0 flex flex-row justify-between items-start gap-y-2">
				<div className="space-y-0.5">
					<div className="flex items-center gap-2">
						<Badge
							variant={!isReadState ? "default" : "secondary"}
							className="text-xs py-0 h-5 uppercase"
						>
							{message.tag}
						</Badge>
						<span className="text-xs text-muted-foreground absolute top-4 right-4">
							{formatMessageDate(message.created_at)}
						</span>
					</div>
					<h3 className="text-lg font-semibold mt-1">{message.title}</h3>
				</div>

				{!isReadState && !forceRead && <div className="h-2 w-2 rounded-full bg-primary" />}
			</CardHeader>

			<div
				className={isTextTruncated ? "cursor-pointer" : ""}
				onClick={isTextTruncated ? onMessageClick : undefined}
			>
				<CardContent className="p-4 pt-0">
					{isExpanded ? (
						<div className="space-y-4">
							<p className="text-sm text-muted-foreground whitespace-pre-line">
								{message.payload}
							</p>
							{imageUrl && (
								<div className="w-full">
									<img
										src={imageUrl}
										alt="Message attachment"
										className="w-full rounded-lg object-cover max-h-64"
										onError={(e) => {
											console.error("Failed to load image:", imageUrl);
											e.currentTarget.style.display = "none";
										}}
									/>
								</div>
							)}
							<Button
								variant="ghost"
								size="sm"
								className="text-muted-foreground hover:text-foreground"
								onClick={(e) => {
									e.stopPropagation();
									onMessageClick();
								}}
							>
								<ChevronUp className="h-4 w-4 mr-1" />
								See less
							</Button>
						</div>
					) : (
						<div className="space-y-2">
							<p ref={textRef} className="text-sm text-muted-foreground line-clamp-2">
								{message.payload}
							</p>
							{imageUrl && (
								<div className="w-full">
									<img
										src={imageUrl}
										alt="Message attachment"
										className="w-full rounded-lg object-cover max-h-64"
										onError={(e) => {
											console.error("Failed to load image:", imageUrl);
											e.currentTarget.style.display = "none";
										}}
									/>
								</div>
							)}
							{isTextTruncated && (
								<Button
									variant="ghost"
									size="sm"
									className="text-muted-foreground hover:text-foreground"
									onClick={(e) => {
										e.stopPropagation();
										onMessageClick();
									}}
								>
									<ChevronDown className="h-4 w-4 mr-1" />
									See more
								</Button>
							)}
						</div>
					)}
				</CardContent>
			</div>
		</Card>
	);
};
export default MessageCard;
