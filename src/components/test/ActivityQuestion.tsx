import React from "react";
import { Activity } from "@/types/activity";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ActivityQuestionProps {
	activity: Activity;
	currentIndex: number;
	totalCount: number;
	hideCounter?: boolean;
}

const ActivityQuestion: React.FC<ActivityQuestionProps> = ({
	activity,
	currentIndex,
	totalCount,
	hideCounter = false,
}) => {
	// Fetch author name if author_id exists
	const { data: authorData } = useQuery({
		queryKey: ["author", activity.author_id],
		queryFn: async () => {
			if (!activity.author_id) return null;

			const { data, error } = await supabase
				.from("profiles")
				.select("name")
				.eq("id", activity.author_id)
				.maybeSingle();

			if (error) {
				console.error("Error fetching author:", error);
				return null;
			}

			return data;
		},
		enabled: !!activity.author_id,
		staleTime: 300000, // 5 minutes
	});

	// Set safe HTML
	const questionHtml = { __html: activity.main_text };

	return (
		<div className="relative">
			{!hideCounter && (
				<div className="text-sm text-muted-foreground mb-2">
					Question {currentIndex + 1} of {totalCount}
				</div>
			)}

			<div className="text-lg font-medium mb-4" dangerouslySetInnerHTML={questionHtml} />

			{/* Author attribution - only show if author exists */}
			{authorData?.name && (
				<div className="absolute bottom-0 right-0 text-xs text-amber-800/60 mt-2">
					by {authorData.name}
				</div>
			)}
		</div>
	);
};

export default ActivityQuestion;
