import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/types/user";

export function useSharingSettings(profile: UserProfile | null) {
	const handleSharingToggle = async (type: "poll_sharing" | "score_sharing", value: boolean) => {
		try {
			if (!profile) return;

			const updateData =
				type === "poll_sharing" ? { poll_sharing: value } : { score_sharing: value };

			const { error } = await supabase
				.from("profiles")
				.update(updateData)
				.eq("id", profile.id);

			if (error) throw error;

			toast.success(
				`${type === "poll_sharing" ? "Poll answers" : "Test scores"} sharing ${
					value ? "enabled" : "disabled"
				}`
			);
		} catch (error: any) {
			console.error(`Error updating ${type}:`, error);
			toast.error(error.message || `Failed to update ${type} setting.`);
		}
	};

	return { handleSharingToggle };
}
