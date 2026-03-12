import React from "react";
import {
	LIFE_STAGE_COLORS,
	ACTIVITY_COLORS,
	ACTIVITY_EMOJIS,
	type LifeStage,
	type ActivityType,
} from "@/hooks/life-in-weeks/useLifeInWeeks";

const LIFE_STAGE_ITEMS: { stage: LifeStage; label: string }[] = [
	{ stage: "early-years", label: "Early Years" },
	{ stage: "education", label: "Education" },
	{ stage: "retirement", label: "Retirement" },
];

const ACTIVITY_ITEMS: { type: ActivityType; label: string }[] = [
	{ type: "sleep", label: "Sleeping" },
	{ type: "commute", label: "Commuting" },
	{ type: "admin", label: "Life Admin" },
	{ type: "free", label: "Truly Free" },
];

interface LegendProps {
	showPhases: boolean;
	showUsefulTime: boolean;
}

const Legend: React.FC<LegendProps> = ({ showPhases, showUsefulTime }) => {
	return (
		<div className="flex items-center gap-3 flex-wrap justify-center text-[10px]">
			{showPhases && (
				<>
					<span className="text-[8px] uppercase tracking-wider text-muted-foreground/60 font-semibold">Phases</span>
					{LIFE_STAGE_ITEMS.map(({ stage, label }) => (
						<div key={stage} className="flex items-center gap-1">
							<div
								className="w-2 h-2 rounded-[1px] shrink-0"
								style={{ backgroundColor: LIFE_STAGE_COLORS[stage] }}
							/>
							<span className="text-foreground/60">{label}</span>
						</div>
					))}
				</>
			)}

			{showUsefulTime && (
				<>
					{showPhases && <span className="text-muted-foreground/30">|</span>}
					<span className="text-[8px] uppercase tracking-wider text-muted-foreground/60 font-semibold">Time</span>
					<div className="flex items-center gap-1">
						<div className="w-2 h-2 rounded-[1px] shrink-0 bg-white week-current-legend" />
						<span className="text-foreground/60">Now</span>
					</div>
					{ACTIVITY_ITEMS.map(({ type, label }) => (
						<div key={type} className="flex items-center gap-1">
							<div
								className="w-2 h-2 rounded-[1px] shrink-0"
								style={{ backgroundColor: ACTIVITY_COLORS[type] }}
							/>
							<span className="text-foreground/60">
								{ACTIVITY_EMOJIS[type]} {label}
							</span>
						</div>
					))}
				</>
			)}

			{!showPhases && !showUsefulTime && (
				<>
					<div className="flex items-center gap-1">
						<div className="w-2 h-2 rounded-[1px] shrink-0 bg-white week-current-legend" />
						<span className="text-foreground/60">This Week</span>
					</div>
				</>
			)}
		</div>
	);
};

export default Legend;
