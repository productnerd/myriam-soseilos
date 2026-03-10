import React from "react";
import { Label } from "@/components/ui/form/Label";
import { Input } from "@/components/ui/form/Input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/form/Select";
import { ActivityType } from "@/types/activity";

interface ActivityTypeSelectorProps {
	selectedType: ActivityType;
	onTypeChange: (type: ActivityType) => void;
	optionsCount: number;
	onOptionsCountChange: (count: number) => void;
	activityId: string;
}

const ACTIVITY_TYPES = [
	{ value: "multiple_choice", label: "Multiple Choice", needsOptions: true },
	{ value: "true_false", label: "True/False", needsOptions: false },
	{ value: "text_input", label: "Text Input", needsOptions: false },
	{ value: "myth_or_reality", label: "Myth or Reality", needsOptions: false },
	{ value: "sorting", label: "Sorting", needsOptions: true },
	{ value: "pair_matching", label: "Pair Matching", needsOptions: true },
	{ value: "poll", label: "Poll", needsOptions: true },
];

export const ActivityTypeSelector: React.FC<ActivityTypeSelectorProps> = ({
	selectedType,
	onTypeChange,
	optionsCount,
	onOptionsCountChange,
	activityId,
}) => {
	const selectedActivityType = ACTIVITY_TYPES.find((type) => type.value === selectedType);
	const needsOptions = selectedActivityType?.needsOptions || false;

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div className="space-y-2">
				<Label htmlFor={`type-${activityId}`}>Activity Type</Label>
				<Select value={selectedType} onValueChange={onTypeChange}>
					<SelectTrigger>
						<SelectValue placeholder="Select activity type" />
					</SelectTrigger>
					<SelectContent>
						{ACTIVITY_TYPES.map((type) => (
							<SelectItem key={type.value} value={type.value}>
								{type.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{needsOptions && (
				<div className="space-y-2">
					<Label htmlFor={`options-${activityId}`}>Number of Options</Label>
					<Input
						id={`options-${activityId}`}
						type="number"
						min="2"
						max="6"
						value={optionsCount}
						onChange={(e) => onOptionsCountChange(parseInt(e.target.value) || 4)}
					/>
				</div>
			)}
		</div>
	);
};

export { ACTIVITY_TYPES };
