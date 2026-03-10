import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/layout/Card";
import { UserSelfExplorationQuest } from "@/types/self-exploration";
import { useSelfExplorationQuestActions } from "@/hooks/quests/useSelfExplorationQuestActions";
import { useSelfExplorationResults } from "@/hooks/quests/useSelfExplorationResults";
import { supabase } from "@/integrations/supabase/client";
import { useProfileData } from "@/hooks/profile/useProfileData";
import SelfExplorationQuestCardHeader from "./self-exploration/SelfExplorationQuestCardHeader";
import SelfExplorationQuestCardContent from "./self-exploration/SelfExplorationQuestCardContent";
import SelfExplorationQuestCardHoverOverlay from "./self-exploration/SelfExplorationQuestCardHoverOverlay";
import SelfExplorationQuestCardModals from "./self-exploration/SelfExplorationQuestCardModals";
import GreyCountdownPill from "./GreyCountdownPill";

interface SelfExplorationQuestCardProps {
	userQuest: UserSelfExplorationQuest;
	onRetakeComplete?: () => void;
	isLocked?: boolean;
	userGreyPoints?: number;
}

const SelfExplorationQuestCard: React.FC<SelfExplorationQuestCardProps> = ({
	userQuest,
	onRetakeComplete,
	isLocked = false,
	userGreyPoints = 0,
}) => {
	const [currentView, setCurrentView] = useState<"card" | "flow" | "results">("card");
	const [isHovered, setIsHovered] = useState(false);
	const { startQuest, startRetake, isStartingQuest, isStartingRetake, checkRetakeEligibility } =
		useSelfExplorationQuestActions();
	const { profile } = useProfileData(user?.id || null);

	const quest = userQuest.self_exploration_quest;
	const state = userQuest.state;

	const { data: resultData } = useSelfExplorationResults(quest.id);

	console.log("SelfExplorationQuestCard render:", {
		questId: quest.id,
		state,
		currentView,
		questTitle: quest.title,
		hasQuestions: quest.questions?.length > 0,
		isLocked,
	});

	// Calculate grey points needed for unlock
	const greyUnlockRequired = quest.grey_unlock || 0;
	const userCurrentGreyPoints = profile?.grey_points || userGreyPoints;
	const greyPointsNeeded =
		greyUnlockRequired > userCurrentGreyPoints ? greyUnlockRequired - userCurrentGreyPoints : 0;
	const shouldShowGreyCountdown = greyPointsNeeded > 0;

	const handleStart = async () => {
		if (isLocked) return;
		try {
			console.log("🚀 SelfExplorationQuestCard.handleStart called for quest:", quest.id);
			await startQuest.mutateAsync(quest.id);
			console.log("✅ Quest started successfully, opening flow modal");
			setCurrentView("flow");
		} catch (error) {
			console.error("❌ Failed to start quest:", error);
		}
	};

	const handleContinue = () => {
		if (isLocked) return;
		console.log("▶️ SelfExplorationQuestCard.handleContinue called for quest:", quest.id);
		setCurrentView("flow");
	};

	const handleViewResults = () => {
		if (isLocked) return;
		console.log("📊 SelfExplorationQuestCard.handleViewResults called for quest:", quest.id);
		setCurrentView("results");
	};

	const handleFlowComplete = () => {
		console.log("🎉 SelfExplorationQuestCard.handleFlowComplete called");
		setCurrentView("results");
	};

	const handleClose = () => {
		console.log("❌ SelfExplorationQuestCard.handleClose called, returning to card view");
		setCurrentView("card");
	};

	const handleRetake = async () => {
		if (isLocked) return;
		try {
			console.log("🔄 SelfExplorationQuestCard.handleRetake called for quest:", quest.id);

			const canRetake = await checkRetakeEligibility(quest.id);
			if (!canRetake) {
				console.log("❌ Retake not eligible");
				return;
			}

			console.log("✅ Retake eligible, starting retake mutation");
			await startRetake.mutateAsync(quest.id);

			console.log("✅ Retake mutation completed, calling onRetakeComplete");
			// Call the callback to switch to active tab
			if (onRetakeComplete) {
				onRetakeComplete();
			}
		} catch (error) {
			console.error("❌ Failed to start retake:", error);
		}
	};

	// Get proper storage URL for background image
	const getStorageUrl = (fileName: string) => {
		if (!fileName) return null;
		if (fileName.startsWith("http")) return fileName;
		const { data } = supabase.storage.from("background-images").getPublicUrl(fileName);
		return data.publicUrl;
	};

	const backgroundImage = quest.image ? getStorageUrl(quest.image) : null;

	// Transform result data to match expected type - get the first result if it's an array
	const transformedResult =
		resultData && resultData.length > 0
			? {
					id: resultData[0].id,
					user_id: resultData[0].user_id,
					quest_id: resultData[0].quest_id,
					ai_response: resultData[0].ai_response,
					prompt_used: resultData[0].prompt_used,
					responses_data: resultData[0].responses_data as Record<string, any>,
					version_number: resultData[0].version_number,
					created_at: resultData[0].created_at,
					session_id: resultData[0].session_id,
			  }
			: null;

	return (
		<>
			<Card
				className={`w-full h-full flex flex-col relative overflow-hidden group ${
					isLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
				}`}
				style={{
					minHeight: "360px",
					maxWidth: "81%",
				}}
				onMouseEnter={() => !isLocked && setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{/* Background Image */}
				{backgroundImage && (
					<div
						className={`absolute inset-0 bg-cover bg-center ${
							isLocked ? "opacity-10" : "opacity-20"
						}`}
						style={{ backgroundImage: `url(${backgroundImage})` }}
					/>
				)}

				{/* Grey countdown pill for locked quests - positioned at top right */}
				{shouldShowGreyCountdown && (
					<div className="absolute top-2 right-2 z-30">
						<GreyCountdownPill greyPointsNeeded={greyPointsNeeded} />
					</div>
				)}

				<CardHeader>
					<SelfExplorationQuestCardHeader
						quest={quest}
						state={state}
						currentQuestionIndex={userQuest.current_question_index || 0}
					/>
				</CardHeader>

				<CardContent className="flex-1 flex flex-col">
					<SelfExplorationQuestCardContent quest={quest} />
				</CardContent>

				{!isLocked && (
					<SelfExplorationQuestCardHoverOverlay
						state={state}
						isHovered={isHovered}
						isStartingQuest={isStartingQuest}
						isStartingRetake={isStartingRetake}
						onStart={handleStart}
						onContinue={handleContinue}
						onViewResults={handleViewResults}
						onRetake={handleRetake}
					/>
				)}
			</Card>

			{!isLocked && (
				<SelfExplorationQuestCardModals
					currentView={currentView}
					quest={quest}
					userQuest={userQuest}
					result={transformedResult}
					onFlowComplete={handleFlowComplete}
					onClose={handleClose}
					onRetake={handleRetake}
					onViewChange={setCurrentView}
				/>
			)}
		</>
	);
};

export default SelfExplorationQuestCard;
