import { supabase } from "@/integrations/supabase/client";

/**
 * Get the current user ID, with fallback to demo ID
 * @deprecated Use user?.id || null directly instead
 */
export async function getUserId(userId: string | null): Promise<string | null> {
	return userId || null;
}
