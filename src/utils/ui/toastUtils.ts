/**
 * Toast debouncing utilities to prevent duplicate notifications
 */

interface ToastMessage {
	id: string;
	timestamp: number;
}

// Keep track of recently shown toasts
const recentToasts: ToastMessage[] = [];

// Cleanup interval (milliseconds)
const CLEANUP_INTERVAL = 10000; // 10 seconds

// Debounce period (milliseconds) - prevent duplicate toasts within this period
const DEBOUNCE_PERIOD = 3000; // 3 seconds

/**
 * Clean up old toast records that are no longer needed
 */
const cleanupOldToasts = () => {
	const now = Date.now();
	const cutoffTime = now - DEBOUNCE_PERIOD;

	// Remove entries older than the cutoff time
	while (recentToasts.length > 0 && recentToasts[0].timestamp < cutoffTime) {
		recentToasts.shift();
	}
};

// Set up a regular cleanup interval
setInterval(cleanupOldToasts, CLEANUP_INTERVAL);

/**
 * Check if a toast message should be shown based on its content
 * @param messageContent The content or identifier for the toast
 * @returns boolean indicating if this toast should be shown
 */
export const shouldShowToast = (messageContent: string): boolean => {
	// Create a unique ID for this toast message
	const toastId = messageContent.trim().toLowerCase();

	// Current timestamp
	const now = Date.now();

	// Clean up old entries first
	cleanupOldToasts();

	// Check if we've shown this toast recently
	const isDuplicate = recentToasts.some((toast) => toast.id === toastId);

	// If not a duplicate, add it to our tracking
	if (!isDuplicate) {
		recentToasts.push({
			id: toastId,
			timestamp: now,
		});

		return true;
	}

	// It's a duplicate toast within the debounce period, don't show it
	return false;
};
