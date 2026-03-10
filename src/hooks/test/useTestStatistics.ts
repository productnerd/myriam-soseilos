import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TestStatistics {
	id: string;
	title: string;
	score_average: number | null;
	score_distribution: Record<string, number> | null;
}

export function useTestStatistics(testId?: string | null) {
	return useQuery({
		queryKey: ["testStatistics", testId],
		queryFn: async (): Promise<TestStatistics | null> => {
			// Ensure testId is a valid string before proceeding
			if (!testId || typeof testId !== "string") {
				console.debug("useTestStatistics called without valid testId:", testId);
				return null;
			}

			console.debug("Fetching test statistics for:", testId);

			try {
				const { data, error } = await supabase
					.from("tests")
					.select("id, title, score_average, score_distribution")
					.eq("id", testId)
					.maybeSingle();

				if (error) {
					console.error("Error fetching test statistics:", error);
					throw error;
				}

				if (!data) {
					console.debug("No test data found for ID:", testId);
					return null;
				}

				console.debug("Raw test statistics data:", data);

				// Convert the JSONB score_distribution to proper Record<string, number>
				let distribution: Record<string, number> | null = null;

				if (data.score_distribution) {
					distribution = {};
					if (typeof data.score_distribution === "string") {
						try {
							distribution = JSON.parse(data.score_distribution);
						} catch (e) {
							console.error("Error parsing score_distribution string:", e);
						}
					} else if (typeof data.score_distribution === "object") {
						// Convert the object to Record<string, number>
						Object.keys(data.score_distribution).forEach((key) => {
							const value = data.score_distribution[key];
							if (typeof value === "number") {
								distribution![key] = value;
							}
						});
					}

					// If distribution is empty after processing, set to null
					if (distribution && Object.keys(distribution).length === 0) {
						distribution = null;
					}
				}

				return {
					id: data.id,
					title: data.title,
					score_average: data.score_average,
					score_distribution: distribution,
				};
			} catch (error) {
				console.error("Error in useTestStatistics:", error);
				return null; // Return null instead of throwing to prevent React errors
			}
		},
		enabled: !!testId && typeof testId === "string",
		refetchOnWindowFocus: false,
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: false, // Don't retry on failure to prevent React hook errors
	});
}

export function useAllTestStatistics() {
	return useQuery({
		queryKey: ["allTestStatistics"],
		queryFn: async (): Promise<TestStatistics[]> => {
			const { data, error } = await supabase
				.from("tests")
				.select("id, title, score_average, score_distribution")
				.order("created_at");

			if (error) {
				console.error("Error fetching all test statistics:", error);
				throw error;
			}

			// Convert each test's JSONB score_distribution to proper Record<string, number>
			return (data || []).map((test) => {
				let distribution: Record<string, number> | null = null;

				if (test.score_distribution) {
					distribution = {};
					if (typeof test.score_distribution === "string") {
						try {
							distribution = JSON.parse(test.score_distribution);
						} catch (e) {
							console.error("Error parsing score_distribution string:", e);
						}
					} else if (typeof test.score_distribution === "object") {
						// Convert the object to Record<string, number>
						Object.keys(test.score_distribution).forEach((key) => {
							const value = test.score_distribution[key];
							if (typeof value === "number") {
								distribution![key] = value;
							}
						});
					}

					// If distribution is empty after processing, set to null
					if (distribution && Object.keys(distribution).length === 0) {
						distribution = null;
					}
				}

				return {
					id: test.id,
					title: test.title,
					score_average: test.score_average, // No fallback
					score_distribution: distribution, // No fallback
				};
			});
		},
		refetchOnWindowFocus: false,
	});
}
