/**
 * This file contains runtime utilities and constants for activity types.
 * While types.ts defines the TypeScript types, this file handles the runtime
 * validation, normalization, and display of activity types.
 */

/**
 * List of currently supported (canonical) activity types.
 * This array deliberately excludes deprecated types and uppercase variants
 * that are kept in types.ts for backwards compatibility.
 */
export const VALID_ACTIVITY_TYPES = [
	"multiple_choice",
	"true_false",
	"text_input", // Only one text input type now
	"sorting",
	"image_multiple_choice",
	"poll",
	"image_poll",
	"text_poll",
	"myth_or_reality",
	"eduntainment",
	"pair_matching",
];

/**
 * Maps internal activity type names to user-friendly display names.
 * Used when showing activity types in the UI.
 */
export const ACTIVITY_TYPE_NAMES: Record<string, string> = {
	multiple_choice: "Multiple Choice",
	true_false: "True/False",
	text_input: "Text Input",
	sorting: "Sorting",
	image_multiple_choice: "Image Multiple Choice",
	poll: "Poll",
	image_poll: "Image Poll",
	text_poll: "Text Poll",
	myth_or_reality: "Myth or Reality",
	eduntainment: "Edutainment",
	pair_matching: "Pair Matching",
};
