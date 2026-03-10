import React, { useState } from "react";
import { Input } from "@/components/ui/form/input";
import { Button } from "@/components/ui/interactive/button";

interface DobFormProps {
	onSubmit: (dob: Date) => void;
	initialDob?: string;
}

const DEFAULT_DOB = "1980-01";

const DobForm: React.FC<DobFormProps> = ({ onSubmit, initialDob }) => {
	const [monthString, setMonthString] = useState(initialDob || DEFAULT_DOB);

	const handleSubmit = () => {
		if (!monthString) return;
		const date = new Date(monthString + "-01T00:00:00");
		if (isNaN(date.getTime())) return;
		if (date > new Date()) return;
		onSubmit(date);
	};

	const now = new Date();
	const maxMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

	return (
		<div className="flex items-center gap-3 justify-center">
			<label htmlFor="dob" className="text-sm text-muted-foreground whitespace-nowrap">
				Born
			</label>
			<Input
				id="dob"
				type="month"
				value={monthString}
				onChange={(e) => setMonthString(e.target.value)}
				className="w-40 h-8 text-sm"
				max={maxMonth}
			/>
			<Button onClick={handleSubmit} size="sm" className="h-8">
				Visualize My Life
			</Button>
		</div>
	);
};

export default DobForm;
