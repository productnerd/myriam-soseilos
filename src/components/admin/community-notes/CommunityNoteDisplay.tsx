import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/layout/Card";
import { MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";

interface CommunityNoteDisplayProps {
	activityId: string;
}

// Define a type for the published note data structure
interface PublishedNote {
	id: string;
	comment: string;
	user_id: string;
	profiles?:
		| {
				name: string | null;
		  }
		| null
		| { error: true };
}

const CommunityNoteDisplay: React.FC<CommunityNoteDisplayProps> = ({ activityId }) => {
	const { data: publishedNote, isLoading } = useQuery({
		queryKey: ["published-community-note", activityId],
		queryFn: async () => {
			// Query community notes that are published for this activity
			const { data, error } = await supabase
				.from("community_notes")
				.select(
					`
          id,
          comment,
          user_id,
          profiles:user_id (
            name
          )
        `
				)
				.eq("activity_id", activityId)
				.eq("status", "Published")
				.order("created_at", { ascending: false })
				.limit(1)
				.maybeSingle();

			if (error) {
				console.error("Error fetching published community note:", error);
				return null;
			}

			return data as unknown as PublishedNote | null;
		},
		enabled: !!activityId,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	if (isLoading || !publishedNote || !publishedNote.comment) {
		return null;
	}

	return (
		<Card className="mt-4 bg-muted/30 border-dashed">
			<CardContent className="p-4">
				<div className="flex items-start gap-3">
					<MessageSquare size={18} className="text-primary mt-1" />
					<div>
						<p className="text-sm font-medium text-primary mb-1">Community Note</p>
						<p className="text-sm text-muted-foreground">{publishedNote.comment}</p>
						{publishedNote.profiles &&
							"name" in publishedNote.profiles &&
							publishedNote.profiles.name && (
								<div className="flex items-center mt-2 text-xs text-muted-foreground">
									<span>Added by </span>
									<span className="ml-1 font-medium">
										{publishedNote.profiles.name}
									</span>
								</div>
							)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default CommunityNoteDisplay;
