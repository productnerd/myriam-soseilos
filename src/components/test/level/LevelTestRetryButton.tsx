// TODO: Remove this component entirely since we're using the existing orange button?

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";

interface LevelTestRetryButtonProps {
	levelId: string;
	processedColor: string;
	onRetryTest: (testId: string) => void;
}

const LevelTestRetryButton: React.FC<LevelTestRetryButtonProps> = ({
	levelId,
	processedColor,
	onRetryTest,
}) => {
	const { user } = useUserContext();

	const { data: testInfo, isLoading } = useQuery({
		queryKey: ["levelTestRetry", levelId, user!.id],
		queryFn: async () => {
			// Get the test for this level
			const { data: test } = await supabase
				.from("tests")
				.select("id, title")
				.eq("level_id", levelId)
				.eq("test_type", "level")
				.maybeSingle();

			if (!test) return null;

			// Get the user's latest test score
			const { data: userTestScore } = await supabase
				.from("user_test_scores")
				.select("score, passed")
				.eq("user_id", user!.id)
				.eq("test_id", test.id)
				.order("completed_at", { ascending: false })
				.limit(1)
				.maybeSingle();

			// Show retry button if test was attempted and failed (score < 80)
			const needsRetry =
				userTestScore && userTestScore.score !== null && userTestScore.score < 80;

			return {
				testId: test.id,
				testTitle: test.title,
				needsRetry: needsRetry,
				score: userTestScore?.score || 0,
				hasAttempted: !!userTestScore,
			};
		},
		enabled: !!user!.id, // Only run when user is authenticated
	});

	// Don't show button if loading, no test info, or test doesn't need retrying
	if (isLoading || !testInfo || !testInfo.needsRetry) {
		return null;
	}

	return null;
};

export default LevelTestRetryButton;
