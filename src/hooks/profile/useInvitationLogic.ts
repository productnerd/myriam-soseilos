import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { assignInvitePoints } from "@/utils/points/invitePointsAssignment";

export function useInvitationLogic(accessCodeId: string | undefined) {
	const [inviterName, setInviterName] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchInviterProfile = async () => {
			try {
				setLoading(true);
				setError(null);

				if (!accessCodeId) {
					console.log("No access code ID provided");
					setLoading(false);
					return;
				}

				console.log("Fetching invite info for access code ID:", accessCodeId);

				// Try to get access code details first
				const { data: accessCodeData, error: accessCodeError } = await supabase
					.from("access_codes")
					.select("id, code, created_by, description")
					.eq("id", accessCodeId)
					.maybeSingle();

				if (accessCodeError) {
					console.error("Error fetching access code:", accessCodeError);
					setError("Invalid invite link");
					setLoading(false);
					return;
				}

				if (!accessCodeData) {
					console.error("Access code not found with ID:", accessCodeId);
					setError("Invalid invite link");
					setLoading(false);
					return;
				}

				console.log("Access code found:", accessCodeData);

				if (!accessCodeData.created_by) {
					console.log(
						"This appears to be a system-generated access code without a creator"
					);
					// Use description or a default name for system-generated codes
					const systemName = accessCodeData.description || "The team";
					setInviterName(systemName);
					setLoading(false);
					return;
				}

				// First try the invite_info view which should work with our RLS policy
				const { data: inviteInfo, error: inviteInfoError } = await supabase
					.from("invite_info")
					.select("*")
					.eq("access_code_id", accessCodeId)
					.maybeSingle();

				if (inviteInfoError) {
					console.error("Error fetching from invite_info view:", inviteInfoError);
				} else {
					console.log("Invite info response:", inviteInfo);
				}

				// If we got data from the invite_info view, use it
				if (inviteInfo && inviteInfo.inviter_name) {
					console.log("Invite info found via view:", inviteInfo);
					setInviterName(inviteInfo.inviter_name);
					setLoading(false);
					return;
				}

				// Try to fetch the profile directly using the creator ID
				console.log("Attempting to fetch profile with ID:", accessCodeData.created_by);

				// Get the creator's profile
				const { data: inviterData, error: inviterError } = await supabase
					.from("profiles")
					.select("id, name, email")
					.eq("id", accessCodeData.created_by)
					.maybeSingle();

				console.log("Profile fetch response:", { inviterData, inviterError });

				if (inviterError) {
					console.error("Error fetching inviter:", inviterError);
					// Don't set error, use fallback
				}

				// If we found a profile, use it
				if (inviterData && inviterData.name) {
					console.log("Inviter found:", inviterData);
					setInviterName(inviterData.name);
				} else {
					// Fallback if we can't find the inviter profile
					console.log("Using fallback inviter name");
					setInviterName(null);
					setError(null); // Clear any error since we'll use a generic welcome message
				}
			} catch (err) {
				console.error("Error in invite page:", err);
				setError("Something went wrong");
			} finally {
				setLoading(false);
			}
		};

		// Only fetch if we have an access code ID
		if (accessCodeId) {
			fetchInviterProfile();
		} else {
			setLoading(false);
			setInviterName(null);
		}
	}, [accessCodeId]);

	const handleAfterSignup = async (userId: string) => {
		if (!accessCodeId || !userId) {
			console.log("Missing data for invite processing:", { accessCodeId, userId });
			return;
		}

		try {
			console.log(
				"Processing invite signup for user:",
				userId,
				"with access code:",
				accessCodeId
			);

			// Get the access code record directly using the UUID
			const { data: accessCodeData, error: accessCodeError } = await supabase
				.from("access_codes")
				.select("id, created_by, users_joined_counter")
				.eq("id", accessCodeId)
				.maybeSingle();

			if (accessCodeError || !accessCodeData) {
				console.error("Error finding access code:", accessCodeError);
				return;
			}

			console.log("Access code found for signup:", accessCodeData);

			// Update the new user with the access code ID
			const { error: userUpdateError } = await supabase
				.from("profiles")
				.update({
					access_code: accessCodeData.id,
					invited_by: accessCodeData.created_by,
					access_granted: true,
				})
				.eq("id", userId);

			if (userUpdateError) {
				console.error("Error updating user profile:", userUpdateError);
				return;
			}

			console.log("User profile updated with access code");

			// Increment the users joined counter
			const { error: counterError } = await supabase
				.from("access_codes")
				.update({ users_joined_counter: (accessCodeData.users_joined_counter || 0) + 1 })
				.eq("id", accessCodeData.id);

			if (counterError) {
				console.error("Error incrementing users joined counter:", counterError);
			}

			// Only award points if there's a creator (not for system codes)
			if (accessCodeData.created_by) {
				// Award points to both users
				const success = await assignInvitePoints(accessCodeData.created_by, userId);

				if (success) {
					console.log("Points awarded for invitation");
					toast.success("You both got 5 bonus dark points!");
				}
			}
		} catch (err) {
			console.error("Error processing invite:", err);
		}
	};

	return {
		inviterName,
		loading,
		error,
		handleAfterSignup,
	};
}
