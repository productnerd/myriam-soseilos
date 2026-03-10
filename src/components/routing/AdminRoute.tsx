import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import { supabase } from "@/integrations/supabase/client";
import LoadingState from "@/components/loading/LoadingState";

interface AdminRouteProps {
	children: React.ReactNode;
}

/**
 * AdminRoute: Handles admin privileges validation for authenticated users
 *
 * Responsibilities:
 * - Assumes user is already authenticated (`ProtectedRoute` handles auth check)
 * - Checks if user has admin privileges ('isAdmin' flag or admin role)
 * - Logs admin access to audit logs
 * - Redirects to learn page if user is not admin
 */
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
	const { user } = useAuth(); // User is guaranteed to exist since ProtectedRoute handles auth
	const location = useLocation();
	const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
	const [checkingAdmin, setCheckingAdmin] = useState(true);

	useEffect(() => {
		const checkAdminStatus = async () => {
			// Note: During the initial render, user might still be null while authentication is being determined
			// The 'useEffect' runs before authentication is fully established so we need to do a safe null check
			if (!user?.id) return;

			try {
				// First check if user has isAdmin flag
				if (user.isAdmin) {
					setIsAdmin(true);
					setCheckingAdmin(false);

					// Log admin access
					await supabase.from("admin_audit_logs").insert({
						admin_id: user.id,
						action_type: "ADMIN_ACCESS",
						entity_type: "ADMIN_ROUTE",
						details: `Admin accessed route: ${location.pathname}`,
						ip_address: "client-side",
					});
					return;
				}

				// Fallback: check 'user_roles' table
				const { data, error } = await supabase
					.from("user_roles")
					.select("role")
					.eq("user_id", user.id)
					.eq("role", "admin")
					.maybeSingle();

				if (error) {
					console.error("Error checking admin status:", error);
					setIsAdmin(false);
				} else {
					const hasAdminRole = !!data;
					setIsAdmin(hasAdminRole);

					if (hasAdminRole) {
						// Log admin access
						await supabase.from("admin_audit_logs").insert({
							admin_id: user.id,
							action_type: "ADMIN_ACCESS",
							entity_type: "ADMIN_ROUTE",
							details: `Admin accessed route: ${location.pathname}`,
							ip_address: "client-side",
						});
					}
				}
			} catch (error) {
				console.error("Error checking admin status:", error);
				setIsAdmin(false);
			} finally {
				setCheckingAdmin(false);
			}
		};

		checkAdminStatus();
	}, [user, location.pathname]);

	if (checkingAdmin) {
		return <LoadingState message="Checking admin privileges..." />;
	}

	if (!isAdmin) {
		console.log("User is not admin, redirecting to learn page");
		return <Navigate to="/learn" replace />;
	}

	return <>{children}</>;
};

export default AdminRoute;
