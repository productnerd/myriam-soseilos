import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageTransition from "@/components/ui/PageTransition";
import { useTestActivity } from "@/hooks/test/useTestActivity";
import TestContent from "@/components/test/TestContent";
import { checkExistingTestScore } from "@/utils/test/checkExistingTestScore";
import { useInitialTestCompletion } from "@/hooks/test/useInitialTestCompletion";
import { toast } from "sonner";
import { Button } from "@/components/ui/interactive/Button";

const TestPage = () => {
	const { testId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const returnUrl = queryParams.get("returnUrl") || "/learn";
	const courseIdFromQuery = queryParams.get("courseId");
	const isLevelTestParam = queryParams.get("isLevelTest");
	const isLevelTest = isLevelTestParam === "true";
	const [courseId, setCourseId] = useState<string>(courseIdFromQuery || "");
	const [isTestReady, setIsTestReady] = useState(false);

	console.debug("TestPage - Rendered with testId:", testId, "isLevelTest:", isLevelTest);

	// TODO: This should go inside a hook
	// Fetch test details to get course ID if not provided in query params
	const {
		data: testInfo,
		isLoading: testInfoLoading,
		error: testInfoError,
	} = useQuery({
		queryKey: ["testInfo", testId],
		queryFn: async () => {
			if (!testId) return null;

			console.debug("Fetching test info for test ID:", testId);
			try {
				const { data, error } = await supabase
					.from("tests")
					.select("*, courses(color)")
					.eq("id", testId)
					.single();

				if (error) {
					console.error("Error fetching test info:", error);
					throw error;
				}

				console.debug("Test info found:", data);
				return data;
			} catch (err) {
				console.error("Exception in test info fetch:", err);
				throw new Error(
					`Error loading test: ${err instanceof Error ? err.message : "Unknown error"}`
				);
			}
		},
		enabled: !!testId && !courseIdFromQuery,
		retry: 2,
		retryDelay: 1000,
	});

	// Test completion logic - modified to handle level tests differently
	const { isNavigating, hasCompletedTest, handleTestComplete, createInitialScoreRecord } =
		useInitialTestCompletion(courseId, (initialTestCompleted, skipped) => {
			// For level tests, redirect to learn page to trigger progression logic
			// For initial tests, redirect to course page
			if (isLevelTest) {
				navigate("/learn");
			} else {
				navigate(returnUrl);
			}
		});

	useEffect(() => {
		if (testInfoError) {
			toast.error(
				`Error loading test: ${
					testInfoError instanceof Error ? testInfoError.message : "Unknown error"
				}`
			);
			console.error("Test info error:", testInfoError);
		}
	}, [testInfoError]);

	// Set course ID once test info is loaded
	useEffect(() => {
		if (courseIdFromQuery) {
			console.debug("Using courseId from query param:", courseIdFromQuery);
			setCourseId(courseIdFromQuery);
			setIsTestReady(true);
		} else if (testInfo) {
			console.debug("Using courseId from test info:", testInfo.course_id);
			setCourseId(testInfo.course_id);
			setIsTestReady(true);
		}
	}, [testInfo, courseIdFromQuery]);

	// Check if user has already completed this test
	useEffect(() => {
		const checkAndRedirect = async () => {
			if (!testId) return;

			try {
				const hasCompleted = await checkExistingTestScore(testId);

				if (hasCompleted) {
					console.debug("User already completed this test, redirecting to learn page");
					navigate(returnUrl);
				}
			} catch (error) {
				console.error("Error checking existing test score:", error);
				toast.error("Error checking test status");
			}
		};

		checkAndRedirect();
	}, [testId, navigate, returnUrl]);

	// Create initial NULL score record when starting the test - only for initial tests
	useEffect(() => {
		if (testId && courseId && isTestReady && !hasCompletedTest && !isLevelTest) {
			createInitialScoreRecord().catch((err) => {
				console.error("Failed to create initial score record:", err);
			});
		}
	}, [testId, courseId, isTestReady, hasCompletedTest, createInitialScoreRecord, isLevelTest]);

	// TODO: Wrong params
	// Use test activity hook to manage the test state
	const testActivityState = useTestActivity(
		testId || "",
		courseId,
		isTestReady, // Only enable when we've verified the user_progress record
		handleTestComplete,
		isLevelTest
	);

	console.debug("Test activities:", testActivityState.testActivities);

	// Handle skip test explicitly
	const handleSkipTest = () => {
		console.debug("Skip test button clicked");
		testActivityState.handleSkipTest();
	};

	if (testInfoError) {
		return (
			<PageTransition>
				<div className="container pb-24 mx-auto">
					<div className="max-w-4xl mx-auto pt-4 px-4">
						<div className="flex justify-center items-center h-[70vh]">
							<div className="text-center">
								<div className="p-4 border border-destructive rounded-md bg-destructive/10 mb-4">
									<p className="text-destructive">
										Error loading test:{" "}
										{testInfoError instanceof Error
											? testInfoError.message
											: "Unknown error"}
									</p>
								</div>
								<Button onClick={() => navigate("/learn")} className="mt-4">
									Return to Learn
								</Button>
							</div>
						</div>
					</div>
				</div>
			</PageTransition>
		);
	}

	if (!isTestReady || !courseId || testInfoLoading) {
		return (
			<PageTransition>
				<div className="container pb-24 mx-auto">
					<div className="max-w-4xl mx-auto pt-4 px-4">
						<div className="flex justify-center items-center h-[70vh]">
							<div className="text-center">
								<div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
								<p className="text-lg text-muted-foreground">Loading test...</p>
							</div>
						</div>
					</div>
				</div>
			</PageTransition>
		);
	}

	return (
		<PageTransition>
			<div className="container pb-24 mx-auto">
				<div className="max-w-4xl mx-auto pt-4 px-4">
					<TestContent
						testActivities={testActivityState.testActivities}
						isLoading={testActivityState.isLoading || testInfoLoading}
						error={testActivityState.error || testInfoError}
						currentActivityIndex={testActivityState.currentActivityIndex}
						selectedAnswer={testActivityState.selectedAnswer}
						showFeedback={testActivityState.showFeedback}
						isCorrect={testActivityState.isCorrect}
						testCompleted={testActivityState.testCompleted}
						finalScore={testActivityState.finalScore}
						handleAnswerSelect={testActivityState.handleAnswerSelect}
						handleNextActivity={testActivityState.handleNextActivity}
						handleSkipTest={handleSkipTest}
						handleContinue={testActivityState.handleContinue}
						onClose={() => navigate("/learn")}
						testId={testId || ""}
						isLevelTest={isLevelTest}
						hideQuestionCounter={!isLevelTest}
						autoAdvanceDelay={isLevelTest ? 1000 : 3000}
						handleTimeout={testActivityState.handleTimeout}
						onRetryTest={testActivityState.resetState}
					/>
				</div>
			</div>
		</PageTransition>
	);
};

export default TestPage;
