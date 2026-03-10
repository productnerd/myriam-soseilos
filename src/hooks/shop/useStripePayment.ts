import { useState } from "react";
import { useToast } from "@/hooks/ui/useToast";
import { createClient } from "@supabase/supabase-js";

// Get Supabase URL and anon key from environment variables
const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL || "",
	import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

interface UseStripePaymentOptions {
	onSuccess?: () => void;
	onError?: (error: string) => void;
}

export function useStripePayment(options?: UseStripePaymentOptions) {
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const initiatePayment = async (productId: string) => {
		setIsLoading(true);

		try {
			const { data, error } = await supabase.functions.invoke("create-payment", {
				body: { productId },
			});

			if (error) throw new Error(error.message);
			if (!data?.url) throw new Error("No checkout URL received from Stripe");

			// Redirect to Stripe Checkout
			window.location.href = data.url;
			options?.onSuccess?.();
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Payment initiation failed";
			console.error("Stripe payment error:", errorMessage);

			toast({
				variant: "destructive",
				title: "Payment Error",
				description: errorMessage,
			});

			options?.onError?.(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		initiatePayment,
		isLoading,
	};
}
