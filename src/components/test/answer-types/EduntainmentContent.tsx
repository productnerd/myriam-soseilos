import React from "react";
import { Activity } from "@/types/activity";
import { Card, CardContent } from "@/components/ui/layout/Card";
import { getExplanationForAnswer } from "@/utils/activities/activityOperations";

interface EduntainmentContentProps {
	activity: Activity;
	onSubmit?: (isCorrect: boolean) => void;
	showFeedback?: boolean;
	onAnswer?: (answer: string) => void;
}

/**
 * Displays eduntainment content with embedded iframe
 */
const EduntainmentContent: React.FC<EduntainmentContentProps> = ({
	activity,
	onSubmit,
	showFeedback = false,
	onAnswer,
}) => {
	// Extract explanation text using our utility
	const explanationText = getExplanationForAnswer(activity.explanation, "default");

	const handleComplete = () => {
		if (onSubmit) {
			onSubmit(true); // true = correct for eduntainment
		} else if (onAnswer) {
			onAnswer("completed");
		}
	};

	// Get embed URL and determine platform
	const embedUrl = activity.embed_url;
	const isYouTube = embedUrl?.includes("youtube.com") || embedUrl?.includes("youtu.be");
	const isTwitter = embedUrl?.includes("twitter.com") || embedUrl?.includes("x.com");
	const isInstagram = embedUrl?.includes("instagram.com");

	// Convert X/Twitter URL to embed format
	const getTwitterEmbedUrl = (url: string) => {
		const tweetId = url.split("/status/")[1]?.split("?")[0];
		if (tweetId) {
			return `https://platform.twitter.com/embed/Tweet.html?id=${tweetId}`;
		}
		return url;
	};

	// Convert Instagram URL to embed format
	const getInstagramEmbedUrl = (url: string) => {
		if (url.includes("/reel/")) {
			const reelId = url.split("/reel/")[1]?.split("/")[0];
			return `https://www.instagram.com/reel/${reelId}/embed/`;
		}
		if (url.includes("/p/")) {
			const postId = url.split("/p/")[1]?.split("/")[0];
			return `https://www.instagram.com/p/${postId}/embed/`;
		}
		return url;
	};

	return (
		<div className="space-y-6">
			{/* Embedded content */}
			{embedUrl && (
				<Card className="w-full">
					<CardContent className="p-6">
						{isYouTube && (
							<div className="aspect-video w-full">
								<iframe
									src={embedUrl}
									title="Educational Content"
									className="w-full h-full rounded-lg"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								/>
							</div>
						)}

						{isTwitter && (
							<div className="w-full max-w-lg mx-auto">
								<iframe
									src={getTwitterEmbedUrl(embedUrl)}
									className="w-full h-[600px] rounded-lg border"
									title="Twitter/X Post"
								/>
							</div>
						)}

						{isInstagram && (
							<div className="w-full max-w-md mx-auto">
								<iframe
									src={getInstagramEmbedUrl(embedUrl)}
									className="w-full h-[700px] rounded-lg border"
									title="Instagram Post"
									style={{ minHeight: "700px" }}
								/>
							</div>
						)}

						{!isYouTube && !isTwitter && !isInstagram && (
							<div className="w-full">
								<iframe
									src={embedUrl}
									title="Educational Content"
									className="w-full h-[600px] rounded-lg border"
								/>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Show explanation in small text below the embed */}
			{explanationText && (
				<div className="text-sm text-muted-foreground">
					<div
						className="prose dark:prose-invert prose-sm max-w-none"
						dangerouslySetInnerHTML={{ __html: explanationText }}
					/>
				</div>
			)}
		</div>
	);
};

export default EduntainmentContent;
