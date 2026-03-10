import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/form/Select";
import { ActivityType } from "@/types/activity";

// List of unique activity types to display
const UNIQUE_ACTIVITY_TYPES = [
	"multiple_choice",
	"true_false",
	"text_input",
	"myth_or_reality",
	"poll",
	"eduntainment",
	"sorting",
	"image_multiple_choice",
	"image_poll",
	"text_poll",
];

// Map of activity type names for display
const ACTIVITY_TYPE_NAMES: Record<string, string> = {
	multiple_choice: "Multiple Choice",
	true_false: "True/False",
	text_input: "Text Input",
	myth_or_reality: "Myth or Reality",
	poll: "Poll",
	eduntainment: "Educational Content",
	sorting: "Sort in Order",
	image_multiple_choice: "Image Multiple Choice",
	image_poll: "Image Poll",
	text_poll: "Text Poll",
};

interface ActivityTypeSelectProps {
	value: string;
	onValueChange: (value: ActivityType) => void;
	disabled?: boolean;
}

const ActivityTypeSelect: React.FC<ActivityTypeSelectProps> = ({
	value,
	onValueChange,
	disabled = false,
}) => {
	return (
		<Select
			value={value}
			onValueChange={(newValue: string) => onValueChange(newValue as ActivityType)}
			disabled={disabled}
		>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Select activity type" />
			</SelectTrigger>
			<SelectContent>
				{UNIQUE_ACTIVITY_TYPES.map((type) => (
					<SelectItem key={type} value={type}>
						{ACTIVITY_TYPE_NAMES[type]}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default ActivityTypeSelect;
