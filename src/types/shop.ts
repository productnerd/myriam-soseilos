// TODO: These are not used anywhere

export interface ShopItemTransaction {
	id: string;
	user_id: string;
	store_item_id: string;
	created_at: string;
	usd_amount: number;
	dark_points_spent: number;
	stripe_session_id: string;
	completed_at: string | null;
	status: "pending" | "completed" | "failed";
}

export interface StoreItem {
	id: string;
	name: string;
	description: string;
	images: string[];
	grey_to_unlock?: number;
	dark_price?: number;
	usd_price?: number;
	purchase_limit?: number | null;
	state: "AVAILABLE" | "COMING_SOON" | "SOLD_OUT";
	release_date?: string | null;
	story?: string;
	stripe_product_id?: string;
	ishidden?: boolean;
	created_at?: string; // Added created_at field
}

export interface UserInventoryItem {
	id: string;
	user_id: string;
	store_item_id: string;
	transaction_id: string;
	acquired_at: string;
}
