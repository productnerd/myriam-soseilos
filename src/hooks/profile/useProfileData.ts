import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/user";

/**
 * Hook for fetching user profile data
 *
 * @param userId - The ID of the user to fetch profile data for
 * @returns An object containing profile data and functions to refresh the data
 */
export function useProfileData(userId: string | null) {
	const {
		data: profile,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["profile", userId],
		queryFn: async (): Promise<UserProfile | null> => {
			if (!userId) return null;

			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.single();

			if (error) {
				console.error("Error fetching profile:", error);
				throw error;
			}

			// Type assertion to ensure proper typing
			return data as UserProfile;
		},
		enabled: !!userId, // Only run when user is authenticated
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
	});

	return {
		profile,
		isLoading,
		error,
		refetch,
	};
}
