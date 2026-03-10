import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Activity } from "@/types/activity";
import { toast } from "@/hooks/ui/useToast";
import { getExplanationForAnswer } from "@/utils/activities/activityOperations";
import { Button } from "@/components/ui/interactive/Button";
import ActivityContainer from "@/components/activities/layout/ActivityContainer";
import LearningProgressBar from "@/components/learning/flow/LearningProgressBar";

interface SampleReviewFlowProps {
	activity: Activity;
}

const SampleReviewFlow: React.FC<SampleReviewFlowProps> = ({ activity }) => {
	const [key, setKey] = useState(0);
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [selectedAnswer, setSelectedAnswer] = useState<string>("");
	const [showFeedback, setShowFeedback] = useState<boolean>(false);
	const [isCorrect, setIsCorrect] = useState<boolean>(false);
	const [completed, setCompleted] = useState<boolean>(false);

	// Simulating a review session with asingle activity
	const activities = [activity];

	// Show demo toast on first render
	useEffect(() => {
		setTimeout(() => {
			toast.topCenter({
				title: "Sample Revieww Flow",
				description: "This is a demo of the review flow",
				icon: Sparkles,
				iconProps: { className: "text-yellow-500" },
				duration: 3000,
			});
		}, 1000);
	}, []);

	const handleAnswer = (answer: string) => {
		setSelectedAnswer(answer);
		setIsCorrect(answer === activities[currentIndex].correct_answer);
		setShowFeedback(true);
	};

	const handleAdvance = () => {
		if (currentIndex < activities.length - 1) {
			setCurrentIndex((prev) => prev + 1);
			setSelectedAnswer("");
			setShowFeedback(false);
		} else {
			// Set completed to true instead of resetting for demo purposes
			setCompleted(true);
			// Show a toast when the flow is completed
			toast.topRight({
				title: "Review Completed!",
				description: "You've successfully completed this review.",
				icon: Sparkles,
				iconProps: { className: "text-green-500" },
			});
		}
	};

	const resetFlow = (e: React.MouseEvent) => {
		// Prevent event from bubbling up to parent containers
		e.stopPropagation();

		setKey((prev) => prev + 1);
		setCurrentIndex(0);
		setSelectedAnswer("");
		setShowFeedback(false);
		setIsCorrect(false);
		setCompleted(false);
	};

	// Handle clicking anywhere on the screen to progress
	const handleScreenClick = () => {
		// Only advance if feedback is already showing (means user has answered)
		if (showFeedback) {
			handleAdvance();
		}
	};

	// Ensure we have a valid explanation converted to string
	const explanation = getExplanationForAnswer(
		activities[currentIndex]?.explanation,
		selectedAnswer
	);

	// Show completion screen if completed
	if (completed) {
		return (
			<div className="flex flex-col items-center justify-center py-6 space-y-8">
				<div className="text-center space-y-4">
					<h2 className="text-2xl font-bold">Review Completed!</h2>
					<p className="text-muted-foreground">Great job completing this review!</p>
				</div>
				<Button
					onClick={resetFlow}
					variant="secondary"
					className="flex items-center gap-2 mt-8"
				>
					Continue →
				</Button>
			</div>
		);
	}

	return (
		<div className="mb-16">
			<h2 className="text-2xl font-bold mb-4">Review Flow</h2>
			<div className="bg-card rounded-lg shadow-md relative">
				{/* Progress bar at the very top */}
				<div className="absolute top-0 left-0 right-0">
					<LearningProgressBar
						currentIndex={currentIndex}
						totalCount={activities.length}
						showFeedback={showFeedback}
						className="px-6 py-2"
					/>
				</div>

				{/* Content with top padding */}
				<div
					key={key}
					className="pt-8 p-6"
					onClick={handleScreenClick}
					style={{ cursor: showFeedback ? "pointer" : "default" }}
				>
					<ActivityContainer
						activity={activities[currentIndex]}
						currentActivityIndex={currentIndex}
						totalActivities={activities.length}
						selectedAnswer={selectedAnswer}
						showFeedback={showFeedback}
						isCorrect={isCorrect}
						onAnswer={handleAnswer}
						onAdvance={handleAdvance}
						explanation={explanation}
						flowType="review"
					/>
				</div>
			</div>
			<Button onClick={resetFlow} variant="outline" className="w-full mt-4">
				Restart Review Flow
			</Button>
		</div>
	);
};

export default SampleReviewFlow;
