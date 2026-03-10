import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SelfExplorationQuestion } from "@/types/self-exploration";

/**
 * Hook for managing self-exploration quest flow
 *
 * @param questId - The ID of the quest
 * @param initialQuestionIndex - Optional initial question index
 * @param userId - The ID of the authenticated user
 * @returns Self-exploration quest flow state and functions
 */
export const useSelfExplorationQuestFlow = (
	questId: string,
	userId: string,
	initialQuestionIndex?: number
) => {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialQuestionIndex || 0);
	const [responses, setResponses] = useState<Record<number, string>>({});
	const [isCompletingQuest, setIsCompletingQuest] = useState(false);

	console.log("🔧 useSelfExplorationQuestFlow initialized:", {
		questId,
		initialQuestionIndex,
		currentQuestionIndex,
		userId,
	});

	// TODO: Consider using the centralized answer handler from `utils/activityFlowHandling`
	const handleAnswerQuestion = async (
		answer: string,
		question: SelfExplorationQuestion,
		questionIndex: number
	) => {
		console.log("📝 Answer selected:", { answer, questionIndex, questId });

		setResponses((prev) => ({
			...prev,
			[questionIndex]: answer,
		}));

		// Save progress to database
		try {
			console.log("💾 Saving progress to database...");
			const { error } = await supabase
				.from("user_self_exploration_quests")
				.update({
					current_question_index: questionIndex,
					progress: ((questionIndex + 1) / 5) * 100, // Assuming 5 questions total
				})
				.eq("self_exploration_quest_id", questId)
				.eq("user_id", userId);

			if (error) {
				console.error("❌ Error saving progress:", error);
			} else {
				console.log("✅ Progress saved successfully");
			}
		} catch (error) {
			console.error("💥 Exception saving progress:", error);
		}
	};

	// TODO: Consider using the centralized advance handler from `utils/activityFlowHandling`
	const handleNextQuestion = async () => {
		console.log("⏭️ Moving to next question from:", currentQuestionIndex);
		const nextIndex = currentQuestionIndex + 1;
		setCurrentQuestionIndex(nextIndex);

		// Update current question index in database
		try {
			console.log("💾 Updating question index in database...");
			const { error } = await supabase
				.from("user_self_exploration_quests")
				.update({ current_question_index: nextIndex })
				.eq("self_exploration_quest_id", questId)
				.eq("user_id", userId);

			if (error) {
				console.error("❌ Error updating question index:", error);
			} else {
				console.log("✅ Question index updated to:", nextIndex);
			}
		} catch (error) {
			console.error("💥 Exception updating question index:", error);
		}
	};

	const handlePreviousQuestion = async () => {
		console.log("⬅️ Moving to previous question from:", currentQuestionIndex);
		const prevIndex = Math.max(0, currentQuestionIndex - 1);
		setCurrentQuestionIndex(prevIndex);

		// Update current question index in database
		try {
			console.log("💾 Updating question index in database...");
			const { error } = await supabase
				.from("user_self_exploration_quests")
				.update({ current_question_index: prevIndex })
				.eq("self_exploration_quest_id", questId)
				.eq("user_id", userId);

			if (error) {
				console.error("❌ Error updating question index:", error);
			}
		} catch (error) {
			console.error("💥 Exception updating question index:", error);
		}
	};

	const completeQuest = async (userId: string | null, customPrompt?: string) => {
		console.log("🚀 Starting quest completion process:", {
			questId,
			responsesCount: Object.keys(responses).length,
			responses: responses,
			customPrompt: customPrompt ? "Present" : "None",
		});

		setIsCompletingQuest(true);

		if (!userId) {
			console.error("❌ No user ID provided");
			throw new Error("No user ID provided");
		}

		try {
			console.log("✅ Valid user session found:", { userId });

			// First, mark the quest as completed and wait for the AI response
			console.log("📝 Marking quest as completed in database...");
			const { error: updateError } = await supabase
				.from("user_self_exploration_quests")
				.update({
					state: "COMPLETED",
					completed_at: new Date().toISOString(),
					progress: 100,
				})
				.eq("self_exploration_quest_id", questId)
				.eq("user_id", userId);

			if (updateError) {
				console.error("❌ Error updating quest status:", updateError);
				throw updateError;
			}
			console.log("✅ Quest marked as completed successfully");

			// Generate the AI report and wait for completion
			console.log("🤖 Calling generate-self-exploration-report function...");
			console.log("📤 Request payload:", {
				questId,
				userId,
				responses,
				customPrompt,
				payloadSize: JSON.stringify({ questId, userId, responses, customPrompt }).length,
			});

			const startTime = Date.now();

			const { data: reportData, error: reportError } = await supabase.functions.invoke(
				"generate-self-exploration-report",
				{
					body: {
						questId,
						userId,
						responses,
						customPrompt,
					},
				}
			);

			const endTime = Date.now();
			console.log(`⏱️ Edge function call completed in ${endTime - startTime}ms`);

			if (reportError) {
				console.error("❌ Error generating report:", reportError);
				console.error("🔍 Report error details:", {
					message: reportError.message,
					status: reportError?.status,
					details: reportError?.details,
					stack: reportError?.stack,
				});
				throw reportError;
			}

			console.log("✅ Report generated successfully:", {
				hasData: !!reportData,
				dataKeys: reportData ? Object.keys(reportData) : [],
				success: reportData?.success,
				aiResponseLength: reportData?.aiResponse?.length,
			});

			if (!reportData?.success) {
				console.error("❌ Report generation failed:", reportData);
				throw new Error(reportData?.error || "Failed to generate report");
			}

			console.log("🎉 Quest completion process finished successfully");

			// Return success to indicate completion
			return { success: true };
		} catch (error) {
			console.error("💥 Error in quest completion:", error);
			console.error("🔍 Error details:", {
				name: error?.name,
				message: error?.message,
				stack: error?.stack,
				cause: error?.cause,
			});
			throw error;
		} finally {
			console.log("🏁 Quest completion process finished, setting isCompletingQuest to false");
			setIsCompletingQuest(false);
		}
	};

	return {
		currentQuestionIndex,
		responses,
		handleAnswerQuestion,
		handleNextQuestion,
		handlePreviousQuestion,
		completeQuest,
		isCompletingQuest,
	};
};
