import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/Card";
import { Button } from "@/components/ui/interactive/Button";
import { Progress } from "@/components/ui/data/Progress";
import { ChevronRight, AlertCircle } from "lucide-react";
import {
	SelfExplorationQuest,
	SelfExplorationQuestion,
	UserSelfExplorationQuest,
} from "@/types/self-exploration";
import { useSelfExplorationQuestFlow } from "@/hooks/quests/useSelfExplorationQuestFlow";
import { useUserContext } from "@/contexts/UserContext";

interface SelfExplorationFlowProps {
	quest: SelfExplorationQuest;
	userQuest: UserSelfExplorationQuest;
	onComplete: () => void;
	onClose: () => void;
}

const SelfExplorationFlow: React.FC<SelfExplorationFlowProps> = ({
	quest,
	userQuest,
	onComplete,
	onClose,
}) => {
	const { user } = useUserContext();
	const [completionError, setCompletionError] = useState<string | null>(null);

	console.log("[SelfExplorationFlow] 🔄 SelfExplorationFlow rendering with:", {
		questId: quest.id,
		questTitle: quest.title,
		hasQuestions: !!quest.questions,
		questionsLength: quest.questions?.length || 0,
		questions: quest.questions,
		questionsType: typeof quest.questions,
		currentQuestionIndex: userQuest.current_question_index,
	});

	// Ensure questions is always an array
	const questions = Array.isArray(quest.questions) ? quest.questions : [];
	console.log("[SelfExplorationFlow] 📋 SelfExplorationFlow processed questions:", {
		questionsArray: questions,
		questionsCount: questions.length,
		isArray: Array.isArray(questions),
	});

	if (questions.length === 0) {
		console.error("[SelfExplorationFlow] ❌ No questions found for quest:", {
			questId: quest.id,
			questTitle: quest.title,
			originalQuestions: quest.questions,
			questionsType: typeof quest.questions,
			questionsLength: quest.questions?.length,
		});

		return (
			<Card className="w-full max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle>Quest Error</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<p>This quest has no questions configured. Please contact support.</p>
						<div className="bg-gray-100 p-2 rounded text-xs">
							<p>Debug Info:</p>
							<p>Quest ID: {quest.id}</p>
							<p>Quest Title: {quest.title}</p>
							<p>Questions Type: {typeof quest.questions}</p>
							<p>Questions Length: {quest.questions?.length || 0}</p>
							<p>Questions Array: {Array.isArray(quest.questions) ? "Yes" : "No"}</p>
							<p>Raw Questions: {JSON.stringify(quest.questions)}</p>
						</div>
						<Button onClick={onClose} className="mt-4">
							Close
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Get the self-exploration quest flow
	const {
		currentQuestionIndex,
		responses,
		handleAnswerQuestion,
		handleNextQuestion,
		handlePreviousQuestion,
		completeQuest,
		isCompletingQuest,
	} = useSelfExplorationQuestFlow(quest.id, user!.id, userQuest.current_question_index);

	const currentQuestion = questions[currentQuestionIndex];
	const isLastQuestion = currentQuestionIndex === questions.length - 1;
	const currentAnswer = responses[currentQuestionIndex];

	// Progress should only increment when questions are answered, not when loaded
	const answeredQuestionsCount = Object.keys(responses).filter((key) => {
		const index = parseInt(key);
		return (
			index <= currentQuestionIndex && responses[index] && responses[index].trim().length > 0
		);
	}).length;

	const progress = questions.length > 0 ? (answeredQuestionsCount / questions.length) * 100 : 0;

	const handleAnswer = async (answer: string) => {
		console.log("📝 Flow - Handling answer:", {
			answer,
			currentQuestionIndex,
		});
		await handleAnswerQuestion(answer, currentQuestion, currentQuestionIndex);
	};

	const handleNext = async () => {
		console.log("⏭️ Flow - Handle next clicked:", {
			isLastQuestion,
			currentQuestionIndex,
			questId: quest.id,
		});

		setCompletionError(null);

		if (isLastQuestion) {
			console.log("🏁 Flow - Starting quest completion process...");
			console.log("📊 Flow - Quest completion data:", {
				questId: quest.id,
				questTitle: quest.title,
				responsesCount: Object.keys(responses).length,
				responses: responses,
				customPrompt: quest.custom_prompt,
				hasCustomPrompt: !!quest.custom_prompt,
			});

			try {
				console.log("🚀 Flow - Calling completeQuest function...");
				const result = await completeQuest(user?.id || null, quest.custom_prompt);
				console.log("✅ Flow - Quest completed successfully:", result);

				// Only call onComplete when the AI response is ready
				if (result?.success) {
					console.log("🎯 Flow - AI response ready, navigating to results");
					onComplete();
				}
			} catch (error) {
				console.error("❌ Flow - Error completing quest:", error);
				console.error("🔍 Flow - Error details:", {
					name: error?.name,
					message: error?.message,
					stack: error?.stack,
					cause: error?.cause,
				});
				setCompletionError(error?.message || "Failed to complete quest. Please try again.");
			}
		} else {
			console.log("➡️ Flow - Moving to next question...");
			await handleNextQuestion();
		}
	};

	const handlePrevious = async () => {
		console.log("⬅️ Flow - Handle previous clicked:", {
			currentQuestionIndex,
		});
		if (currentQuestionIndex > 0) {
			await handlePreviousQuestion();
		}
	};

	const canProceed = currentAnswer && currentAnswer.trim().length > 0;

	console.log("🎯 Flow - Current state:", {
		currentQuestionIndex,
		isLastQuestion,
		canProceed,
		isCompletingQuest,
		completionError,
		currentAnswer: currentAnswer ? "Present" : "None",
	});

	if (!currentQuestion) {
		console.log("🏁 Flow - No current question - quest should be complete");
		return (
			<Card className="w-full max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle>Quest Complete!</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Thank you for completing the quest. Your results are being generated...</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="w-full max-w-2xl mx-auto">
			{/* Header with Progress Bar */}
			<div className="flex items-center justify-center mb-6">
				<div className="flex-1">
					<Progress value={progress} className="h-2" />
				</div>
			</div>

			{/* Question Card */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg font-medium">
						{currentQuestion.question}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Render appropriate answer component based on question type */}
					{currentQuestion.type === "MULTIPLE_CHOICE" && currentQuestion.options && (
						<div className="space-y-2">
							{currentQuestion.options.map((option, index) => (
								<Button
									key={index}
									variant={currentAnswer === option ? "default" : "outline"}
									className="w-full justify-start text-left"
									onClick={() => handleAnswer(option)}
								>
									{option}
								</Button>
							))}
						</div>
					)}

					{currentQuestion.type === "TEXT_POLL" && (
						<div className="space-y-2">
							<textarea
								className="w-full p-3 border rounded-md resize-none bg-gray-100 text-gray-900"
								rows={4}
								placeholder="Type your answer here..."
								value={currentAnswer || ""}
								onChange={(e) => handleAnswer(e.target.value)}
							/>
						</div>
					)}

					{/* Error message */}
					{completionError && (
						<div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
							<AlertCircle className="h-4 w-4" />
							<span className="text-sm">{completionError}</span>
						</div>
					)}

					{/* Completion status */}
					{isCompletingQuest && (
						<div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700">
							<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
							<span className="text-sm">Generating your personalized results...</span>
						</div>
					)}

					{/* Navigation */}
					<div className="flex justify-between pt-4">
						<Button
							variant="outline"
							onClick={handlePrevious}
							disabled={currentQuestionIndex === 0}
						>
							Previous
						</Button>

						<Button onClick={handleNext} disabled={!canProceed || isCompletingQuest}>
							{isCompletingQuest ? (
								"Generating Results..."
							) : isLastQuestion ? (
								<>
									Complete Quest
									<ChevronRight className="h-4 w-4 ml-1" />
								</>
							) : (
								<>
									Next
									<ChevronRight className="h-4 w-4 ml-1" />
								</>
							)}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default SelfExplorationFlow;
