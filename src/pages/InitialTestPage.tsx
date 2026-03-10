import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageTransition from "@/components/ui/PageTransition";
import { useTestActivity } from "@/hooks/test/useTestActivity";
import InitialTestContent from "@/components/test/initial/InitialTestContent";
import { checkExistingTestScore } from "@/utils/test/checkExistingTestScore";
import { useInitialTestCompletion } from "@/hooks/test/useInitialTestCompletion";
import InitialTestLoading from "@/components/test/initial/InitialTestLoading";
import { toast } from "sonner";

const InitialTestPage = () => {
	// TODO: Add loading page when testId or courseId are undefined
	const { testId, courseId: courseIdFromQuery } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const returnUrl = queryParams.get("returnUrl") || "/learn";
	// TODO: Is this needed since we get the courseId from the URL params?
	// const courseIdFromQuery = queryParams.get('courseId');
	const [courseId, setCourseId] = useState<string>(courseIdFromQuery || "");
	const [refreshKey, setRefreshKey] = useState<number>(0);
	const [isTestReady, setIsTestReady] = useState(false);

	console.debug("InitialTestPage - Rendered with testId:", testId);

	// TODO: This should go inside a hook
	const { data: testInfo, isLoading: testInfoLoading } = useQuery({
		queryKey: ["testInfo", testId, refreshKey],
		queryFn: async () => {
			if (!testId) return null;

			console.debug("Fetching test info for test ID:", testId);
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
		},
		enabled: !!testId && !courseIdFromQuery,
	});

	const { isNavigating, hasCompletedTest, handleTestComplete, createInitialScoreRecord } =
		useInitialTestCompletion(courseId, (initialTestCompleted, skipped) => {
			navigate(returnUrl);
		});

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

	useEffect(() => {
		if (testId && courseId && isTestReady && !hasCompletedTest) {
			createInitialScoreRecord();
		}
	}, [testId, courseId, isTestReady, hasCompletedTest, createInitialScoreRecord]);

	// TODO: Wrong params
	const testActivityState = useTestActivity(
		testId,
		courseId,
		isTestReady, // Only enable when we've verified the user_progress record
		async (skipped) => {
			await createInitialScoreRecord(true, skipped);
			await handleTestComplete(skipped);
		},
		false // isLevelTest is false for initial tests
	);

	console.debug("Test activities:", testActivityState.testActivities);

	const handleSkipTest = () => {
		console.debug("Skip test button clicked");
		testActivityState.handleSkipTest();
	};

	if (isNavigating) {
		return <InitialTestLoading message="Updating your progress..." />;
	}

	if (!isTestReady || !courseId || testInfoLoading) {
		return <InitialTestLoading />;
	}

	return (
		<PageTransition key={`initial-test-page-${refreshKey}`}>
			<div className="container pb-24 mx-auto">
				<div className="max-w-4xl mx-auto pt-4 px-4">
					<InitialTestContent
						testActivities={testActivityState.testActivities}
						isLoading={testActivityState.isLoading || testInfoLoading}
						error={testActivityState.error}
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
						hideQuestionCounter={true}
						autoAdvanceDelay={3000}
						handleTimeout={testActivityState.handleTimeout}
						courseColor={testInfo?.courses?.color}
					/>
				</div>
			</div>
		</PageTransition>
	);
};

export default InitialTestPage;
