// ============================================================================
// AVATAR FALLBACK UTILITIES (for AvatarFallback components)
// ============================================================================

/**
 * Gets the fallback text for an avatar when no image is available
 * @param name Optional user name
 * @param email Optional user email
 * @returns A single character to display as fallback
 */
export function getAvatarFallback(name?: string | null, email?: string | null): string {
	if (name && name.length > 0) {
		return name.charAt(0).toUpperCase();
	}

	if (email && email.length > 0) {
		return email.charAt(0).toUpperCase();
	}

	return "U"; // Ultimate fallback if neither name nor email is available
}

// ============================================================================
// AVATAR GENERATION UTILITIES (API-based - for external generation)
// ============================================================================

/**
 * Generate avatar URL using DiceBear API (external HTTP call)
 * @param userId The user ID to use as seed
 * @returns URL to the generated avatar
 */
export function generateAvatarUrl(userId: string): string {
	// Simple avatar generation using DiceBear API
	return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
}

/**
 * Generate a random avatar URL using DiceBear API (external HTTP call)
 * @returns URL to the generated avatar
 */
export function generateRandomAvatar(): string {
	const randomSeed = Math.random().toString(36).substring(7);
	return `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
}

/**
 * Generate avatar based on name using DiceBear API (external HTTP call)
 * @param name The name to use as seed for avatar generation
 * @returns URL to the generated avatar
 */
export function generateAvatarFromName(name: string): string {
	// Generate avatar based on name
	return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
}
