import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserContext } from "@/contexts/UserContext";
import LevelTestScore from "@/components/test/level/LevelTestScore";
import { Lock, Check } from "lucide-react";

interface LevelHeaderProps {
	title: string;
	levelId: string;
	processedColor: string;
	isLevelCompleted?: boolean;
	isCheckingCompletion?: boolean;
	isLevelLocked?: boolean;
	orderNumber?: number;
}

const LevelHeader: React.FC<LevelHeaderProps> = ({
	title,
	levelId,
	processedColor,
	isLevelCompleted = false,
	isCheckingCompletion = false,
	isLevelLocked = false,
	orderNumber,
}) => {
	const { user } = useUserContext();

	// Check if level test has been passed
	const { data: isLevelTestPassed } = useQuery({
		queryKey: ["levelTestPassed", levelId, user!.id],
		queryFn: async () => {
			// Get the test for this level
			const { data: test } = await supabase
				.from("tests")
				.select("id")
				.eq("level_id", levelId)
				.eq("test_type", "level")
				.maybeSingle();

			if (!test) return false;

			// Get the user's test scores
			const { data: userTestScores } = await supabase
				.from("user_test_scores")
				.select("score, passed")
				.eq("user_id", user!.id)
				.eq("test_id", test.id)
				.order("completed_at", { ascending: false });

			if (!userTestScores || userTestScores.length === 0) return false;

			const latestScore = userTestScores[0];
			return (
				latestScore.passed === true ||
				(latestScore.score !== null && latestScore.score >= 80)
			);
		},
		enabled: !!user!.id, // Only run when user is authenticated
	});

	// Background style based on completion status
	const bgStyle = isLevelCompleted
		? {
				background: `${processedColor}10`,
		  }
		: {};

	// Text color for locked levels
	const textColorClass = isLevelLocked ? "text-muted-foreground" : "";

	// Format title - "Level X" format
	const displayTitle = `Level ${orderNumber}`;

	return (
		<div className="p-4 flex flex-col space-y-3" style={bgStyle}>
			{/* Level test score in the top right */}
			<div className="flex justify-between items-center">
				<h1
					className={`font-bold uppercase tracking-wide flex items-center gap-2 ${textColorClass}`}
				>
					{isLevelLocked && <Lock className="h-4 w-4" />}
					{!isLevelLocked && isLevelTestPassed && (
						<Check className="h-4 w-4 text-green-500" />
					)}
					{displayTitle}
				</h1>

				{/* Always show the level test score component */}
				<LevelTestScore
					levelId={levelId}
					processedColor={processedColor}
					isLevelCompleted={isLevelCompleted}
					isLoading={isCheckingCompletion}
					showAlways={true}
				/>
			</div>
		</div>
	);
};

export default LevelHeader;
