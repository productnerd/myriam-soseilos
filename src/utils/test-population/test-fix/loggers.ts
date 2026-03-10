
/**
 * Logging utilities for test fixing operations
 */

/**
 * Log messages with consistent formatting
 */
export const log = {
	info: (message: string) => console.info(`${message}`),
	success: (message: string) => console.log(`${message}`),
	error: (message: string) => console.error(`${message}`),
	summary: (message: string) => console.log(`[SUMMARY] ${message}`),
};
