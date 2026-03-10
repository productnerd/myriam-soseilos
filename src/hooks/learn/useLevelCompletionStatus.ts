import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

// Memory cache for level completion to avoid unnecessary queries
const levelCompletionCache = new Map<string, Record<string, boolean>>();

/**
 * Hook to track level completion status for a course
 */
export function useLevelCompletionStatus(selectedCourseId: string, userId: string, levels?: any[]) {
	const [levelCompletionMap, setLevelCompletionMap] = useState<Record<string, boolean>>({});

	// Create cache key for this user and course
	const cacheKey = useMemo(() => {
		return userId && selectedCourseId ? `${userId}_${selectedCourseId}` : null;
	}, [userId, selectedCourseId]);

	// Fetch level completion status for all levels
	useEffect(() => {
		if (!levels || levels.length === 0) return;

		// Check cache first
		if (cacheKey && levelCompletionCache.has(cacheKey)) {
			console.log("[useLevelCompletionStatus] Using cached level completion data");
			setLevelCompletionMap(levelCompletionCache.get(cacheKey)!);
			return;
		}

		const fetchLevelCompletionStatus = async () => {
			try {
				const completionMap: Record<string, boolean> = {};

				// Fetch all level tests for this course in one query
				const { data: levelTests, error: levelTestsError } = await supabase
					.from("tests")
					.select("id, level_id")
					.eq("test_type", "level")
					.in(
						"level_id",
						levels.map((level) => level.id)
					);

				if (levelTestsError) {
					console.error("[useLevelCompletionStatus] Error fetching level tests:", levelTestsError);
					return;
				}

				// Group tests by level ID
				const testsByLevel: Record<string, string[]> = {};
				levelTests?.forEach((test) => {
					if (!testsByLevel[test.level_id]) {
						testsByLevel[test.level_id] = [];
					}
					testsByLevel[test.level_id].push(test.id);
				});

				// Fetch all test scores for this user
				const allTestIds = levelTests?.map((test) => test.id) || [];
				if (allTestIds.length > 0) {
					const { data: allTestScores, error: scoresError } = await supabase
						.from("user_test_scores")
						.select("test_id, score, passed")
						.eq("user_id", userId)
						.in("test_id", allTestIds);

					if (scoresError) {
						console.error("[useLevelCompletionStatus] Error fetching test scores:", scoresError);
					}

					// Create a set for faster lookups - check both passed flag AND score >= 80
					const passedTestIds = new Set(
						allTestScores
							?.filter(
								(score) =>
									score.passed === true ||
									(score.score !== null && score.score >= 80)
							)
							.map((score) => score.test_id) || []
					);

					// For each level, check if any of its tests have been passed
					for (const level of levels) {
						const testIds = testsByLevel[level.id] || [];

						if (testIds.length === 0) {
							// If no tests exist for this level, consider it passed
							completionMap[level.id] = true;
						} else {
							// Check if any test for this level has been passed
							completionMap[level.id] = testIds.some((testId) =>
								passedTestIds.has(testId)
							);
						}
					}
				} else {
					// No tests exist, all levels are considered passed
					for (const level of levels) {
						completionMap[level.id] = true;
					}
				}

				// First level is always unlocked/accessible (even if test not passed)
				if (levels.length > 0) {
					completionMap[levels[0].id] = true;
				}

				setLevelCompletionMap(completionMap);

				// Cache the result
				if (cacheKey) {
					levelCompletionCache.set(cacheKey, completionMap);
				}
			} catch (error) {
				console.error("[useLevelCompletionStatus] Error checking level completion status:", error);
			}
		};

		fetchLevelCompletionStatus();
	}, [userId, levels, cacheKey]);

	return { levelCompletionMap };
}
