import React from "react";
import { Input } from "@/components/ui/form/Input";

interface FilterSectionProps {
	minGreyPoints: string;
	setMinGreyPoints: (value: string) => void;
	minDarkPoints: string;
	setMinDarkPoints: (value: string) => void;
	minStreak: string;
	setMinStreak: (value: string) => void;
	country: string;
	setCountry: (value: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
	minGreyPoints,
	setMinGreyPoints,
	minDarkPoints,
	setMinDarkPoints,
	minStreak,
	setMinStreak,
	country,
	setCountry,
}) => {
	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="text-sm font-medium">Minimum Grey Points (optional)</label>
					<Input
						type="number"
						placeholder="e.g., 100"
						value={minGreyPoints}
						onChange={(e) => setMinGreyPoints(e.target.value)}
					/>
				</div>

				<div>
					<label className="text-sm font-medium">Minimum Dark Points (optional)</label>
					<Input
						type="number"
						placeholder="e.g., 10"
						value={minDarkPoints}
						onChange={(e) => setMinDarkPoints(e.target.value)}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="text-sm font-medium">Minimum Streak (optional)</label>
					<Input
						type="number"
						placeholder="e.g., 5"
						value={minStreak}
						onChange={(e) => setMinStreak(e.target.value)}
					/>
				</div>

				<div>
					<label className="text-sm font-medium">Country (optional)</label>
					<Input
						placeholder="e.g., US"
						value={country}
						onChange={(e) => setCountry(e.target.value)}
					/>
				</div>
			</div>
		</>
	);
};

export default FilterSection;
