import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/layout/Card";
import { Button } from "@/components/ui/interactive/Button";
import { GraduationCap, User, Clock } from "lucide-react";
import ScoreDistributionChart from "@/components/test/completion/ScoreDistributionChart";
import { useTestStatistics } from "@/hooks/test/useTestStatistics";
import { useNavigate } from "react-router-dom";

interface CourseAssessmentProps {
	isLoadingTest: boolean;
	onStartTest: () => void;
	testId: string | null;
	courseId: string | null;
	onSkipTest?: () => void;
}

const CourseAssessment: React.FC<CourseAssessmentProps> = ({
	isLoadingTest,
	onStartTest,
	testId,
	courseId,
	onSkipTest,
}) => {
	const navigate = useNavigate();

	const { data: testStats } = useTestStatistics(testId);

	const handleStartAssessment = () => {
		if (testId) {
			navigate(`/initial-test/${testId}/${courseId}?returnUrl=/learn`);
		} else {
			onStartTest();
		}
	};

	if (isLoadingTest) {
		return (
			<div className="flex justify-center my-8">
				<span className="animate-spin">⏳</span>
			</div>
		);
	}

	return (
		<Card className="w-full max-w-2xl mx-auto my-8">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<GraduationCap className="h-6 w-6 text-primary" />
					Skill Level Evaluation
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="mt-4 space-y-2">
					<div className="flex items-start gap-2">
						<span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center mt-0.5">
							✓
						</span>
						<p className="text-sm">Keep track of your before-after</p>
					</div>
					<div className="flex items-start gap-2">
						<User className="w-5 h-5 text-primary mt-0.5" />
						<p className="text-sm">See how you compare to the rest</p>
					</div>
					<div className="flex items-start gap-2">
						<Clock className="w-5 h-5 text-primary mt-0.5" />
						<p className="text-sm">5-8 minutes</p>
					</div>
				</div>

				{testId && (
					<div className="mt-6 w-full">
						{testStats?.score_average && (
							<h1 className="text-4xl font-bold text-center mb-4">
								{Math.round(testStats.score_average)}%
							</h1>
						)}
						<ScoreDistributionChart testId={testId} finalScore={0} animated={false} />
					</div>
				)}
			</CardContent>
			<CardFooter className="flex flex-col items-center space-y-3">
				<Button
					variant="default"
					size="lg"
					onClick={handleStartAssessment}
					disabled={!testId || isLoadingTest}
					className="w-full max-w-xs"
				>
					Start
				</Button>

				{onSkipTest && (
					<button
						onClick={onSkipTest}
						className="text-sm text-muted-foreground hover:text-primary underline"
					>
						Skip
					</button>
				)}
			</CardFooter>
		</Card>
	);
};

export default CourseAssessment;
