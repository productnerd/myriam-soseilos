import React, { useState, useRef, useEffect } from "react";

// Only stats that compete for time are allocatable
const STAT_KEYS = [
	{ key: "skills", emoji: "🎯", label: "Skills" },
	{ key: "books", emoji: "📚", label: "Books" },
	{ key: "countries", emoji: "✈️", label: "Countries" },
	{ key: "languages", emoji: "🗣️", label: "Languages" },
	{ key: "instruments", emoji: "🎸", label: "Instruments" },
	{ key: "careers", emoji: "💼", label: "Careers" },
	{ key: "hobbies", emoji: "🎨", label: "Hobbies" },
	{ key: "recipes", emoji: "👨‍🍳", label: "Recipes" },
	{ key: "roadtrips", emoji: "🛣️", label: "Road trips" },
	{ key: "friendships", emoji: "👋", label: "Friendships" },
];

interface WeightAllocatorProps {
	weights: Record<string, number>;
	onChange: (weights: Record<string, number>) => void;
}

const WeightAllocator: React.FC<WeightAllocatorProps> = ({ weights, onChange }) => {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		};
		if (open) document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [open]);

	const total = Object.values(weights).reduce((s, w) => s + w, 0);
	const remaining = 100 - Math.round(total);

	const handleChange = (key: string, val: number) => {
		const newWeights = { ...weights, [key]: Math.max(0, Math.min(100, val)) };
		const newTotal = Object.values(newWeights).reduce((s, w) => s + w, 0);
		if (newTotal <= 100) {
			onChange(newWeights);
		}
	};

	const handleSlider = (key: string, val: number) => {
		const oldVal = weights[key] ?? 0;
		const diff = val - oldVal;
		const currentTotal = Object.values(weights).reduce((s, w) => s + w, 0);
		if (currentTotal + diff <= 100) {
			onChange({ ...weights, [key]: val });
		} else {
			onChange({ ...weights, [key]: oldVal + (100 - currentTotal) });
		}
	};

	const resetEqual = () => {
		const eq = 100 / STAT_KEYS.length;
		const newWeights: Record<string, number> = {};
		STAT_KEYS.forEach(({ key }) => { newWeights[key] = eq; });
		onChange(newWeights);
	};

	return (
		<div ref={ref} className="relative">
			<button
				onClick={() => setOpen(!open)}
				className="text-[9px] text-muted-foreground/50 hover:text-muted-foreground transition-colors flex items-center gap-1"
				title="Adjust priorities"
			>
				<span>⚙️</span>
				<span>Priorities</span>
			</button>

			{open && (
				<div className="absolute right-0 top-full mt-1 z-50 bg-zinc-900 border border-white/10 rounded-lg shadow-xl p-3 w-[260px] max-h-[400px] overflow-y-auto">
					<div className="flex items-center justify-between mb-2">
						<span className="text-[11px] font-medium text-white">Allocate 100 points</span>
						<button
							onClick={resetEqual}
							className="text-[9px] text-muted-foreground hover:text-white transition-colors"
						>
							Reset equal
						</button>
					</div>

					<div className={`text-[10px] mb-2 font-medium ${remaining < 0 ? "text-red-400" : remaining === 0 ? "text-green-400" : "text-orange-400"}`}>
						{remaining === 0 ? "All points allocated ✓" : `${remaining} points remaining`}
					</div>

					<div className="flex flex-col gap-1.5">
						{STAT_KEYS.map(({ key, emoji, label }) => {
							const w = weights[key] ?? 0;
							return (
								<div key={key} className="flex items-center gap-2">
									<span className="text-[10px] w-4 shrink-0">{emoji}</span>
									<span className="text-[10px] text-muted-foreground w-16 shrink-0 truncate">{label}</span>
									<input
										type="range"
										min={0}
										max={50}
										step={1}
										value={Math.round(w)}
										onChange={(e) => handleSlider(key, parseInt(e.target.value))}
										className="flex-1 h-1 accent-orange-500 cursor-pointer"
									/>
									<span className="text-[10px] text-white/70 w-5 text-right tabular-nums">{Math.round(w)}</span>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default WeightAllocator;
export { STAT_KEYS };
