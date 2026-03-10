import React from "react";
import { Topic } from "@/types/topic";
import { Check } from "lucide-react";
import LevelTestButton from "./LevelTestButton";
import { usePlayButton } from "@/hooks/ui/usePlayButton";
import { cn } from "@/lib/utils";
import { useUserContext } from "@/contexts/UserContext";
import { Badge } from "@/components/ui/data/Badge";

interface LevelTopicsListProps {
	topics: Topic[] | undefined;
	isLoading: boolean;
	error: Error | null;
	processedColor: string;
	activeBg: string;
	activeRing: string;
	completedBg: string;
	handleTopicClick: (topicId: string) => void;
	isLevelCompleted: boolean;
	isCheckingCompletion: boolean;
	levelId: string;
	onStartTest: (testId: string) => void;
	completedTopics?: Array<{ topic_id: string }>;
	currentTopicId?: string | null;
	isLevelLocked: boolean;
}

/**
 * Component that displays a list of topics for a level.
 */
const LevelTopicsList: React.FC<LevelTopicsListProps> = ({
	topics,
	isLoading,
	error,
	processedColor,
	activeBg,
	activeRing,
	completedBg,
	handleTopicClick,
	isLevelCompleted,
	isCheckingCompletion,
	levelId,
	onStartTest,
	completedTopics,
	currentTopicId,
	isLevelLocked,
}) => {
	const { user } = useUserContext();
	const { handleStartLearning } = usePlayButton(user!.id);

	if (isLoading) {
		return (
			<div className="p-4 text-center text-muted-foreground">
				<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
				Loading topics...
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-4 text-center text-destructive">
				Failed to load topics. Please try again.
			</div>
		);
	}

	if (!topics || topics.length === 0) {
		return (
			<div className="p-4 text-center text-muted-foreground">
				No topics available for this level.
			</div>
		);
	}

	return (
		<div className="p-4 space-y-3">
			{topics.map((topic) => {
				// Determine topic status based on database completion status
				const isCompleted =
					completedTopics?.some((ct) => ct.topic_id === topic.id) ?? false;
				const isActive = currentTopicId === topic.id && !isCompleted;
				const isClickable = isActive && !isLevelLocked;

				let bg = "bg-transparent";
				let ring = "ring-transparent";
				let textColor = "text-foreground";
				let icon = null;

				if (isActive) {
					bg = activeBg;
					ring = `ring-2 ring-offset-1 ${activeRing}`;
				} else if (isCompleted) {
					bg = completedBg;
					textColor = "text-muted-foreground";
					icon = <Check className="h-4 w-4 mr-2 text-green-500" />;
				} else if (isLevelLocked) {
					textColor = "text-muted-foreground";
				}

				const handleClick = () => {
					if (isClickable) {
						handleStartLearning();
					}
				};

				return (
					<button
						key={topic.id}
						className={cn(
							"w-full flex flex-col items-start p-3 rounded-md text-sm font-medium tracking-wide transition-colors duration-200",
							textColor,
							bg,
							ring,
							isClickable
								? "hover:bg-secondary/50 cursor-pointer"
								: "cursor-not-allowed opacity-70"
						)}
						onClick={handleClick}
						disabled={!isClickable}
					>
						<div className="flex items-center w-full">
							{icon}
							{topic.title}

							{/* Current pill with glowing circle */}
							{isActive && !isLevelLocked && (
								<span className="ml-2 text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full flex items-center gap-1">
									<span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
									Current
								</span>
							)}
						</div>

						{/* Topic Tags - Display them if available */}
						{topic.tags && topic.tags.length > 0 && (
							<div className="flex flex-wrap gap-1 mt-1.5">
								{topic.tags.map((tag, index) => (
									<span
										key={index}
										className={cn(
											"text-xs px-2 py-0.5 rounded-full",
											isLevelLocked
												? "bg-muted/30 text-muted-foreground/50"
												: "bg-muted/50 text-muted-foreground"
										)}
									>
										{tag}
									</span>
								))}
							</div>
						)}
					</button>
				);
			})}

			{/* Level Test Button */}
			{isLevelCompleted && !isCheckingCompletion && !isLevelLocked && (
				<div className="mt-4 pt-4 border-t">
					<LevelTestButton
						levelId={levelId}
						onStartTest={onStartTest}
						isLevelCompleted={isLevelCompleted}
						processedColor={processedColor}
					/>
				</div>
			)}

			{/* Loading states for level test button */}
			{isLevelCompleted && isCheckingCompletion && (
				<Badge variant="outline" className="w-full mt-2 text-muted-foreground">
					<div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
					Checking Completion...
				</Badge>
			)}
		</div>
	);
};

export default LevelTopicsList;
