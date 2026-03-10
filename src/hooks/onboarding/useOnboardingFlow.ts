import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/ui/useToast";
import { supabase } from "@/integrations/supabase/client";
import { useSkillVotes } from "@/hooks/onboarding/useSkillVotes";
import { OnboardingStep } from "@/components/onboarding/OnboardingStepManager";

/**
 * Hook for managing onboarding flow
 *
 * @param userId - The ID of the authenticated user
 * @returns Onboarding flow state and functions
 */
export function useOnboardingFlow(userId: string) {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.WELCOME);
	const [showAssessment, setShowAssessment] = useState(false);
	const { submitSkillVotes, topSkills, fetchTopSkills } = useSkillVotes(userId);

	// Fetch top skills when we need to show statistics
	useEffect(() => {
		if (currentStep === OnboardingStep.SKILL_STATISTICS) {
			fetchTopSkills();
		}
	}, [currentStep, fetchTopSkills]);

	const handleStartAssessment = () => {
		setShowAssessment(true);
		setCurrentStep(OnboardingStep.ASSESSMENT);
	};

	const handleAssessmentComplete = () => {
		setShowAssessment(false);
		setCurrentStep(OnboardingStep.SKILL_SELECTION);
	};

	const handleSkillSubmit = async (selectedSkills: string[]) => {
		try {
			// Submit skills to database
			await submitSkillVotes(selectedSkills);
			setCurrentStep(OnboardingStep.SKILL_STATISTICS);
		} catch (error) {
			console.error("Error submitting skills:", error);
			toast({
				title: "Error",
				description: "Failed to save your skills. Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleContinueAfterStats = () => {
		setCurrentStep(OnboardingStep.FLAG_SELECTION);
	};

	const handleFlagSubmit = async (selectedFlag: string) => {
		try {
			// Save the flag to the user's profile
			// The database trigger will automatically set the country based on the flag
			await supabase.from("profiles").update({ flag: selectedFlag }).eq("id", userId);

			// Go to emoji selection step
			setCurrentStep(OnboardingStep.EMOJI_SELECTION);
		} catch (error) {
			console.error("Error saving flag:", error);
			toast({
				title: "Error",
				description: "Failed to save your flag selection. Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleEmojiSubmit = async (selectedEmoji: string | null) => {
		try {
			// Save the emoji to the user's profile and mark onboarding as completed
			await supabase
				.from("profiles")
				.update({
					favorite_emoji: selectedEmoji,
					onboarding_completed: true,
				})
				.eq("id", userId);

			// Go to completion step
			setCurrentStep(OnboardingStep.COMPLETE);

			// Store flag in localStorage to indicate course picker should be opened
			localStorage.setItem("showCoursePicker", "true");

			// After a short delay, navigate to learn page
			setTimeout(() => {
				navigate("/learn");
			}, 3000);
		} catch (error) {
			console.error("Error saving emoji:", error);
			toast({
				title: "Error",
				description: "Failed to save your emoji selection. Please try again.",
				variant: "destructive",
			});
		}
	};

	return {
		currentStep,
		showAssessment,
		topSkills,
		handleStartAssessment,
		handleAssessmentComplete,
		handleSkillSubmit,
		handleContinueAfterStats,
		handleFlagSubmit,
		handleEmojiSubmit,
	};
}
