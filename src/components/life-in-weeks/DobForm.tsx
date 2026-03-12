import React, { useState, useRef, useEffect } from "react";

interface DobFormProps {
	onSubmit: (dob: Date) => void;
	initialDob?: string;
}

const MONTHS = [
	"Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const YEARS = Array.from({ length: 100 }, (_, i) => currentYear - i);

const DEFAULT_YEAR = 1980;
const DEFAULT_MONTH = 0;

function parseInitialDob(dob?: string) {
	if (!dob) return { year: DEFAULT_YEAR, month: DEFAULT_MONTH };
	const [y, m] = dob.split("-").map(Number);
	return { year: y || DEFAULT_YEAR, month: (m || 1) - 1 };
}

const DobForm: React.FC<DobFormProps> = ({ onSubmit, initialDob }) => {
	const initial = parseInitialDob(initialDob);
	const [year, setYear] = useState(initial.year);
	const [month, setMonth] = useState(initial.month);
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		if (open) document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [open]);

	const update = (newMonth: number, newYear: number) => {
		const clamped = newYear === currentYear && newMonth > currentMonth ? currentMonth : newMonth;
		setMonth(clamped);
		setYear(newYear);
		onSubmit(new Date(newYear, clamped, 1));
	};

	return (
		<div ref={ref} className="relative inline-block">
			<button
				onClick={() => setOpen(!open)}
				className="text-xs text-muted-foreground hover:text-foreground transition-colors border-b border-dashed border-muted-foreground/30 hover:border-foreground/50 pb-0.5"
			>
				Born {MONTHS[month]} {year}
			</button>

			{open && (
				<div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[100] bg-[hsl(28,15%,15%)] border border-border rounded-lg p-3 shadow-2xl min-w-[220px]">
					<div className="grid grid-cols-6 gap-1 mb-2">
						{MONTHS.map((m, i) => {
							const disabled = year === currentYear && i > currentMonth;
							return (
								<button
									key={m}
									disabled={disabled}
									onClick={() => update(i, year)}
									className={`w-8 h-6 text-xs rounded-full text-center transition-colors ${
										i === month
											? "bg-primary text-primary-foreground"
											: disabled
											? "text-muted-foreground/30 cursor-not-allowed"
											: "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
									}`}
								>
									{m}
								</button>
							);
						})}
					</div>
					<select
						value={year}
						onChange={(e) => update(month, Number(e.target.value))}
						className="w-full h-7 rounded-md border border-input bg-background pl-2 pr-6 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring appearance-none"
						style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239a9a9a' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
					>
						{YEARS.map((y) => (
							<option key={y} value={y}>{y}</option>
						))}
					</select>
				</div>
			)}
		</div>
	);
};

export default DobForm;
