import { useProfileData } from "@/hooks/profile/useProfileData";
import { StoreItem } from "@/types/shop";

/**
 * Hook for checking if user has enough points to purchase a store item
 *
 * @param item - The store item to check points for
 * @param userId - The ID of the authenticated user
 * @returns Whether the user has enough points
 */
export function usePointsCheck(item: StoreItem, userId: string) {
	const { profile } = useProfileData(userId);

	if (!profile) {
		return {
			hasEnoughGreyPoints: false,
			hasEnoughDarkPoints: false,
		};
	}

	const userGreyPoints = profile.grey_points || 0;
	const userDarkPoints = profile.dark_points || 0;
	const greyPointsRequired = item.grey_to_unlock || 0;
	const darkPointsRequired = item.dark_price || 0;

	return {
		hasEnoughGreyPoints: userGreyPoints >= greyPointsRequired,
		hasEnoughDarkPoints: userDarkPoints >= darkPointsRequired,
	};
}
