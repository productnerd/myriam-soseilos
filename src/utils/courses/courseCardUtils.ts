// Convert number to Roman numerals
export const toRomanNumeral = (num: number): string => {
	const romanNumerals = [
		{ value: 10, symbol: "X" },
		{ value: 9, symbol: "IX" },
		{ value: 5, symbol: "V" },
		{ value: 4, symbol: "IV" },
		{ value: 1, symbol: "I" },
	];

	let result = "";
	for (const { value, symbol } of romanNumerals) {
		while (num >= value) {
			result += symbol;
			num -= value;
		}
	}
	return result;
};

// Update course color if it's one of the default colors
export const getCourseColor = (courseColor: string) => {
	if (courseColor === "#3B82F6") return "#556B2F"; // Olive green instead of blue
	if (courseColor === "#EC4899") return "#800020"; // Burgundy instead of pink
	if (courseColor === "#10B981") return "#F97316"; // Bright orange instead of green
	return courseColor; // Keep any custom colors as they are
};

// Arch shape styling - same as self-exploration quests
export const getCardStyle = () => ({
	borderTopLeftRadius: "144px",
	borderTopRightRadius: "144px",
	borderBottomLeftRadius: "24px",
	borderBottomRightRadius: "24px",
});

// Get course background image with fallback
export const getCourseBackgroundImage = (image: string) => {
	return image || "/placeholder-course-bg.jpg";
};

// Check if course is coming soon
export const isComingSoon = (status: string) => {
	return status === "COMING_SOON";
};
