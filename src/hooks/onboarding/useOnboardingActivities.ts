import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Activity } from "@/types/activity";
import { normalizeExplanation } from "@/utils/activities/activityOperations";

export function useOnboardingActivities() {
	const [activities, setActivities] = useState<Activity[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchOnboardingActivities = async () => {
			try {
				setIsLoading(true);

				const { data, error } = await supabase
					.from("onboarding_activities")
					.select("*")
					.order("order_number", { ascending: true });

				if (error) {
					throw error;
				}

				// Transform data to match Activity type
				const formattedActivities = data.map((item) => {
					// Normalize the explanation to the new format
					const formattedExplanation = normalizeExplanation(item.explanation);

					return {
						id: item.id,
						main_text: item.main_text,
						type: item.type,
						options: Array.isArray(item.options) ? item.options : [],
						correct_answer: item.correct_answer,
						explanation: formattedExplanation,
						order_number: item.order_number,
					};
				}) as Activity[];

				setActivities(formattedActivities);
			} catch (err) {
				console.error("Error fetching onboarding activities:", err);
				setError(
					err instanceof Error ? err : new Error("Failed to fetch onboarding activities")
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchOnboardingActivities();
	}, []);

	return { activities, isLoading, error };
}
