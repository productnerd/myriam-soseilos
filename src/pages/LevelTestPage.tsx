import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserContext } from "@/contexts/UserContext";
import { useLevelTestLogic } from "@/hooks/test/useLevelTestLogic";
import { handleLevelTestResult } from "@/utils/test/results/levelTestUtils";
import { createOrUpdateUserTestScore } from "@/utils/test/results/scoreUtils";
import PageTransition from "@/components/ui/PageTransition";
import LevelTestContent from "@/components/test/level/LevelTestContent";
import LevelTestLoading from "@/components/test/level/LevelTestLoading";

const LevelTestPage = () => {
	// Get the user from the user context
	const { user } = useUserContext();

	// Extract 'testId' from the URL parameters (e.g. /level-test/123/... -> testId = "123")
	const { testId, levelId } = useParams();

	// Show loading state if 'testId' or 'levelId' are not available yet (i.e. undefined)
	if (!testId || !levelId) {
		return <LevelTestLoading />;
	}

	const {
		testActivities,
		isLoading, // Whether test activities are being loaded
		currentActivityIndex,
		selectedAnswer,
		showFeedback,
		isCorrect,
		testCompleted,
		finalScore,
		timeRemaining,
		handleAnswerActivity,
		handleAdvanceActivity,
		handleTimeout,
	} = useLevelTestLogic(testId, levelId, user!.id);

	// Trigger level unlocking when test is completed with a passing score
	useEffect(() => {
		if (testCompleted && testId && finalScore >= 80) {
			// Use a small delay to ensure the database has been updated
			const unlockTimeout = setTimeout(async () => {
				try {
					// Double-check if the user_test_scores record exists
					// Verify user_test_scores record exists
					const { data: testScores, error } = await supabase
						.from("user_test_scores")
						.select("*")
						.eq("test_id", testId)
						.eq("user_id", user!.id)
						.order("completed_at", { ascending: false })
						.limit(1);

					if (error || !testScores || testScores.length === 0) {
						// Create or update user_test_score record if missing
						await createOrUpdateUserTestScore(
							testId,
							user!.id,
							finalScore,
							finalScore >= 80,
							false
						);
					}

					// Handle the level test result
					await handleLevelTestResult(user!.id, testId, levelId, true);
				} catch (err) {
					console.error("Failed to handle level test result:", err);
					// Remove error toast - silently fail as functionality works
				}
			}, 500);

			return () => clearTimeout(unlockTimeout);
		}
	}, [testCompleted, testId, finalScore, user!.id, levelId]);

	return (
		<PageTransition key={`level-test-page-${testId}`}>
			<div className="container pb-24 mx-auto">
				<div className="max-w-4xl mx-auto pt-4 px-4">
					{isLoading ? (
						<LevelTestLoading />
					) : (
						<LevelTestContent
							testId={testId}
							activities={testActivities}
							currentActivityIndex={currentActivityIndex}
							selectedAnswer={selectedAnswer}
							showFeedback={showFeedback}
							isCorrect={isCorrect}
							timeRemaining={timeRemaining}
							onAnswer={handleAnswerActivity}
							onAdvance={handleAdvanceActivity} // For level tests, next = advance to next activity
							onTimeout={handleTimeout}
						/>
					)}
				</div>
			</div>
		</PageTransition>
	);
};

export default LevelTestPage;
