import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserFeedback } from "@/types/user";
import { formatDistanceToNow } from "date-fns";

export const useUserFeedback = () => {
	const {
		data: feedback = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["admin-user-feedback"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("user_feedback")
				.select(
					`
          *,
          user_id
        `
				)
				.order("created_at", { ascending: false });

			if (error) {
				toast.error(`Error fetching feedback: ${error.message}`);
				throw error;
			}

			const feedbackWithUsers = await Promise.all(
				(data || []).map(async (item) => {
					const { data: userData, error: userError } = await supabase
						.from("profiles")
						.select("name, email, flag, tags, grey_points, dark_points")
						.eq("id", item.user_id)
						.single();

					let user = null;

					if (userError) {
						console.error(`Error fetching user ${item.user_id}:`, userError);
						user = { error: true, name: "Unknown User" };
					} else {
						user = userData;
					}

					const formattedDate = formatDistanceToNow(new Date(item.created_at), {
						addSuffix: true,
					});

					return {
						...item,
						user,
						formattedDate,
					} as UserFeedback;
				})
			);

			return feedbackWithUsers;
		},
	});

	return {
		feedback,
		isLoading,
		error,
	};
};
