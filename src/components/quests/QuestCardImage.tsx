import React from "react";
import { AspectRatio } from "@/components/ui/layout/AspectRatio";
import { Badge } from "@/components/ui/data/Badge";
import { Eye, EyeOff, Lock, LockOpen } from "lucide-react";
import { Button } from "@/components/ui/interactive/Button";
import { UserSidequest } from "@/types/user";
import { useProfileData } from "@/hooks/profile/useProfileData";
import { supabase } from "@/integrations/supabase/client";
import { Feather } from "@/lib/customIcons";
import { useQuery } from "@tanstack/react-query";

interface QuestCardImageProps {
	image?: string;
	icon?: string;
	questTitle: string;
	quest?: UserSidequest;
	currentTab?: "active" | "hidden" | "inReview" | "completed" | "expired";
	onToggleHidden?: (quest: UserSidequest) => void;
}

const QuestCardImage: React.FC<QuestCardImageProps> = ({
	image,
	icon,
	questTitle,
	quest,
	currentTab = "active",
	onToggleHidden,
}) => {
	const { profile } = useProfileData(user?.id || null);

	// Check if topic is completed for the current user
	const { data: isTopicCompleted } = useQuery({
		queryKey: ["topicCompleted", quest?.sidequest?.topic_id, profile?.id],
		queryFn: async () => {
			if (!quest?.sidequest?.topic_id || !profile?.id) return false;

			const { data } = await supabase
				.from("user_completed_topics")
				.select("id")
				.eq("user_id", profile.id)
				.eq("topic_id", quest.sidequest.topic_id)
				.single();

			return !!data;
		},
		enabled: !!quest?.sidequest?.topic_id && !!profile?.id && currentTab === "locked",
	});

	// Only render for real-life tasks (quests with sidequest_id)
	if (!quest?.sidequest_id) {
		return null;
	}

	const topicColor = quest?.sidequest?.topic?.level?.course?.color || "#4B5563";
	const isLocked = quest?.state === "LOCKED";
	const isHidden = quest?.is_hidden || false;
	const isCompleted = quest?.state === "COMPLETED";
	const greyUnlock = quest?.sidequest?.grey_unlock;

	// Check if quest should be locked due to grey points requirement
	const userGreyPoints = profile?.grey_points || 0;
	const shouldShowLocked = isLocked || (greyUnlock && userGreyPoints < greyUnlock);
	const greyPointsNeeded =
		greyUnlock && userGreyPoints < greyUnlock ? greyUnlock - userGreyPoints : 0;

	// Get proper storage URLs for images and icons
	const getStorageUrl = (fileName: string, bucketName: string) => {
		if (!fileName) return null;

		// If it's already a full URL, return as is
		if (fileName.startsWith("http")) return fileName;

		// Get public URL from Supabase storage
		const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
		return data.publicUrl;
	};

	const handleToggleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onToggleHidden && quest) {
			onToggleHidden(quest);
		}
	};

	// Only show image section for real-life tasks
	const sidequestImage = quest?.sidequest?.image
		? getStorageUrl(quest.sidequest.image, "background-images")
		: null;
	const sidequestIcon = quest?.sidequest?.icon
		? getStorageUrl(quest.sidequest.icon, "icon-images")
		: null;

	return (
		<div
			className={`relative w-full overflow-hidden rounded-t-lg pb-2 ${
				shouldShowLocked ? "opacity-50" : ""
			}`}
			style={{
				maxHeight: "150px",
			}}
		>
			<AspectRatio ratio={2 / 1}>
				{sidequestImage ? (
					<img
						src={sidequestImage}
						alt={questTitle}
						className="w-full h-full object-cover"
						style={{ maxHeight: "150px" }}
						onError={(e) => {
							console.error("Failed to load image:", sidequestImage);
							// Show a fallback background color instead of hiding
							e.currentTarget.style.display = "none";
							const parent = e.currentTarget.parentElement;
							if (parent) {
								parent.style.backgroundColor = "#4B5563";
							}
						}}
					/>
				) : (
					// Fallback background when no image is available
					<div className="w-full h-full bg-gray-600" style={{ maxHeight: "150px" }} />
				)}
			</AspectRatio>

			{/* Top overlay container for topic pill and hide/show button */}
			<div className="absolute top-3 left-3 right-3 z-10 flex justify-between items-start">
				{/* Topic pill - left side */}
				<div>
					{quest?.sidequest?.topic && (
						<Badge
							variant="outline"
							className="text-xs w-fit text-white border-white/50 flex items-center gap-1"
							style={{
								backgroundColor: `${topicColor}DD`,
								color: "white",
							}}
						>
							{currentTab === "locked" &&
								quest?.sidequest?.topic_id &&
								(isTopicCompleted ? (
									<LockOpen size={10} className="flex-shrink-0" />
								) : (
									<Lock size={10} className="flex-shrink-0" />
								))}
							{quest.sidequest.topic.title}
						</Badge>
					)}
				</div>

				{/* Hide/Show button - right side with smaller size */}
				<div>
					{/* Show grey points needed countdown if applicable */}
					{greyPointsNeeded > 0 && (
						<Badge
							variant="secondary"
							className="text-xs px-2 py-1 flex items-center gap-1"
							style={{
								backgroundColor: "rgba(55, 65, 81, 0.8)",
								color: "rgb(209, 213, 219)",
								borderColor: "rgb(75, 85, 99)",
								backdropFilter: "blur(4px)",
								border: "1px solid rgb(75, 85, 99)",
							}}
						>
							<Feather size={12} className="flex-shrink-0" />
							{greyPointsNeeded} to unlock
						</Badge>
					)}
					{currentTab === "active" &&
						onToggleHidden &&
						quest &&
						!isCompleted &&
						!shouldShowLocked && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleToggleClick}
								className="h-6 w-6 p-0 bg-black/40 hover:bg-black/60 rounded-full opacity-50"
							>
								{isHidden ? (
									<Eye className="h-2.5 w-2.5 text-white" />
								) : (
									<EyeOff className="h-2.5 w-2.5 text-white" />
								)}
							</Button>
						)}
					{currentTab === "hidden" &&
						onToggleHidden &&
						quest &&
						!isCompleted &&
						!shouldShowLocked && (
							<Button
								variant="ghost"
								size="sm"
								className="h-5 w-5 p-0 bg-black/20 hover:bg-black/30 opacity-50"
								style={{
									borderWidth: "0.5px",
									borderColor: "rgba(139, 121, 94, 0.5)",
									border: "0.5px solid rgba(139, 121, 94, 0.5)",
								}}
								onClick={handleToggleClick}
							>
								<Eye
									className="h-2.5 w-2.5"
									style={{ color: "rgba(245, 245, 220, 0.5)" }}
								/>
							</Button>
						)}
				</div>
			</div>

			{/* Quest icon overlay - bottom left, aligned with card content - only if valid icon exists */}
			{sidequestIcon && (
				<div className="absolute bottom-3 left-4 z-10">
					<div className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden bg-transparent">
						<img
							src={sidequestIcon}
							alt="Quest icon"
							onError={(e) => {
								console.error("Failed to load icon:", sidequestIcon);
								// Hide the icon container if icon fails to load
								const container = e.currentTarget.parentElement?.parentElement;
								if (container) {
									container.style.display = "none";
								}
							}}
							className="w-full h-full object-cover rounded-full"
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default QuestCardImage;
