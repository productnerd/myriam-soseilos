
import { supabase } from "@/integrations/supabase/client";
import { handleLevelTestProgression } from "@/utils/test/levelTestProgression";

export interface SaveTestResultsParams {
	userId: string;
	testId: string;
	score: number;
	passed: boolean;
	answers: Array<{
		activityId: string;
		selectedAnswer: string;
		isCorrect: boolean;
	}>;
	courseId?: string;
	isLevelTest?: boolean;
}

export async function saveTestResults({
	userId,
	testId,
	score,
	passed,
	answers,
	isLevelTest = false,
}: SaveTestResultsParams): Promise<boolean> {
	try {
		console.log("Saving test results:", { userId, testId, score, passed, isLevelTest });

		// Save the test score
		// TODO: Table `user_test_scores` does not exist - is this supposed to be `test_scores`?
		const { error: scoreError } = await supabase.from("user_test_scores").upsert({
			user_id: userId,
			test_id: testId,
			score,
			passed,
			completed_at: new Date().toISOString(),
		});

		if (scoreError) {
			console.error("Error saving test score:", scoreError);
			return false;
		}

		// Save individual answers
		for (const answer of answers) {
			// TODO: Table `user_test_answers` does not exist
			const { error: answerError } = await supabase.from("user_test_answers").upsert({
				user_id: userId,
				test_id: testId,
				activity_id: answer.activityId,
				selected_answer: answer.selectedAnswer,
				is_correct: answer.isCorrect,
				created_at: new Date().toISOString(),
			});

			if (answerError) {
				console.error("Error saving answer:", answerError);
			}

			// Deduct flow points for each answer using the RPC function directly
			try {
				const { error: flowError } = await supabase.rpc("deduct_flow_points", {
					p_user_id: userId,
					p_is_correct: answer.isCorrect,
				});

				if (flowError) {
					console.error("Error deducting flow points:", flowError);
				}
			} catch (flowError) {
				console.error("Error deducting flow points:", flowError);
			}
		}

		// Handle level test progression if this is a level test
		if (isLevelTest && passed) {
			await handleLevelTestProgression(userId, testId, score, passed);
		}

		console.log("Test results saved successfully");
		return true;
	} catch (error) {
		console.error("Error saving test results:", error);
		return false;
	}
}
