import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/form/Select";
import { VALID_ACTIVITY_TYPES, ACTIVITY_TYPE_NAMES } from "@/utils/activities/activityDefinitions";
import { ActivityType } from "@/types/activity";

interface ActivityTypeSelectorProps {
	value: string;
	onChange: (value: string) => void;
}

export function ActivityTypeSelector({ value, onChange }: ActivityTypeSelectorProps) {
	// Filter out duplicates and aliases to show only unique activity types
	// This uses the canonical types from the ActivityType definition
	const uniqueActivityTypes = [
		"multiple_choice",
		"true_false",
		"text_input",
		"sorting",
		"image_multiple_choice",
		"poll",
		"image_poll",
		"text_poll",
		"myth_or_reality",
		"eduntainment",
	];

	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Select activity type" />
			</SelectTrigger>
			<SelectContent>
				{uniqueActivityTypes.map((type) => (
					<SelectItem key={type} value={type}>
						{ACTIVITY_TYPE_NAMES[type] || type}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
