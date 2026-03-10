import React, { useEffect } from "react";
import SkillSelectionPills from "./SkillSelectionPills";
import FlagSelectionPills from "../emoji/FlagSelectionPills";
import EmojiSelection from "../emoji/EmojiSelection";
import SkillVoteStats from "./SkillVoteStats";
import WelcomeStep from "./steps/WelcomeStep";
import CompletionStep from "./steps/CompletionStep";
import OnboardingTestContent from "./OnboardingTestContent";
import { useOnboardingAssessment } from "@/hooks/onboarding/useOnboardingAssessment";

export enum OnboardingStep {
	WELCOME,
	ASSESSMENT,
	SKILL_SELECTION,
	SKILL_STATISTICS,
	FLAG_SELECTION,
	EMOJI_SELECTION,
	COMPLETE,
}

interface OnboardingStepManagerProps {
	currentStep: OnboardingStep;
	showAssessment: boolean;
	topSkills: Array<{
		skill: string;
		percentage: number;
	}>;
	onStartAssessment: () => void;
	onAssessmentComplete: () => void;
	onSkillSubmit: (selectedSkills: string[]) => void;
	onContinueAfterStats: () => void;
	onFlagSubmit: (selectedFlag: string) => void;
	onEmojiSubmit: (selectedEmoji: string | null) => void;
	onMentorUpdate: (show: boolean, message: string, hideMessage?: boolean) => void;
}

const OnboardingStepManager: React.FC<OnboardingStepManagerProps> = ({
	currentStep,
	showAssessment,
	topSkills,
	onStartAssessment,
	onAssessmentComplete,
	onSkillSubmit,
	onContinueAfterStats,
	onFlagSubmit,
	onEmojiSubmit,
	onMentorUpdate,
}) => {
	// Using our custom hook for onboarding assessment
	const {
		activities,
		isLoading,
		error,
		currentActivityIndex,
		selectedAnswer,
		showFeedback,
		isCorrect,
		testCompleted,
		finalScore,
		handleAnswerActivity,
		handleAdvanceActivity,
	} = useOnboardingAssessment();

	// Handle assessment completion - move to next step when test is completed
	useEffect(() => {
		if (testCompleted) {
			console.log("Assessment completed, moving to next step");
			onAssessmentComplete();
		}
	}, [testCompleted, onAssessmentComplete]);

	// Update mentor based on current step
	useEffect(() => {
		console.log("Current step changed to:", currentStep);
		switch (currentStep) {
			case OnboardingStep.ASSESSMENT:
				// Don't show mentor during assessment questions (unless test is completed)
				if (!testCompleted) {
					onMentorUpdate(false, "");
				}
				break;
			case OnboardingStep.SKILL_SELECTION:
				console.log("Showing mentor for skill selection step");
				onMentorUpdate(
					true,
					"Your selection helps us prioritise what courses to work on next"
				);
				break;
			case OnboardingStep.SKILL_STATISTICS:
				// Show mentor without speech bubble (just the character)
				onMentorUpdate(
					true,
					"This helps us prioritise what skills to make available to you next",
					true
				);
				break;
			case OnboardingStep.FLAG_SELECTION:
				onMentorUpdate(true, "Don't worry, these can be changed later");
				break;
			case OnboardingStep.EMOJI_SELECTION:
				onMentorUpdate(true, "Don't worry, these can be changed later");
				break;
			case OnboardingStep.COMPLETE:
				// Hide mentor with slide-down animation
				onMentorUpdate(false, "", false);
				break;
			default:
				onMentorUpdate(false, "");
				break;
		}
	}, [currentStep, testCompleted, onMentorUpdate]);

	// Render different content based on the current step
	switch (currentStep) {
		case OnboardingStep.WELCOME:
			return (
				<div className="flex flex-col">
					<WelcomeStep onContinue={onStartAssessment} />
				</div>
			);
		case OnboardingStep.ASSESSMENT:
			return (
				<div className="flex flex-col">
					<OnboardingTestContent
						testActivities={activities}
						isLoading={isLoading}
						error={error}
						currentActivityIndex={currentActivityIndex}
						selectedAnswer={selectedAnswer}
						showFeedback={showFeedback}
						isCorrect={isCorrect}
						testCompleted={testCompleted}
						finalScore={finalScore}
						handleAnswerActivity={handleAnswerActivity}
						handleAdvanceActivity={handleAdvanceActivity}
						handleContinue={onAssessmentComplete}
						onMentorUpdate={onMentorUpdate}
					/>
				</div>
			);
		case OnboardingStep.SKILL_SELECTION:
			return (
				<div className="flex flex-col">
					<SkillSelectionPills onSubmit={onSkillSubmit} />
				</div>
			);
		case OnboardingStep.SKILL_STATISTICS:
			return (
				<div className="flex flex-col ">
					<SkillVoteStats stats={topSkills} onContinue={onContinueAfterStats} />
				</div>
			);
		case OnboardingStep.FLAG_SELECTION:
			return (
				<div className="flex flex-col">
					<FlagSelectionPills onSubmit={onFlagSubmit} />
				</div>
			);
		case OnboardingStep.EMOJI_SELECTION:
			return (
				<div className="flex flex-col">
					<EmojiSelection onSubmit={onEmojiSubmit} />
				</div>
			);
		case OnboardingStep.COMPLETE:
			return (
				<div className="flex flex-col min-h-[400px]">
					<CompletionStep />
				</div>
			);
		default:
			return null;
	}
};

export default OnboardingStepManager;
