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
		<div className="flex flex-col gap-3 text-xs">
			{showPhases && (
				<div>
					<p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
						Life Stages
					</p>
					<div className="flex flex-col gap-1">
						{LIFE_STAGE_ITEMS.map(({ stage, label }) => (
							<div key={stage} className="flex items-center gap-1.5">
								<div
									className="w-2.5 h-2.5 rounded-[1px] shrink-0"
									style={{ backgroundColor: LIFE_STAGE_COLORS[stage] }}
								/>
								<span className="text-foreground/80 leading-tight">{label}</span>
							</div>
						))}
					</div>
				</div>
			)}

			{showUsefulTime && (
				<div>
					<p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
						Time Spent
					</p>
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-1.5">
							<div className="w-2.5 h-2.5 rounded-[1px] shrink-0 bg-white week-current-legend" />
							<span className="text-foreground/80 leading-tight">This Week</span>
						</div>
						{ACTIVITY_ITEMS.map(({ type, label }) => (
							<div key={type} className="flex items-center gap-1.5">
								<div
									className="w-2.5 h-2.5 rounded-[1px] shrink-0"
									style={{ backgroundColor: ACTIVITY_COLORS[type] }}
								/>
								<span className="text-foreground/80 leading-tight">
									{ACTIVITY_EMOJIS[type]} {label}
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			{!showPhases && !showUsefulTime && (
				<div>
					<p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
						Key
					</p>
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-1.5">
							<div className="w-2.5 h-2.5 rounded-[1px] shrink-0 bg-white week-current-legend" />
							<span className="text-foreground/80 leading-tight">This Week</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Legend;
