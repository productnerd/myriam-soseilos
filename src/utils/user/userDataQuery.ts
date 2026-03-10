import { supabase } from "@/integrations/supabase/client";
import { UserDataWithError } from "@/types/user";

// Get user data with error handling
export async function getUserData(userId: string): Promise<UserDataWithError> {
	try {
		const { data: userData, error: userError } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", userId)
			.single();

		if (userError) throw userError;

		return {
			id: userData.id,
			name: userData.name,
			email: userData.email,
			thumbnail: userData.thumbnail,
			grey_points: userData.grey_points,
			dark_points: userData.dark_points,
			flag: userData.flag,
			tags: userData.tags || [],
		};
	} catch (error) {
		console.error("Error fetching user data:", error);
		return {
			id: userId,
			name: "Unknown User",
			email: null,
			thumbnail: null,
			grey_points: 0,
			dark_points: 0,
			flag: null,
			tags: [],
			error: true,
		};
	}
}
