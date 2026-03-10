import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook for broadcasting messages to users
 *
 * @param userId - The ID of the authenticated admin user
 * @returns Message broadcast functions and state
 */
export function useMessageBroadcast(userId: string) {
	const [title, setTitle] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const [tag, setTag] = useState<string>("Announcement"); // Ensure this is a non-empty string
	const [minGreyPoints, setMinGreyPoints] = useState<string>("");
	const [minDarkPoints, setMinDarkPoints] = useState<string>("");
	const [minStreak, setMinStreak] = useState<string>("");
	const [country, setCountry] = useState<string>("");
	const [recipientCount, setRecipientCount] = useState<number | null>(null);
	const [isSending, setIsSending] = useState<boolean>(false);
	const [isCalculating, setIsCalculating] = useState<boolean>(false);

	const handleCalculateRecipients = async () => {
		if (!title || !message) {
			toast.error("Please provide a title and message");
			return;
		}

		setIsCalculating(true);
		try {
			// Parse the numeric filters or set to null if empty
			const parsedMinGrey = minGreyPoints ? parseInt(minGreyPoints, 10) : null;
			const parsedMinDark = minDarkPoints ? parseInt(minDarkPoints, 10) : null;
			const parsedMinStreak = minStreak ? parseInt(minStreak, 10) : null;
			const countryFilter = country || null;

			// Count potential recipients using RPC function
			const { data, error } = await supabase.rpc("count_message_recipients", {
				p_min_grey: parsedMinGrey,
				p_min_dark: parsedMinDark,
				p_min_streak: parsedMinStreak,
				p_country: countryFilter,
			});

			if (error) {
				throw error;
			}

			setRecipientCount(data);
		} catch (error) {
			console.error("Error calculating recipients:", error);
			toast.error("Failed to calculate recipients");
		} finally {
			setIsCalculating(false);
		}
	};

	const handleSendMessage = async () => {
		if (!title || !message) {
			toast.error("Please provide a title and message");
			return;
		}

		if (recipientCount === 0) {
			toast.error("No recipients match your criteria");
			return;
		}

		setIsSending(true);
		try {
			// Parse the numeric filters or set to null if empty
			const parsedMinGrey = minGreyPoints ? parseInt(minGreyPoints, 10) : null;
			const parsedMinDark = minDarkPoints ? parseInt(minDarkPoints, 10) : null;
			const parsedMinStreak = minStreak ? parseInt(minStreak, 10) : null;
			const countryFilter = country || null;

			// Send message using RPC function
			const { data, error } = await supabase.rpc("send_filtered_message", {
				p_title: title,
				p_payload: message,
				p_tag: tag,
				p_min_grey: parsedMinGrey,
				p_min_dark: parsedMinDark,
				p_min_streak: parsedMinStreak,
				p_country: countryFilter,
			});

			if (error) {
				throw error;
			}

			// Log the action in admin_audit_logs
			const actionDetails = `Sent message "${title}" to ${data} recipients. Filters: ${
				parsedMinGrey ? `Min grey: ${parsedMinGrey}` : ""
			}${parsedMinDark ? `, Min dark: ${parsedMinDark}` : ""}${
				parsedMinStreak ? `, Min streak: ${parsedMinStreak}` : ""
			}${countryFilter ? `, Country: ${countryFilter}` : ""}`;

			const { error: logError } = await supabase
				.from("admin_audit_logs")
				.insert({
					admin_id: userId,
					action_type: "SEND_MESSAGE",
					entity_type: "USER_MESSAGE",
					details: actionDetails,
				})
				.select();

			if (logError) {
				console.error("Error logging message send action:", logError);
			}

			toast.success(`Message sent to ${data} recipients`);

			// Reset form after successful send
			setTitle("");
			setMessage("");
			setTag("Announcement");
			setMinGreyPoints("");
			setMinDarkPoints("");
			setMinStreak("");
			setCountry("");
			setRecipientCount(null);
		} catch (error) {
			console.error("Error sending message:", error);
			toast.error("Failed to send message");
		} finally {
			setIsSending(false);
		}
	};

	return {
		title,
		setTitle,
		message,
		setMessage,
		tag,
		setTag,
		minGreyPoints,
		setMinGreyPoints,
		minDarkPoints,
		setMinDarkPoints,
		minStreak,
		setMinStreak,
		country,
		setCountry,
		recipientCount,
		isSending,
		isCalculating,
		handleCalculateRecipients,
		handleSendMessage,
	};
}
