import { useToast } from "@/hooks/ui/useToast";
import { supabase } from "@/integrations/supabase/client";
import { generateAvatarFromName } from "@/utils/ui/avatarUtils";

export function useNameHandling(userId: string) {
	const { toast } = useToast();

	const handleNameInput = async (name: string) => {
		try {
			// Also generate an avatar based on the name
			const avatarUrl = generateAvatarFromName(name);

			await supabase
				.from("profiles")
				.update({
					name: name,
					thumbnail: avatarUrl,
				})
				.eq("id", userId);

			return true;
		} catch (error) {
			console.error("Error updating name:", error);
			toast({
				title: "Error",
				description: "Failed to update your name. Please try again.",
				variant: "destructive",
			});
			return false;
		}
	};

	return {
		handleNameInput,
	};
}
