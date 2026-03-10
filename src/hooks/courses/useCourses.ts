import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/types/course";

// Hook that fetches all available courses that users can learn
export const useCourses = () => {
	return useQuery({
		queryKey: ["courses"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("courses")
				.select("*")
				.in("status", ["ACTIVE", "COMING_SOON"]) // 'ACTIVE' means the course is available for learning
				.order("created_at", { ascending: true });

			if (error) throw error;

			return data as Course[];
		},
	});
};
