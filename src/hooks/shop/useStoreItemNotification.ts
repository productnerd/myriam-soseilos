import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { shouldShowToast } from "@/utils/ui/toastUtils";

/**
 * Hook for managing store item notifications
 *
 * @param itemId - The ID of the store item
 * @param userId - The ID of the authenticated user
 * @returns The notification subscription status and toggle function
 */
export function useStoreItemNotification(itemId: string, userId: string) {
	const queryClient = useQueryClient();
	const [isNotifying, setIsNotifying] = useState(false);

	// Check if this user has subscribed to notifications for this item
	const { data, isLoading } = useQuery({
		queryKey: ["store-item-notification", itemId, userId],
		queryFn: async () => {
			try {
				console.log("Checking notification status for user", userId, "and item", itemId);

				const { data, error } = await supabase
					.from("store_item_notifications")
					.select("id")
					.eq("user_id", userId)
					.eq("item_id", itemId)
					.maybeSingle();

				if (error) {
					console.error("Error checking notification status:", error);
					return null;
				}

				console.log("Notification status check result:", data);
				return data;
			} catch (err) {
				console.error("Exception in notification status check:", err);
				return null;
			}
		},
		enabled: !!userId && !!itemId, // Only run when itemId is provided and user is authenticated
	});

	// Create subscription mutation
	const createSubscription = useMutation({
		mutationFn: async () => {
			console.log("Creating notification subscription for user", userId, "and item", itemId);

			try {
				const { data, error } = await supabase
					.from("store_item_notifications")
					.insert({
						user_id: userId,
						item_id: itemId,
					})
					.select("id")
					.single();

				if (error) {
					console.error("Supabase insert error:", error);
					throw error;
				}

				console.log("Successfully created notification with ID:", data?.id);
				return data;
			} catch (err) {
				console.error("Exception during notification creation:", err);
				throw err;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["store-item-notification", itemId, userId],
			});
			if (shouldShowToast("notification-created")) {
				toast.success(
					"We will notify you when a release date is announced and when the product is out"
				);
			}
		},
		onError: (error) => {
			console.error("Error subscribing to notifications:", error);
			if (error instanceof Error) {
				toast.error(`Failed to subscribe: ${error.message}`);
			} else {
				toast.error("Failed to subscribe to notifications");
			}
		},
	});

	// Delete subscription mutation
	const deleteSubscription = useMutation({
		mutationFn: async (notificationId: string) => {
			console.log("Deleting notification with ID:", notificationId);

			try {
				const { error } = await supabase
					.from("store_item_notifications")
					.delete()
					.eq("id", notificationId);

				if (error) {
					console.error("Supabase delete error:", error);
					throw error;
				}

				return true;
			} catch (err) {
				console.error("Exception during notification deletion:", err);
				throw err;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["store-item-notification", itemId, userId],
			});
			toast.success("Notification canceled");
		},
		onError: (error) => {
			console.error("Error unsubscribing from notifications:", error);
			if (error instanceof Error) {
				toast.error(`Failed to unsubscribe: ${error.message}`);
			} else {
				toast.error("Failed to unsubscribe from notifications");
			}
		},
	});

	// Toggle notification function
	const toggleNotification = async () => {
		if (isNotifying) return;

		try {
			setIsNotifying(true);

			if (data?.id) {
				await deleteSubscription.mutateAsync(data.id);
			} else {
				await createSubscription.mutateAsync();
			}
		} finally {
			setIsNotifying(false);
		}
	};

	return {
		isSubscribed: !!data,
		isLoading,
		isNotifying,
		toggleNotification,
	};
}
