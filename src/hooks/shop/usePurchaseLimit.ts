import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for checking purchase limits for store items
 *
 * @param itemId - The ID of the store item
 * @param purchaseLimit - The purchase limit for the store item
 * @param userId - The ID of the authenticated user
 * @returns The purchase count, whether the limit has been exceeded, and the remaining purchases
 */
export const usePurchaseLimit = (itemId: string, purchaseLimit: number | null, userId: string) => {
	const { data: purchaseCount = 0, isLoading } = useQuery({
		queryKey: ["purchase-count", itemId, userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("store_orders")
				.select("id", { count: "exact" })
				.eq("user_id", userId)
				.eq("store_item_id", itemId)
				.eq("status", "completed");

			if (error) {
				console.error("Error fetching purchase count:", error);
				return 0;
			}

			return data?.length || 0;
		},
		enabled: !!userId && purchaseLimit !== null, // Only run when userId is provided and purchase limit exists
		staleTime: 30 * 1000, // 30 seconds
	});

	const hasExceededLimit = purchaseLimit !== null && purchaseCount >= purchaseLimit;
	const remainingPurchases =
		purchaseLimit !== null ? Math.max(0, purchaseLimit - purchaseCount) : null;

	return {
		purchaseCount,
		hasExceededLimit,
		remainingPurchases,
		isLoading,
	};
};
