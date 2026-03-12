import React, { useState } from "react";
import {
	type ActivityBreakdown,
	ACTIVITY_EMOJIS,
	ACTIVITY_COLORS,
} from "@/hooks/life-in-weeks/useLifeInWeeks";

export interface StatDef {
	key: string;
	emoji: string;
	label: string;
	baseValue: number;
	unit: string;
	tooltip: string;
}

interface BentoStatsProps {
	remainingWeeks: number;
	activityBreakdown: ActivityBreakdown;
	freeRemainingDays: number;
	totalFreeHoursWithRetirement: number;
	remainingYears: number;
	weights: Record<string, number>;
}

const BentoStats: React.FC<BentoStatsProps> = ({
	remainingWeeks,
	activityBreakdown,
	freeRemainingDays,
	totalFreeHoursWithRetirement,
	remainingYears,
	weights,
}) => {
	const [hoveredKey, setHoveredKey] = useState<string | null>(null);
	const hours = totalFreeHoursWithRetirement;

	const statDefs: StatDef[] = [
		{ key: "skills", emoji: "🎯", label: "skills to master", baseValue: hours / 10000, unit: "10,000 hrs each", tooltip: `${hours.toLocaleString()} hrs ÷ 10,000` },
		{ key: "books", emoji: "📚", label: "books to read", baseValue: hours / 6, unit: "6 hrs each", tooltip: `${hours.toLocaleString()} hrs ÷ 6` },
		{ key: "countries", emoji: "✈️", label: "countries to visit", baseValue: remainingYears * 2, unit: "2 per year", tooltip: `${Math.round(remainingYears)} yrs × 2` },
		{ key: "languages", emoji: "🗣️", label: "languages to learn", baseValue: hours / 1100, unit: "1,100 hrs each", tooltip: `${hours.toLocaleString()} hrs ÷ 1,100` },
		{ key: "instruments", emoji: "🎸", label: "instruments to play", baseValue: hours / 2000, unit: "2,000 hrs each", tooltip: `${hours.toLocaleString()} hrs ÷ 2,000` },
		{ key: "careers", emoji: "💼", label: "careers to explore", baseValue: remainingYears / 6, unit: "6 yrs each", tooltip: `${Math.round(remainingYears)} yrs ÷ 6` },
		{ key: "hobbies", emoji: "🎨", label: "hobbies to master", baseValue: remainingYears / 2, unit: "2 yrs each", tooltip: `${Math.round(remainingYears)} yrs ÷ 2` },
		{ key: "recipes", emoji: "👨‍🍳", label: "recipes to try", baseValue: remainingWeeks, unit: "1 per week", tooltip: `${remainingWeeks.toLocaleString()} weeks` },
		{ key: "roadtrips", emoji: "🛣️", label: "road trips", baseValue: remainingYears * 2, unit: "2 per year", tooltip: `${Math.round(remainingYears)} yrs × 2` },
		{ key: "friendships", emoji: "👋", label: "friendships to form", baseValue: remainingYears * 3, unit: "3 per year", tooltip: `${Math.round(remainingYears)} yrs × 3` },
		{ key: "sunsets", emoji: "🌅", label: "sunsets to watch", baseValue: remainingWeeks * 7, unit: "1 per day", tooltip: `${(remainingWeeks * 7).toLocaleString()} days` },
		{ key: "hugs", emoji: "🤗", label: "hugs to give", baseValue: remainingWeeks * 7 * 3, unit: "3 per day", tooltip: `${(remainingWeeks * 7).toLocaleString()} days × 3` },
		{ key: "sundays", emoji: "☕", label: "chill Sundays", baseValue: remainingWeeks, unit: "1 per week", tooltip: `${remainingWeeks.toLocaleString()} weeks` },
	];

	// Only allocatable stats use weights; sunsets/hugs/sundays always use base value
	const NON_WEIGHTED = new Set(["sunsets", "hugs", "sundays"]);
	const allocatableStats = statDefs.filter((s) => !NON_WEIGHTED.has(s.key));
	const totalWeights = allocatableStats.reduce((s, stat) => s + (weights[stat.key] ?? 0), 0);
	const equalWeight = totalWeights / allocatableStats.length;

	return (
		<div className="flex flex-col gap-2 h-full overflow-y-auto pr-1 scrollbar-thin">
			{/* Activity summary */}
			<div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[9px] text-muted-foreground">
				<span>{ACTIVITY_EMOJIS.sleep} <span style={{ color: ACTIVITY_COLORS.sleep }}>{activityBreakdown.sleep.toLocaleString()}</span> wks</span>
				<span>{ACTIVITY_EMOJIS.commute} <span style={{ color: ACTIVITY_COLORS.commute }}>{activityBreakdown.commute.toLocaleString()}</span> wks</span>
				<span>{ACTIVITY_EMOJIS.admin} <span style={{ color: ACTIVITY_COLORS.admin }}>{activityBreakdown.admin.toLocaleString()}</span> wks</span>
				<span className="text-white/70 font-medium">{activityBreakdown.free.toLocaleString()} free wks</span>
				<span className="text-white/50">{totalFreeHoursWithRetirement.toLocaleString()} hrs</span>
			</div>

			{/* Bento grid */}
			<div className="grid grid-cols-2 gap-1.5">
				{statDefs.map((stat) => {
					const isNonWeighted = NON_WEIGHTED.has(stat.key);
					const w = isNonWeighted ? equalWeight : (weights[stat.key] ?? equalWeight);
					const scale = isNonWeighted ? 1 : (w / equalWeight);
					const value = Math.floor(stat.baseValue * scale);
					const isHovered = hoveredKey === stat.key;
					const isDimmed = !isNonWeighted && scale < 0.1;

					return (
						<div
							key={stat.key}
							className={`relative rounded-lg px-2 py-1.5 cursor-default transition-all duration-150 ${
								isDimmed
									? "opacity-30 bg-white/[0.02]"
									: "bg-white/[0.04] hover:bg-white/[0.08]"
							}`}
							onMouseEnter={() => setHoveredKey(stat.key)}
							onMouseLeave={() => setHoveredKey(null)}
						>
							<div className="flex items-baseline gap-1">
								<span className="text-[10px]">{stat.emoji}</span>
								<span className="text-base font-bold text-white leading-none">
									{value.toLocaleString()}
								</span>
							</div>
							<div className="text-[9px] text-muted-foreground leading-tight mt-0.5">
								{stat.label}
							</div>

							{/* Hover tooltip */}
							{isHovered && (
								<div className="absolute z-50 left-0 right-0 -bottom-1 translate-y-full bg-zinc-900 border border-white/10 rounded-md px-2 py-1.5 text-[9px] text-muted-foreground shadow-lg pointer-events-none">
									<div className="text-white/70 font-medium mb-0.5">{stat.tooltip}</div>
									<div>{stat.unit}</div>
									{Math.abs(scale - 1) > 0.05 && (
										<div className="text-orange-400 mt-0.5">Weight: {Math.round(w)}/{Math.round(equalWeight)} pts</div>
									)}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default BentoStats;
export type { BentoStatsProps };
