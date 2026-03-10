import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserMessage } from "@/types/messages";

export const useUserMessages = () => {
	const queryClient = useQueryClient();
	const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

	// Fetch user messages
	const {
		data: messages = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["userMessages"],
		queryFn: async (): Promise<UserMessage[]> => {
			const { data, error } = await supabase
				.from("user_messages")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) throw error;

			// If no messages found, create a sample message
			if (!data || data.length === 0) {
				// Return a sample message for display purposes
				return [
					{
						id: "sample-1",
						title: "Welcome to Your Learning Journey!",
						payload:
							"We're excited to have you here! This is your inbox where you'll receive updates about new courses, quests, features, and important notifications.\n\nTry exploring the available courses and completing some topics to earn points!",
						tag: "Welcome",
						created_at: new Date().toISOString(),
						read_at: null,
						is_read: false,
						image_url: null,
					},
				];
			}

			return data || [];
		},
	});

	// Mark message as read
	const markAsReadMutation = useMutation({
		mutationFn: async (messageId: string) => {
			// If it's our sample message, just return it as read
			if (messageId === "sample-1") {
				return {
					id: "sample-1",
					is_read: true,
					read_at: new Date().toISOString(),
				};
			}

			const { data, error } = await supabase
				.from("user_messages")
				.update({
					is_read: true,
					read_at: new Date().toISOString(),
				})
				.eq("id", messageId)
				.select()
				.single();

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["userMessages"] });
		},
	});

	// Delete message
	const deleteMessageMutation = useMutation({
		mutationFn: async (messageId: string) => {
			// If it's our sample message, just return
			if (messageId === "sample-1") {
				return { id: "sample-1" };
			}

			const { data, error } = await supabase
				.from("user_messages")
				.delete()
				.eq("id", messageId)
				.select()
				.single();

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["userMessages"] });
		},
	});

	// Mark all messages as read
	const markAllAsReadMutation = useMutation({
		mutationFn: async () => {
			if (!messages?.length) return null;

			// If we have our sample message
			if (messages.length === 1 && messages[0].id === "sample-1") {
				return [
					{
						id: "sample-1",
						is_read: true,
						read_at: new Date().toISOString(),
					},
				];
			}

			const unreadMessages = messages.filter((msg) => !msg.is_read);
			if (!unreadMessages.length) return null;

			const { data, error } = await supabase
				.from("user_messages")
				.update({
					is_read: true,
					read_at: new Date().toISOString(),
				})
				.in(
					"id",
					unreadMessages.map((msg) => msg.id)
				)
				.select();

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["userMessages"] });
			// After marking all as read, update hasUnreadMessages to false
			setHasUnreadMessages(false);
		},
	});

	// Check for unread messages
	useEffect(() => {
		if (messages) {
			const unreadCount = messages.filter((msg) => !msg.is_read).length;
			setHasUnreadMessages(unreadCount > 0);
		}
	}, [messages]);

	// Simplify the API for component usage
	const markAsRead = (messageId: string) => markAsReadMutation.mutate(messageId);
	const deleteMessage = (messageId: string) => deleteMessageMutation.mutate(messageId);
	const markAllAsRead = () => {
		return new Promise<void>((resolve) => {
			markAllAsReadMutation.mutate(undefined, {
				onSuccess: () => {
					resolve();
				},
				onError: () => {
					resolve(); // Resolve even on error to prevent hanging promises
				},
			});
		});
	};

	return {
		messages: messages || [],
		isLoading,
		error,
		markAsRead,
		deleteMessage,
		markAllAsRead,
		hasUnreadMessages,
	};
};
