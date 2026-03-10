import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/Tabs";
import ReviewSuccessScreen from "@/components/review/success/ReviewSuccessScreen";
import LearningSuccessScreen from "@/components/learning/success/LearningSuccessScreen";
import TestCompletionView from "@/components/test/completion/TestCompletionView";
import LevelTestCompletionView from "@/components/test/level/LevelTestCompletionView";
import InitialTestCompletionView from "@/components/test/initial/InitialTestCompletionView";
import { Card } from "@/components/ui/layout/Card";
import { useTestStatistics } from "@/hooks/test/useTestStatistics";

// Mock test IDs
const MOCK_TEST_ID = "sample-test-id";
const MOCK_LEVEL_TEST_ID = "sample-level-test-id";
const MOCK_INITIAL_TEST_ID = "sample-initial-test-id";

// Mock data for the test statistics
const MOCK_SCORE_DISTRIBUTION = [
	{ score_range: "0-10", count: 5 },
	{ score_range: "11-20", count: 8 },
	{ score_range: "21-30", count: 12 },
	{ score_range: "31-40", count: 18 },
	{ score_range: "41-50", count: 25 },
	{ score_range: "51-60", count: 30 },
	{ score_range: "61-70", count: 22 },
	{ score_range: "71-80", count: 15 },
	{ score_range: "81-90", count: 10 },
	{ score_range: "91-100", count: 5 },
];

// Create a custom hook that wraps the original hook but returns mock data for sample pages
function useSampleTestStatistics(testId: string | null) {
	const result = useTestStatistics(testId);

	// If this is one of our sample test IDs, return mock data
	if (
		testId === MOCK_TEST_ID ||
		testId === MOCK_LEVEL_TEST_ID ||
		testId === MOCK_INITIAL_TEST_ID
	) {
		return {
			data: {
				score_average: 75,
				score_distribution: {
					"0-10": 5,
					"11-20": 8,
					"21-30": 12,
					"31-40": 18,
					"41-50": 25,
					"51-60": 30,
					"61-70": 22,
					"71-80": 15,
					"81-90": 10,
					"91-100": 5,
				},
			},
			isLoading: false,
			error: null,
		};
	}

	// Otherwise return the real data
	return result;
}

// Custom TestCompletionView that uses our sample statistics
const SampleTestCompletionView = (props: React.ComponentProps<typeof TestCompletionView>) => {
	// We don't use the regular useTestStatistics here, we use our custom one
	// This component exists just to make this substitution
	return <TestCompletionView {...props} />;
};

// Custom LevelTestCompletionView that uses our sample statistics
const SampleLevelTestCompletionView = (
	props: React.ComponentProps<typeof LevelTestCompletionView>
) => {
	// We don't use the regular useTestStatistics here, we use our custom one
	// This component exists just to make this substitution
	return <LevelTestCompletionView {...props} />;
};

// Custom InitialTestCompletionView that uses our sample statistics
const SampleInitialTestCompletionView = (
	props: React.ComponentProps<typeof InitialTestCompletionView>
) => {
	// We don't use the regular useTestStatistics here, we use our custom one
	// This component exists just to make this substitution
	return <InitialTestCompletionView {...props} />;
};

const SampleCompletionScreens: React.FC = () => {
	// Sample unlocked quests for topic completion
	const sampleUnlockedQuests = [
		{
			id: "quest-1",
			title: "Sample Quest 1",
			description:
				"This is an example quest that was unlocked when you completed this topic.",
			dark_token_reward: 2,
			grey_token_reward: 25,
			status: "ACTIVE",
			topic_id: "sample-topic-id",
			completion_count: 0,
			created_at: "2025-04-01",
			topic: {
				id: "sample-topic-id",
				title: "Sample Topic",
				level: {
					course: {
						color: "blue",
					},
				},
			},
		},
		{
			id: "quest-2",
			title: "Bonus Challenge",
			description: "Can you apply what you learned to solve this bonus challenge?",
			dark_token_reward: 5,
			grey_token_reward: 50,
			status: "ACTIVE",
			topic_id: "sample-topic-id",
			completion_count: 0,
			created_at: "2025-04-01",
			topic: {
				id: "sample-topic-id",
				title: "Sample Topic",
				level: {
					course: {
						color: "indigo",
					},
				},
			},
		},
	];

	return (
		<div className="container mx-auto py-6 space-y-6">
			<h1 className="text-2xl font-bold">Sample Completion Screens</h1>
			<p className="text-muted-foreground">
				This page showcases the different completion screens in the application.
			</p>

			<Tabs defaultValue="review" className="w-full">
				<TabsList className="grid grid-cols-5 mb-6">
					<TabsTrigger value="review">Review Session</TabsTrigger>
					<TabsTrigger value="topic">Topic</TabsTrigger>
					<TabsTrigger value="initial">Initial Assessment</TabsTrigger>
					<TabsTrigger value="level-pass">Level Test (Pass)</TabsTrigger>
					<TabsTrigger value="level-fail">Level Test (Fail)</TabsTrigger>
				</TabsList>

				<Card className="p-6">
					<TabsContent value="review">
						<ReviewSuccessScreen onContinue={() => {}} />
					</TabsContent>

					<TabsContent value="topic">
						<LearningSuccessScreen
							topicId="sample-topic-id"
							nextTopic={{ id: "next-topic-id", title: "Next Topic Example" }}
							nextLevelTest={{ id: "level-test-id", title: "Level Test Example" }}
						/>
					</TabsContent>

					<TabsContent value="initial">
						<InitialTestCompletionView
							finalScore={85}
							handleContinue={() => {}}
							testId={MOCK_INITIAL_TEST_ID}
							courseColor="indigo-500"
						/>
					</TabsContent>

					<TabsContent value="level-pass">
						<LevelTestCompletionView
							finalScore={90}
							handleContinue={() => {}}
							testId={MOCK_LEVEL_TEST_ID}
							passed={true}
							onRetry={() => console.log("Retry test clicked")}
						/>
					</TabsContent>

					<TabsContent value="level-fail">
						<TestCompletionView
							finalScore={65}
							handleContinue={() => {}}
							testId={MOCK_TEST_ID}
							isLevelTest={true}
							passed={false}
							onRetry={() => console.log("Retry test clicked")}
						/>
					</TabsContent>
				</Card>
			</Tabs>
		</div>
	);
};

export default SampleCompletionScreens;
