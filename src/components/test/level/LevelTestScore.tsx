import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserContext } from "@/contexts/UserContext";
import { Badge } from "@/components/ui/data/Badge";

interface LevelTestScoreProps {
	levelId: string;
	processedColor: string;
	isLevelCompleted?: boolean;
	isLoading?: boolean;
	showAlways?: boolean;
}

const LevelTestScore: React.FC<LevelTestScoreProps> = ({
	levelId,
	processedColor,
	isLevelCompleted = false,
	isLoading = false,
	showAlways = false,
}) => {
	const { user } = useUserContext();

	const { data: testScore, isLoading: isLoadingScore } = useQuery({
		queryKey: ["levelTestScore", levelId, user!.id],
		queryFn: async () => {
			// Get the test for this level
			const { data: test } = await supabase
				.from("tests")
				.select("id")
				.eq("level_id", levelId)
				.eq("test_type", "level")
				.maybeSingle();

			if (!test) return null;

			// Get all user test scores and find the highest one
			const { data: userTestScores } = await supabase
				.from("user_test_scores")
				.select("score, passed")
				.eq("user_id", user!.id)
				.eq("test_id", test.id)
				.order("score", { ascending: false });

			if (!userTestScores || userTestScores.length === 0) return null;

			// Return the highest score
			const highestScore = userTestScores[0];
			return highestScore;
		},
		enabled: !!user!.id, // Only run when user is authenticated
	});

	// Don't show anything if we're loading
	if (isLoading || isLoadingScore) {
		return null;
	}

	// Only show if there's an actual test score (user has attempted the test)
	if (!testScore) {
		return null;
	}

	// Show the actual score
	const score = testScore.score || 0;
	const passed = score >= 80;

	return (
		<Badge
			variant="outline"
			className="flex items-center gap-1 px-2 py-1 text-xs"
			style={{
				backgroundColor: passed ? "#dcfce7" : "#fef2f2",
				borderColor: passed ? "#16a34a" : "#dc2626",
				color: passed ? "#16a34a" : "#dc2626",
			}}
		>
			{score}%
		</Badge>
	);
};

export default LevelTestScore;
