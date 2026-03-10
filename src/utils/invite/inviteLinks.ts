
import { supabase } from "@/integrations/supabase/client";

/**
 * Generates an invite link for a given access code
 * @param accessCodeId - The access code ID to generate a link for
 * @returns The complete invite URL
 */
export const generateInviteLink = (accessCodeId: string | null): string => {
	if (!accessCodeId) {
		return `${window.location.origin}/invite/`;
	}
	
	return `${window.location.origin}/invite/${accessCodeId}`;
};

/**
 * Creates a shareable invite link with additional context
 * @param accessCodeId - The access code ID
 * @param userName - Optional user name for personalization
 * @returns Promise<string> - The shareable invite link
 */
export const createShareableInviteLink = async (
	accessCodeId: string | null,
	userName?: string
): Promise<string> => {
	const baseLink = generateInviteLink(accessCodeId);
	
	if (userName) {
		return `${baseLink}?from=${encodeURIComponent(userName)}`;
	}
	
	return baseLink;
};
