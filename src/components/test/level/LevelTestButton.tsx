import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserContext } from "@/contexts/UserContext";
import { Button } from "@/components/ui/interactive/Button";
import { Play, RotateCcw } from "lucide-react";

interface LevelTestButtonProps {
	levelId: string;
	isLevelCompleted: boolean;
	processedColor: string;
	onStartTest: (testId: string) => void;
	className?: string;
}

const LevelTestButton: React.FC<LevelTestButtonProps> = ({
	levelId,
	isLevelCompleted,
	processedColor,
	onStartTest,
	className = "",
}) => {
	const { user } = useUserContext();

	// TODO: This should go inside a hook
	const { data: testData, isLoading } = useQuery({
		queryKey: ["levelTest", levelId, user!.id],
		queryFn: async () => {
			// Get the test for this level
			const { data: test } = await supabase
				.from("tests")
				.select("id, title")
				.eq("level_id", levelId)
				.eq("test_type", "level")
				.maybeSingle();

			if (!test) return null;

			// Get the user's test attempts
			const { data: userTestScores } = await supabase
				.from("user_test_scores")
				.select("score, passed")
				.eq("user_id", user!.id)
				.eq("test_id", test.id)
				.order("completed_at", { ascending: false });

			const hasAttempts = userTestScores && userTestScores.length > 0;
			const latestScore = userTestScores?.[0];
			const hasPassed =
				latestScore &&
				(latestScore.passed || (latestScore.score !== null && latestScore.score >= 80));

			return {
				testId: test.id,
				testTitle: test.title,
				hasAttempts,
				hasPassed,
				latestScore: latestScore?.score || 0,
			};
		},
		enabled: !!user!.id, // Only run when user is authenticated
	});

	// Don't show if no test exists or still loading
	if (isLoading || !testData) {
		return null;
	}

	// Show button if:
	// 1. Level is completed (all topics done) AND
	// 2. Test has NOT been passed (score < 80)
	const shouldShowButton = isLevelCompleted && !testData.hasPassed;

	if (!shouldShowButton) {
		return null;
	}

	// Determine button text and icon based on attempt history
	const buttonText = testData.hasAttempts ? "Retake Test" : "Take Test";
	const ButtonIcon = testData.hasAttempts ? RotateCcw : Play;

	return (
		<Button
			onClick={() => onStartTest(testData.testId)}
			className={`w-full ${className} text-white font-medium transition-all duration-200`}
			style={{
				backgroundColor: processedColor,
			}}
		>
			<ButtonIcon className="h-4 w-4 mr-2" />
			{buttonText}
		</Button>
	);
};

export default LevelTestButton;
