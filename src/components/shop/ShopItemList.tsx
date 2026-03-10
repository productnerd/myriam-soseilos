import React, { useMemo, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ShopItemCard from "./ShopItemCard";
import { StoreItem } from "@/types/shop";
import EmptyState from "../test/EmptyState";
import LoadingState from "../loading/LoadingState";
import ErrorState from "../test/ErrorState";

interface StoreItemListProps {
	filterStatus?: "all" | "available" | "coming_soon";
}

// Memoize individual shop items
const MemoizedShopItemCard = memo(ShopItemCard);

const StoreItemList: React.FC<StoreItemListProps> = ({ filterStatus = "all" }) => {
	const {
		data: storeItems,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["store_items", filterStatus],
		queryFn: async () => {
			let query = supabase.from("store_items").select("*").eq("ishidden", false);

			// Only apply filter if not showing 'all' items
			if (filterStatus === "available") {
				query = query.eq("state", "AVAILABLE");
			} else if (filterStatus === "coming_soon") {
				query = query.eq("state", "COMING_SOON");
			}
			// When filterStatus is 'all', we don't add any additional filter

			const { data, error } = await query;
			if (error) throw error;

			// Map the database column names to our frontend model
			// Add explicit type annotation to ensure TypeScript recognizes all fields
			const items = data.map((item) => {
				return {
					id: item.id,
					name: item.name,
					description: item.description,
					story: item.story || null, // Include story field from database
					state: item.state,
					isHidden: item.ishidden,
					images: item.images,
					grey_to_unlock: item.grey_to_unlock,
					dark_price: item.dark_price,
					usd_price: item.usd_price,
					purchase_limit: item.purchase_limit,
					created_at: item.created_at,
					release_date: item.release_date,
					stripe_product_id: item.stripe_product_id,
				} as StoreItem;
			});

			// Sort items based on status priority
			return items.sort((a, b) => {
				const statusOrder = {
					AVAILABLE: 0,
					COMING_SOON: 1,
					SOLD_OUT: 2,
				};
				return (statusOrder[a.state] || 3) - (statusOrder[b.state] || 3);
			});
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
		refetchOnWindowFocus: false,
	});

	// Memoize the rendered item grid
	const itemGrid = useMemo(() => {
		if (!storeItems) return null;

		return (
			<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{storeItems.map((item) => (
					<MemoizedShopItemCard key={item.id} item={item} />
				))}
			</div>
		);
	}, [storeItems]);

	if (isLoading) {
		return <LoadingState message="Loading store items..." />;
	}

	if (error) {
		return (
			<ErrorState
				message={`Error loading store items: ${(error as Error).message}`}
				onClose={() => window.location.reload()}
			/>
		);
	}

	if (!storeItems || storeItems.length === 0) {
		return <EmptyState message="No store items available" onSkip={() => {}} />;
	}

	return <>{itemGrid}</>;
};

export default memo(StoreItemList);
