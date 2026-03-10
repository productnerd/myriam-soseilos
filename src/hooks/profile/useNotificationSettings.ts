import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/types/user";

export function useNotificationSettings(profile: UserProfile | null) {
	const handleNotificationToggle = async (
		type: "email_alerts" | "push_notifications",
		value: boolean
	): Promise<void> => {
		try {
			if (!profile) return;

			const updateData =
				type === "email_alerts" ? { email_alerts: value } : { push_notifications: value };

			const { error } = await supabase
				.from("profiles")
				.update(updateData)
				.eq("id", profile.id);

			if (error) throw error;

			// Instead of returning an object, we just return void
			// This matches the expected type in ProfilePage and ProfileContainer
		} catch (error: any) {
			console.error(`Error updating ${type} notification setting:`, error);
			toast.error(error.message || `Failed to update ${type} notification setting.`);
			throw error;
		}
	};

	return { handleNotificationToggle };
}
