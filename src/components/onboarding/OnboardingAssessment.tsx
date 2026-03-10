import React from "react";

interface OnboardingAssessmentProps {
	onComplete: () => void;
}

// This component is no longer used as the assessment is now integrated directly into the OnboardingStepManager
const OnboardingAssessment: React.FC<OnboardingAssessmentProps> = ({ onComplete }) => {
	return null;
};

export default OnboardingAssessment;
