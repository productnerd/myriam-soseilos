import { Label } from "@/components/ui/form/Label";
import { ActivityTypeSelector } from "./ActivityTypeSelector";

interface ActivityTypeFieldProps {
	value: string;
	onChange: (value: string) => void;
}

export const ActivityTypeField = ({ value, onChange }: ActivityTypeFieldProps) => {
	return (
		<div className="space-y-2">
			<Label>Activity Type *</Label>
			<ActivityTypeSelector value={value} onChange={onChange} />
		</div>
	);
};
