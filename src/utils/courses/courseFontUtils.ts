/**
 * Utility function to get the appropriate font class for course titles
 * Maps course titles to specific Google Fonts for visual variety
 */
export const getCourseTitleFontClass = (courseTitle: string): string => {
	// Map course titles to font classes
	const courseFontMap: Record<string, string> = {
		"Build a Strong, Capable Body": "font-serif", // Serif font
		"Use Tech Like a Pro": "font-mono", // Display/monospace font
		"Master Your Finances": "font-playfair",
		"Eat Like an Adult": "font-righteous",
		"Run Your Life Smoothly": "font-fredoka",
		"Write like the 1%": "font-space-grotesk",
	};

	// Return the mapped font or default to outfit
	const fontClass = courseFontMap[courseTitle] || "font-outfit";

	return fontClass;
};
