import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Loader2 } from "lucide-react";
import { useUserContext } from "@/contexts/UserContext";
import { enableStreakProtection } from "@/hooks/learning/progress/streakProtection";
import MentorPopup from "@/components/ui/MentorPopup";

interface ReviewSuccessScreenProps {
	onContinue: () => void;
}

const ReviewSuccessScreen: React.FC<ReviewSuccessScreenProps> = ({ onContinue }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showMentorPopup, setShowMentorPopup] = useState<boolean>(false);
	const { user } = useUserContext();

	// Enable streak protection when review is completed
	useEffect(() => {
		const enableProtection = async () => {
			try {
				console.log("Enabling streak protection for review completion");
				await enableStreakProtection(user!.id);

				// Show mentor popup instead of toast
				setShowMentorPopup(true);

				console.log("Streak protection enabled successfully for review completion");
			} catch (error) {
				console.error("Error enabling streak protection for review:", error);
			}
		};

		enableProtection();
	}, [user!.id]);

	const handleContinue = () => {
		if (isLoading) return; // Prevent multiple clicks
		setIsLoading(true);

		try {
			// This sets 'showReview' state (in ActivityFlow) to false, which returns to the normal learning flow
			// LearningFlow will handle showing the appropriate content
			onContinue();
		} catch (error) {
			console.error("Error in review completion flow:", error);
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className="text-center py-8 space-y-8">
				<div className="flex justify-center">
					<img
						src="/lovable-uploads/f23684f3-47e2-490d-b464-69ce231df050.png"
						alt="Fire Badge"
						className="h-20 w-20"
					/>
				</div>

				<div className="space-y-4 text-center">
					<h2 className="text-2xl font-bold text-center">Review Complete!</h2>
					<p className="text-muted-foreground text-center">
						Your streak is protected for the day and will not reset to zero.
					</p>
				</div>

				<div className="flex justify-center pt-4">
					<Button
						onClick={handleContinue}
						size="lg"
						className="px-8"
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								Processing
							</>
						) : (
							"Continue"
						)}
					</Button>
				</div>
			</div>

			<MentorPopup
				content="Streak protected! Your streak is safe for today even if you don't complete 20 activities."
				isVisible={showMentorPopup}
			/>
		</>
	);
};

export default ReviewSuccessScreen;
