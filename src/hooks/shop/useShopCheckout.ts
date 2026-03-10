import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook for shop checkout functionality
 *
 * @returns Shop checkout functions and state
 */
export function useShopCheckout() {
	const [isProcessing, setIsProcessing] = useState<boolean>(false);

	const initiateCheckout = async (itemId: string) => {
		setIsProcessing(true);

		try {
			// Call our edge function to create a checkout session
			const { data, error } = await supabase.functions.invoke("create-shop-checkout", {
				body: { storeItemId: itemId },
			});

			if (error) throw new Error(error.message);
			if (!data?.url) throw new Error("No checkout URL received");

			// Open Stripe checkout in a new tab
			window.open(data.url, "_blank");

			return { success: true, sessionId: data.session_id };
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Checkout failed";
			console.error("Checkout error:", errorMessage);
			toast.error(errorMessage);
			return { success: false };
		} finally {
			setIsProcessing(false);
		}
	};

	const completeTransaction = async (sessionId: string) => {
		try {
			setIsProcessing(true);

			// Update: Changed from shop_transactions to store_orders
			const { data, error } = await supabase
				.from("store_orders")
				.select("*")
				.eq("stripe_session_id", sessionId)
				.single();

			if (error) {
				console.error("Error fetching transaction:", error);
				return { success: false, error: error.message };
			}

			if (data.status === "completed") {
				return { success: true, data };
			}

			// Call the edge function to complete the transaction
			const { data: completionData, error: completionError } =
				await supabase.functions.invoke("complete-shop-transaction", {
					body: { session_id: sessionId },
				});

			if (completionError) {
				console.error("Error completing transaction:", completionError);
				return { success: false, error: completionError.message };
			}

			return { success: true, data: completionData };
		} catch (err) {
			console.error("Unexpected error in completeTransaction:", err);
			return { success: false, error: "An unexpected error occurred" };
		} finally {
			setIsProcessing(false);
		}
	};

	return {
		initiateCheckout,
		completeTransaction,
		isProcessing,
	};
}
