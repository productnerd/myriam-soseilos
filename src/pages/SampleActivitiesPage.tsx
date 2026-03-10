import React from "react";
import PageTransition from "@/components/ui/PageTransition";
import { sampleActivities } from "@/utils/sample/sampleActivities2";
import { Activity } from "@/types/activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/Card";
import ActivityContainer from "@/components/activities/layout/ActivityContainer";
import { getExplanationForAnswer } from "@/utils/activities/activityOperations";
import { shouldActivityCountForStreakAndFocus } from "@/utils/activities/activityScoring";

const SampleActivitiesPage = () => {
	// State for tracking selected answers and feedback for each activity
	const [activityStates, setActivityStates] = React.useState<
		Record<
			string,
			{
				selectedAnswers: string[];
				showFeedback: boolean;
				isCorrect: boolean;
				aiValidationResult?: {
					isCorrect: boolean;
					confidence: number;
					reasoning?: string;
				} | null;
			}
		>
	>({});

	const handleAnswerSelect = (
		activityId: string,
		answers: string[],
		aiValidationResult?: {
			isCorrect: boolean;
			confidence: number;
			reasoning?: string;
		}
	) => {
		const activity = sampleActivities.find((a) => a.id === activityId);
		if (!activity) return;

		// For poll activities, there's no correct/incorrect concept
		const hasCorrectAnswer = shouldActivityCountForStreakAndFocus(activity);
		const isCorrect = aiValidationResult
			? aiValidationResult.isCorrect
			: hasCorrectAnswer
			? answers.join(",") === activity.correct_answer
			: true;

		setActivityStates((prev) => ({
			...prev,
			[activityId]: {
				selectedAnswers: answers,
				showFeedback: true,
				isCorrect,
				aiValidationResult,
			},
		}));
	};

	const getActivityState = (activityId: string) => {
		return (
			activityStates[activityId] || {
				selectedAnswers: [],
				showFeedback: false,
				isCorrect: false,
				aiValidationResult: null,
			}
		);
	};

	const renderLearningComponent = (activity: Activity, index: number) => {
		const [selectedAnswer, setSelectedAnswer] = React.useState("");
		const [showFeedback, setShowFeedback] = React.useState(false);
		const [isCorrect, setIsCorrect] = React.useState(false);

		const handleAnswerSelect = (answer: string) => {
			setSelectedAnswer(answer);
			setShowFeedback(true);
			setIsCorrect(answer === activity.correct_answer);
		};

		const handleAdvance = () => {
			setSelectedAnswer("");
			setShowFeedback(false);
			setIsCorrect(false);
		};

		return (
			<Card key={`learning-${activity.id}`} className="mb-8">
				<CardHeader>
					<CardTitle>Activity Type: {activity.type}</CardTitle>
				</CardHeader>
				<CardContent>
					<ActivityContainer
						activity={activity}
						currentActivityIndex={0}
						totalActivities={1}
						selectedAnswer={selectedAnswer}
						showFeedback={showFeedback}
						isCorrect={isCorrect}
						onAnswer={handleAnswerSelect}
						onAdvance={handleAdvance}
						explanation={activity.explanation ?? undefined}
						flowType="topic"
					/>
				</CardContent>
			</Card>
		);
	};

	return (
		<PageTransition>
			<div className="container mx-auto py-8 px-4">
				<h1 className="text-2xl font-bold mb-6">Sample Activities Components</h1>

				<div className="mb-10">
					<p className="text-muted-foreground mb-4">
						This page demonstrates all activity types using the same components used
						throughout the application. These components are used consistently in:
					</p>
					<ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
						<li>
							<strong>Topic Learning Flow:</strong> Uses LearningContainer component
							(what you see below)
						</li>
						<li>
							<strong>Review Flow:</strong> Uses LearningContainer component
							(identical to below)
						</li>
						<li>
							<strong>Initial Test Flow:</strong> Uses ActivityAnswers component with
							InitialActivityRenderer wrapper
						</li>
						<li>
							<strong>Level Test Flow:</strong> Uses ActivityAnswers component with
							LevelActivityRenderer wrapper
						</li>
					</ul>
					<p className="text-muted-foreground mt-4">
						The core question and answer components are the same across all flows. Only
						the presentation layer changes:
					</p>
					<ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
						<li>
							<strong>Countdown timers:</strong> Only in Level Tests
						</li>
						<li>
							<strong>Answer reveal:</strong> Varies by flow type
						</li>
						<li>
							<strong>Explanations:</strong> Always shown in Topic Learning/Review,
							optional in tests
						</li>
					</ul>
				</div>

				<div className="space-y-8">
					{sampleActivities.map((activity, index) =>
						renderLearningComponent(activity, index)
					)}
				</div>
			</div>
		</PageTransition>
	);
};

export default SampleActivitiesPage;
