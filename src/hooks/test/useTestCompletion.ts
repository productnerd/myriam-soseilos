import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { saveTestResults } from "@/utils/test/results";
import { toast } from "sonner";

export function useTestCompletion(
	testId: string,
	courseId: string,
	onComplete: (skipped: boolean) => void,
	isLevelTest: boolean = false
) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const queryClient = useQueryClient();

	/**
	 * Handle test completion by saving results to the database and updating UI
	 * @param forceComplete Force test completion (e.g. when skipping)
	 * @param skipped Whether test was skipped
	 * @param score Current score
	 * @param totalQuestions Total number of questions
	 */
	const handleTestCompletion = async (
		forceComplete: boolean = false,
		skipped: boolean = false,
		score: number = 0,
		totalQuestions: number = 0
	): Promise<boolean> => {
		try {
			setIsSubmitting(true);

			// CRITICAL: In level tests, never allow skipping
			if (isLevelTest) {
				skipped = false;
			}

			console.log(
				"Saving test results for testId:",
				testId,
				"score:",
				score,
				"totalQuestions:",
				totalQuestions
			);

			const passed = isLevelTest ? (score / totalQuestions) * 100 >= 80 : true;

			// Save test results - add extra logging to debug
			console.debug("Calling saveTestResults with:", {
				testId,
				courseId,
				score,
				totalQuestions,
				skipped,
				passed,
			});

			const success = await saveTestResults(
				testId,
				courseId,
				score,
				totalQuestions,
				skipped,
				passed
			);

			if (!success) {
				console.error("Failed to save test results");
				toast.error("Error saving test results");
				return false;
			}

			// Check if result was actually saved
			const { data: testScore, error: checkError } = await supabase
				.from("user_test_scores")
				.select("*")
				.eq("test_id", testId)
				.maybeSingle();

			if (checkError || !testScore) {
				console.error(
					"Test score verification failed:",
					checkError || "No test score found"
				);
				toast.error("Error verifying test results");
				return false;
			}

			console.log("Test results saved successfully:", testScore);

			// Invalidate related queries
			queryClient.invalidateQueries({ queryKey: ["testScores"] });
			queryClient.invalidateQueries({ queryKey: ["userProgress"] });
			queryClient.invalidateQueries({ queryKey: ["userTestScores"] });

			if (forceComplete) {
				// If forcing completion (e.g. when skipping), call the onComplete callback
				onComplete(skipped);
			}

			return true;
		} catch (error) {
			console.error("Error in handleTestCompletion:", error);
			toast.error("An error occurred while completing the test");
			return false;
		} finally {
			setIsSubmitting(false);
		}
	};

	return { isSubmitting, handleTestCompletion };
}
