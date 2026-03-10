import React from "react";
import { useNavigate } from "react-router-dom";
import { Level } from "@/types/level";
import { useTopicsByLevel } from "@/hooks/courses";
import { useUserContext } from "@/contexts/UserContext";
import LevelHeader from "@/components/test/level/LevelHeader";
import LevelTopicsList from "@/components/test/level/LevelTopicsList";
import LevelTestRetryButton from "./LevelTestRetryButton";

interface LevelAccordionProps {
	level: Level;
	courseColor?: string;
	courseId?: string;
	previousLevelCompleted?: boolean;
}

/**
 * Component that displays a level with its topics in an accordion format.
 */
const LevelAccordion: React.FC<LevelAccordionProps> = ({
	level,
	courseColor,
	courseId,
	previousLevelCompleted = true, // Default to true for first level
}) => {
	const navigate = useNavigate();
	const { user } = useUserContext();

	// Get topics for this level (note: topics don't have status properties)
	const {
		data: topics,
		completedTopics,
		currentTopicId,
		isLoading,
		error,
	} = useTopicsByLevel(level.id, user!.id);

	// Check if all topics in this level are completed
	const areAllTopicsCompleted =
		topics?.every((topic) => {
			const isCompletedInDB = completedTopics?.some((ct) => ct.topic_id === topic.id);
			return isCompletedInDB;
		}) ?? false;

	// Process the course color
	const accentColor = courseColor || "#8B5CF6";
	const processedColor = accentColor.startsWith("#") ? accentColor : `#${accentColor}`;

	// Derived colors
	const activeBg = `${processedColor}15`; // 15% opacity
	const activeRing = `${processedColor}40`; // 40% opacity
	const completedBg = `${processedColor}10`; // 10% opacity

	// A level is locked if the previous level is not completed
	// First level is never locked
	const isLevelLocked = !previousLevelCompleted;

	// Use darker grey border for locked levels, course color for unlocked levels
	const borderColor = isLevelLocked ? "#222222" : processedColor;

	const handleTopicClick = (topicId: string) => {
		if (isLevelLocked) return; // Prevent clicking on topics in locked levels
		navigate(`/learn/${topicId}`);
	};

	const handleStartTest = (testId: string) => {
		console.debug("Starting level test with ID:", testId);
		navigate(`/level-test/${testId}/${level.id}?returnUrl=/learn`);
	};

	return (
		<div
			className="w-full mb-4 border rounded-lg overflow-hidden"
			style={{ borderColor, borderWidth: "2px" }}
		>
			<LevelHeader
				title={level.title}
				levelId={level.id}
				processedColor={processedColor}
				isLevelCompleted={areAllTopicsCompleted}
				isCheckingCompletion={false}
				isLevelLocked={isLevelLocked}
				orderNumber={level.order_number}
			/>

			<div className="border-t" style={{ borderColor }}>
				<LevelTopicsList
					topics={topics}
					isLoading={isLoading}
					error={error}
					processedColor={processedColor}
					activeBg={activeBg}
					activeRing={activeRing}
					completedBg={completedBg}
					handleTopicClick={handleTopicClick}
					isLevelCompleted={areAllTopicsCompleted} // This prop determines if the level test button is shown (if all topics are completed)
					isCheckingCompletion={false}
					levelId={level.id}
					onStartTest={handleStartTest}
					completedTopics={completedTopics}
					currentTopicId={currentTopicId}
					isLevelLocked={isLevelLocked}
				/>

				{/* Show retry test button if user has access to this level and all topics are completed */}
				{!isLevelLocked && areAllTopicsCompleted && user?.id && (
					<LevelTestRetryButton
						levelId={level.id}
						processedColor={processedColor}
						onRetry={handleStartTest}
					/>
				)}
			</div>
		</div>
	);
};

export default LevelAccordion;
