import React, { useState } from "react";
import DobForm from "@/components/life-in-weeks/DobForm";
import LifeInWeeksView from "@/components/life-in-weeks/LifeInWeeksView";
import { Switch } from "@/components/ui/form/switch";

const STORAGE_KEY = "life-in-weeks-dob";
const WEIGHTS_KEY = "life-in-weeks-weights";
const DEFAULT_DOB_YM = "1980-01";

// Only stats that compete for time are allocatable
const STAT_KEYS = [
	"skills", "books", "countries", "languages", "instruments",
	"careers", "hobbies", "recipes", "roadtrips", "friendships",
];

function getDefaultWeights(): Record<string, number> {
	const eq = 100 / STAT_KEYS.length;
	const w: Record<string, number> = {};
	STAT_KEYS.forEach((k) => { w[k] = eq; });
	return w;
}

function loadWeights(): Record<string, number> {
	try {
		const stored = localStorage.getItem(WEIGHTS_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			// Ensure all keys exist
			const defaults = getDefaultWeights();
			for (const key of STAT_KEYS) {
				if (typeof parsed[key] !== "number") parsed[key] = defaults[key];
			}
			return parsed;
		}
	} catch { /* ignore */ }
	return getDefaultWeights();
}

const LifeInWeeksPage: React.FC = () => {
	const [dob, setDob] = useState<Date>(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		const ym = stored || DEFAULT_DOB_YM;
		const date = new Date(ym + "-01T00:00:00");
		return isNaN(date.getTime()) ? new Date(DEFAULT_DOB_YM + "-01T00:00:00") : date;
	});
	const [showPhases, setShowPhases] = useState(true);
	const [showUsefulTime, setShowUsefulTime] = useState(true);
	const [weights, setWeights] = useState<Record<string, number>>(loadWeights);

	const handleDobSubmit = (date: Date) => {
		const ym = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
		localStorage.setItem(STORAGE_KEY, ym);
		setDob(date);
	};

	const handleWeightsChange = (newWeights: Record<string, number>) => {
		setWeights(newWeights);
		localStorage.setItem(WEIGHTS_KEY, JSON.stringify(newWeights));
	};

	const storedYm = localStorage.getItem(STORAGE_KEY) || DEFAULT_DOB_YM;

	return (
		<div className="h-screen flex flex-col justify-center p-3 gap-1">
			{/* Header */}
			<div className="flex items-center gap-4 flex-wrap justify-center shrink-0 relative z-50 py-1">
				<div className="flex items-center gap-4 flex-wrap justify-center">
					<DobForm onSubmit={handleDobSubmit} initialDob={storedYm} />
					<div className="flex items-center gap-3">
						<label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
							<Switch checked={showPhases} onCheckedChange={setShowPhases} className="scale-75" />
							Life Phases
						</label>
						<label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
							<Switch checked={showUsefulTime} onCheckedChange={setShowUsefulTime} className="scale-75" />
							Useful Time
						</label>
					</div>
				</div>
			</div>

			{/* Main content */}
			<div className="flex-1 min-h-0 overflow-hidden">
				<LifeInWeeksView
					dob={dob}
					showPhases={showPhases}
					showUsefulTime={showUsefulTime}
					weights={weights}
					onWeightsChange={handleWeightsChange}
				/>
			</div>

			{/* Handwritten note */}
			<p className="text-[20px] italic text-muted-foreground/40 text-right pr-4 shrink-0" style={{ fontFamily: "'Caveat', cursive" }}>
				Kind reminder: live now. There is so much to be experienced!
			</p>
		</div>
	);
};

export default LifeInWeeksPage;
