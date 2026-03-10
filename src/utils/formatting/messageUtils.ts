
import { supabase } from "@/integrations/supabase/client";

export async function getUnreadMessageCount(userId: string): Promise<number> {
	try {
		const { data, error } = await supabase
			.from("user_messages")
			.select("id", { count: "exact" })
			.eq("user_id", userId)
			.eq("is_read", false);

		if (error) {
			console.error("Error fetching unread message count:", error);
			return 0;
		}

		return data?.length || 0;
	} catch (error) {
		console.error("Error in getUnreadMessageCount:", error);
		return 0;
	}
}

export async function markMessageAsRead(messageId: string): Promise<void> {
	try {
		const { error } = await supabase
			.from("user_messages")
			.update({ 
				is_read: true, 
				read_at: new Date().toISOString() 
			})
			.eq("id", messageId);

		if (error) {
			console.error("Error marking message as read:", error);
		}
	} catch (error) {
		console.error("Error in markMessageAsRead:", error);
	}
}

export async function markAllMessagesAsRead(userId: string): Promise<void> {
	try {
		const { error } = await supabase
			.from("user_messages")
			.update({ 
				is_read: true, 
				read_at: new Date().toISOString() 
			})
			.eq("user_id", userId)
			.eq("is_read", false);

		if (error) {
			console.error("Error marking all messages as read:", error);
		}
	} catch (error) {
		console.error("Error in markAllMessagesAsRead:", error);
	}
}

export function formatMessageDate(date: string | Date): string {
	const messageDate = new Date(date);
	const now = new Date();
	const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));
	
	if (diffInMinutes < 60) {
		return `${diffInMinutes}m ago`;
	}
	
	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return `${diffInHours}h ago`;
	}
	
	const diffInDays = Math.floor(diffInHours / 24);
	return `${diffInDays}d ago`;
}
