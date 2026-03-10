import { supabase } from "@/integrations/supabase/client";
import { useToast } from "../ui/useToast";

export function useEmojiHandling() {
	const { toast } = useToast();

	const handleEmojiSubmit = async (
		selectedEmoji: string | null,
		userId: string
	): Promise<boolean> => {
		try {
			await supabase
				.from("profiles")
				.update({ favorite_emoji: selectedEmoji })
				.eq("id", userId);

			return true;
		} catch (error) {
			console.error("Error updating emoji:", error);
			toast({
				title: "Error",
				description: "Failed to update your emoji. Please try again.",
				variant: "destructive",
			});
			return false;
		}
	};

	return {
		handleEmojiSubmit,
	};
}
