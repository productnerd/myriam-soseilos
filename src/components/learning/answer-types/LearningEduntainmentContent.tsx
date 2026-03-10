import React from "react";
import { Activity } from "@/types/activity";
import { Card, CardContent } from "@/components/ui/layout/Card";
import { getExplanationForAnswer } from "@/utils/activities/activityOperations";
interface LearningEduntainmentContentProps {
	activity: Activity;
	onAnswer: (answer: string) => void;
}

/**
 * Component for rendering eduntainment content
 */
const LearningEduntainmentContent: React.FC<LearningEduntainmentContentProps> = ({
	activity,
	onAnswer,
}) => {
	// Extract the explanation text using our utility function
	const explanationText = getExplanationForAnswer(activity.explanation, "default");

	// Auto-complete the activity when component mounts
	React.useEffect(() => {
		onAnswer("completed");
	}, [onAnswer]);

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
		<div className="space-y-4 w-full max-w-3xl mx-auto">
			{/* Embedded content */}
			{embedUrl && (
				<Card className="w-full">
					<CardContent className="p-0">
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
									className="w-full h-[500px] border-0 rounded-lg"
									title="Twitter/X Post"
								/>
							</div>
						)}

						{isInstagram && (
							<div className="w-full max-w-md mx-auto">
								<iframe
									src={getInstagramEmbedUrl(embedUrl)}
									className="w-full h-[700px] border-0 rounded-lg"
									title="Instagram Post"
									style={{
										minHeight: "700px",
									}}
								/>
							</div>
						)}

						{!isYouTube && !isTwitter && !isInstagram && (
							<div className="w-full">
								<iframe
									src={embedUrl}
									title="Educational Content"
									className="w-full h-[600px] border-0 rounded-lg"
								/>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Show explanation if available - very light beige border and text for better contrast */}
			{explanationText && (
				<div className="border border-stone-200 dark:border-stone-600 rounded-lg p-4">
					<div
						dangerouslySetInnerHTML={{
							__html: explanationText,
						}}
						className="prose dark:prose-invert prose-sm max-w-none text-stone-600 dark:text-stone-200 "
					/>
				</div>
			)}
		</div>
	);
};
export default LearningEduntainmentContent;
