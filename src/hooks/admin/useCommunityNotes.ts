import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ActivityRating } from "@/types/activity";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

export const useCommunityNotes = () => {
	return useQuery<ActivityRating[]>({
		queryKey: ["admin-community-notes"],
		queryFn: async () => {
			try {
				console.log("Fetching community notes...");

				// First, get all community notes
				const { data: notesData, error: notesError } = await supabase
					.from("community_notes")
					.select(
						`
            id,
            user_id,
            activity_id,
            is_positive,
            comment,
            created_at,
            status
          `
					)
					.order("created_at", { ascending: false }); // Sort by latest notes first

				if (notesError) {
					console.error("Error fetching community notes:", notesError);
					toast.error("Failed to load community notes");
					throw notesError;
				}

				console.log("Raw community notes data:", notesData);

				// No notes found
				if (!notesData || notesData.length === 0) {
					return [];
				}

				// Process each note to get additional data
				const processedNotes = await Promise.all(
					notesData.map(async (note) => {
						// Get user data for each note
						const { data: userData, error: userError } = await supabase
							.from("profiles")
							.select(
								`
                id,
                name,
                email,
                grey_points,
                dark_points,
                tags,
                flag
              `
							)
							.eq("id", note.user_id)
							.maybeSingle();

						// Get activity data for each note
						const { data: activityData, error: activityError } = await supabase
							.from("activities")
							.select(
								`
                id,
                main_text,
                correct_answer,
                explanation,
                type,
                options,
                topic:topic_id (
                  id,
                  title,
                  level:level_id (
                    id,
                    title,
                    course:course_id (
                      id,
                      title,
                      color
                    )
                  )
                )
              `
							)
							.eq("id", note.activity_id)
							.maybeSingle();

						// Handle user data
						const userDetails =
							userError || !userData
								? {
										name: "Unknown user",
										email: "Unknown email",
										grey_points: 0,
										dark_points: 0,
										flag: null,
										tags: [],
										error: true,
								  }
								: {
										name: userData.name || "Unknown user",
										email: userData.email || "Unknown email",
										grey_points: userData.grey_points || 0,
										dark_points: userData.dark_points || 0,
										flag: userData.flag || null,
										tags: Array.isArray(userData.tags) ? userData.tags : [],
										error: false,
								  };

						const formattedDate = note.created_at
							? format(parseISO(note.created_at), "MMM d, yyyy")
							: "Unknown date";

						return {
							id: note.id,
							user_id: note.user_id,
							activity_id: note.activity_id,
							is_positive: note.is_positive,
							comment: note.comment || "",
							created_at: note.created_at || "",
							formattedDate: formattedDate,
							user: userDetails,
							activity: activityError ? null : activityData,
							status: note.status || "Open",
						} as ActivityRating;
					})
				);

				console.log("Processed community notes:", processedNotes);
				return processedNotes;
			} catch (error) {
				console.error("Error in useCommunityNotes hook:", error);
				toast.error("Failed to load community notes data");
				throw error;
			}
		},
		staleTime: 10 * 1000, // 10 seconds to refresh even more frequently for better UI updates
		refetchOnWindowFocus: true,
		refetchOnMount: true,
	});
};
