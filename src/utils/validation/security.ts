import { z } from "zod";

// Common validation schemas
export const emailSchema = z.string().email();
export const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
		message:
			"Password must contain at least one uppercase letter, one lowercase letter, and one number",
	});

// Text input validation
export const textInputSchema = z
	.string()
	.max(10000, "Input too long")
	.regex(/^[^<>]*$/, "Invalid characters detected");

// File upload validation
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const validateFileUpload = (file: File): { isValid: boolean; error?: string } => {
	if (file.size > MAX_FILE_SIZE) {
		return { isValid: false, error: "File size must be less than 5MB" };
	}

	if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
		return { isValid: false, error: "Only JPEG, PNG, WebP, and GIF files are allowed" };
	}

	return { isValid: true };
};

// Text sanitization
export const sanitizeText = (input: string): string => {
	return input
		.trim()
		.replace(/[<>]/g, "") // Remove potential HTML tags
		.replace(/javascript:/gi, "") // Remove javascript: protocol
		.replace(/on\w+=/gi, ""); // Remove event handlers
};

// URL validation
export const isValidUrl = (url: string): boolean => {
	try {
		const parsedUrl = new URL(url);
		return ["http:", "https:"].includes(parsedUrl.protocol);
	} catch {
		return false;
	}
};

// Rate limiting helper (for client-side tracking)
export class RateLimiter {
	private attempts: Map<string, number[]> = new Map();

	constructor(private maxAttempts: number, private windowMs: number) {}

	isAllowed(identifier: string): boolean {
		const now = Date.now();
		const attempts = this.attempts.get(identifier) || [];

		// Remove old attempts outside the window
		const validAttempts = attempts.filter((time) => now - time < this.windowMs);

		if (validAttempts.length >= this.maxAttempts) {
			return false;
		}

		// Add current attempt
		validAttempts.push(now);
		this.attempts.set(identifier, validAttempts);

		return true;
	}

	reset(identifier: string): void {
		this.attempts.delete(identifier);
	}
}

// Security headers helper
export const getSecurityHeaders = (): Record<string, string> => {
	return {
		"X-Content-Type-Options": "nosniff",
		"X-Frame-Options": "DENY",
		"X-XSS-Protection": "1; mode=block",
		"Referrer-Policy": "strict-origin-when-cross-origin",
	};
};
