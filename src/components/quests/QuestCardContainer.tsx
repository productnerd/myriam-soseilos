import React from "react";
import { Card } from "@/components/ui/layout/Card";
import { UserSidequest } from "@/types/user";
import { useProfileData } from "@/hooks/profile/useProfileData";
import { supabase } from "@/integrations/supabase/client";

interface QuestCardContainerProps {
	children: React.ReactNode;
	isExpanded: boolean;
	isDisabled: boolean;
	isSubmittingLocally: boolean;
	isCompleted: boolean;
	onToggleExpand: () => void;
	quest?: UserSidequest;
}

const QuestCardContainer: React.FC<QuestCardContainerProps> = ({
	children,
	isExpanded,
	isDisabled,
	isSubmittingLocally,
	isCompleted,
	onToggleExpand,
	quest,
}) => {
	const { profile } = useProfileData(user?.id || null);

	const isLocked = quest?.state === "LOCKED";
	const greyUnlock = quest?.sidequest?.grey_unlock || quest?.self_exploration_quest?.grey_unlock;

	// Check if quest should be locked due to grey points requirement
	const userGreyPoints = profile?.grey_points || 0;
	const shouldShowLocked = isLocked || (greyUnlock && userGreyPoints < greyUnlock);

	// Determine quest type based on the presence of self_exploration_quest_id vs sidequest_id
	const questType = quest?.self_exploration_quest_id ? "self-exploration-quiz" : "real-life-task";

	// Use 36px corner radius for all cards
	const cardStyle = {
		borderRadius: "36px",
	};

	// Get proper storage URLs for images
	const getStorageUrl = (fileName: string, bucketName: string) => {
		if (!fileName) return null;

		// If it's already a full URL, return as is
		if (fileName.startsWith("http")) return fileName;

		// Get public URL from Supabase storage
		const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
		return data.publicUrl;
	};

	// Get background image based on quest type
	let backgroundImage = null;
	if (questType === "self-exploration-quiz") {
		// For self-exploration, use the self_exploration_quest image as full background
		const rawImage = quest?.self_exploration_quest?.image;
		if (rawImage) {
			backgroundImage = getStorageUrl(rawImage, "background-images");
		}
	}

	// Show darkest background color for quests without valid image
	const showDarkBackground = !backgroundImage && questType === "self-exploration-quiz";

	// Handle click - prevent interaction if locked
	const handleClick = () => {
		if (shouldShowLocked) return;
		onToggleExpand();
	};

	// When expanded, show the simple modal overlay
	if (isExpanded) {
		return (
			<div
				className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
				onClick={onToggleExpand}
			>
				<div
					className="rounded-3xl max-w-md w-full h-[80vh] shadow-2xl relative flex flex-col"
					onClick={(e) => e.stopPropagation()}
					style={{
						...cardStyle,
						backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
						backgroundColor: showDarkBackground
							? "#331f19"
							: questType === "real-life-task"
							? "hsl(var(--background))"
							: undefined,
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
						overflow: "hidden",
					}}
				>
					{/* Dark overlay for self-exploration quests when expanded - made darker */}
					{questType === "self-exploration-quiz" && backgroundImage && (
						<div className="absolute inset-0 bg-black/60 rounded-3xl" />
					)}
					<div className="relative z-10">{children}</div>
				</div>
			</div>
		);
	}

	// Regular card when not expanded
	return (
		<Card
			className={`w-full shadow-md transition-all duration-300 ${
				isDisabled ? "opacity-70" : ""
			} ${isSubmittingLocally ? "animate-fade-out" : ""} ${
				shouldShowLocked ? "cursor-not-allowed" : "cursor-pointer"
			} relative flex flex-col overflow-hidden border-border/50 hover:shadow-lg hover:scale-[1.02] hover:bg-card/95`}
			style={{
				borderColor: isCompleted ? "rgb(22, 163, 74)" : undefined,
				borderWidth: isCompleted ? "2px" : undefined,
				...cardStyle,
				backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
				backgroundColor: showDarkBackground ? "#331f19" : undefined,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				minHeight: "300px",
				maxWidth: questType === "self-exploration-quiz" ? "280px" : undefined,
			}}
			onClick={handleClick}
		>
			{/* Dark overlay for self-exploration quests when collapsed - made darker */}
			{questType === "self-exploration-quiz" && backgroundImage && (
				<div className="absolute inset-0 bg-black/60 rounded-[36px]" />
			)}
			<div className="relative z-10 flex flex-col h-full">{children}</div>
		</Card>
	);
};

export default QuestCardContainer;
