/**
 * Calculate the time in seconds a user needs to read and answer an activity based on the content length and complexity.
 *
 * @param activity The activity to calculate time for
 * @param minTime Minimum time in seconds
 * 
 * @returns Time in seconds
 */
export const calculateActivityTime = (
	activity: { main_text: string; options?: string[] | Record<string, any>[] },
	minTime: number = 20
): number => {
	if (!activity) return minTime;

	// Base reading speed: 200 words per minute
	const wordsPerMinute = 200;
	const wordsPerSecond = wordsPerMinute / 60;

	// Count words in main text
	const mainTextWords = activity.main_text ? activity.main_text.trim().split(/\s+/).length : 0;

	// Count words in options, handling both string arrays and complex options
	let optionsWords = 0;
	if (activity.options) {
		if (Array.isArray(activity.options)) {
			activity.options.forEach((option) => {
				if (typeof option === "string") {
					optionsWords += option.trim().split(/\s+/).length;
				} else if (typeof option === "object" && option !== null) {
					// For object options, count words in all string values
					Object.values(option).forEach((value) => {
						if (typeof value === "string") {
							optionsWords += value.trim().split(/\s+/).length;
						}
					});
				}
			});
		}
	}

	// Calculate reading time in seconds
	const totalWords = mainTextWords + optionsWords;
	const readingTime = Math.ceil(totalWords / wordsPerSecond);

	// Add thinking time based on activity complexity
	const thinkingTime = 10; // Default 10 seconds for thinking

	// Ensure minimum time
	return Math.max(readingTime + thinkingTime, minTime);
};
