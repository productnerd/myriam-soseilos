import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for managing admin access
 *
 * @param userId - The ID of the authenticated user
 * @param isAdmin - Whether the user is an admin
 * @returns Admin access state
 */
export const useAdminAccess = (userId: string, isAdmin: boolean) => {
	useEffect(() => {
		if (userId && isAdmin) {
			const logAdminAction = async () => {
				try {
					const { error } = await supabase
						.from("admin_audit_logs")
						.insert({
							admin_id: userId,
							action_type: "VIEW_ADMIN_DASHBOARD",
							entity_type: "ADMIN",
							details: "Viewed admin dashboard",
						})
						.select();

					if (error) {
						console.error("Error logging admin dashboard access:", error);
					}
				} catch (err) {
					console.error("Error logging admin dashboard access:", err);
				}
			};

			logAdminAction();
		}
	}, [userId, isAdmin]);
};
