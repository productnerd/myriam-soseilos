import React, { useState } from "react";
import DobForm from "@/components/life-in-weeks/DobForm";
import LifeInWeeksView from "@/components/life-in-weeks/LifeInWeeksView";
import { Switch } from "@/components/ui/form/switch";

const STORAGE_KEY = "life-in-weeks-dob";
const DEFAULT_DOB_YM = "1980-01";

const LifeInWeeksPage: React.FC = () => {
	const [dob, setDob] = useState<Date>(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		const ym = stored || DEFAULT_DOB_YM;
		const date = new Date(ym + "-01T00:00:00");
		return isNaN(date.getTime()) ? new Date(DEFAULT_DOB_YM + "-01T00:00:00") : date;
	});
	const [showPhases, setShowPhases] = useState(true);
	const [showUsefulTime, setShowUsefulTime] = useState(true);

	const handleDobSubmit = (date: Date) => {
		const ym = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
		localStorage.setItem(STORAGE_KEY, ym);
		setDob(date);
	};

	const storedYm = localStorage.getItem(STORAGE_KEY) || DEFAULT_DOB_YM;

	return (
		<div className="h-screen flex flex-col overflow-hidden p-3 gap-1">
			{/* Header */}
			<div className="flex flex-col items-center gap-1 shrink-0">
				<h2 className="text-base font-bold text-foreground text-center">
					Your Life in Weeks
				</h2>
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
			<LifeInWeeksView dob={dob} showPhases={showPhases} showUsefulTime={showUsefulTime} />
		</div>
	);
};

export default LifeInWeeksPage;
