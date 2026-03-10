import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";
import { assignInvitePoints } from "@/utils/points/invitePointsAssignment";

interface UseAuthSubmissionProps {
	onSuccess?: (data: { user: User | null; session: Session | null }) => void;
	inviteCode?: string; // Kept as inviteCode for backward compatibility
}

export const useAuthSubmission = ({
	onSuccess,
	inviteCode: accessCode,
}: UseAuthSubmissionProps = {}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleLogin = async (email: string, password: string) => {
		try {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw error;

			if (onSuccess) {
				onSuccess(data);
			}

			// Don't show toast here since we're redirecting
		} catch (err: any) {
			console.error("Error during login:", err);
			setError(err.message || "Failed to log in");
			toast.error(err.message || "Failed to log in");
		} finally {
			setLoading(false);
		}
	};

	const handleSignup = async (email: string, password: string) => {
		try {
			setLoading(true);
			setError(null);

			// Attempt signup
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
			});

			if (error) throw error;

			if (data.user) {
				// If we have an access code, let's handle it right after signup
				if (accessCode) {
					try {
						// Get the access code record using the code from the invite link
						const { data: accessCodeData, error: accessCodeError } = await supabase
							.from("access_codes")
							.select("id, created_by, users_joined_counter")
							.eq("code", accessCode)
							.maybeSingle();

						if (!accessCodeError && accessCodeData) {
							// Update the user with access code info
							const { error: userUpdateError } = await supabase
								.from("profiles")
								.update({
									access_code: accessCodeData.id,
									invited_by: accessCodeData.created_by, // Set invited_by to the creator of the access code
									access_granted: true,
								})
								.eq("id", data.user.id);

							if (!userUpdateError) {
								// Increment the users joined counter
								await supabase
									.from("access_codes")
									.update({
										users_joined_counter:
											accessCodeData.users_joined_counter + 1,
									})
									.eq("id", accessCodeData.id);

								// Award points to both users
								await assignInvitePoints(accessCodeData.created_by, data.user.id);

								// Show only one success toast
								toast.success("You've been successfully invited!");

								if (onSuccess) {
									onSuccess(data);
								}

								return;
							}
						}
					} catch (inviteError) {
						console.error("Error processing invite during signup:", inviteError);
					}
				}
			}

			if (onSuccess) {
				onSuccess(data);
			}

			// Only show this if we didn't show the invite success message
			if (!accessCode) {
				toast.success("Account created successfully!");
			}
		} catch (err: any) {
			console.error("Error during signup:", err);
			setError(err.message || "Failed to sign up");
			toast.error(err.message || "Failed to sign up");
		} finally {
			setLoading(false);
		}
	};

	return {
		handleLogin,
		handleSignup,
		loading,
		error,
	};
};
