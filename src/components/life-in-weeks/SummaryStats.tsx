import React from "react";
import {
	type ActivityBreakdown,
	ACTIVITY_EMOJIS,
	ACTIVITY_COLORS,
} from "@/hooks/life-in-weeks/useLifeInWeeks";

interface SummaryStatsProps {
	remainingWeeks: number;
	activityBreakdown: ActivityBreakdown;
	freeRemainingDays: number;
	freeRemainingHours: number;
	totalFreeHoursWithRetirement: number;
	remainingYears: number;
}

const SummaryStats: React.FC<SummaryStatsProps> = ({
	remainingWeeks,
	activityBreakdown,
	freeRemainingDays,
	freeRemainingHours,
	totalFreeHoursWithRetirement,
	remainingYears,
}) => {
	const funStats = [
		{ emoji: "🎯", value: Math.floor(totalFreeHoursWithRetirement / 10000), label: "skills to master" },
		{ emoji: "📚", value: Math.floor(totalFreeHoursWithRetirement / 6), label: "books to read" },
		{ emoji: "✈️", value: Math.floor(remainingYears * 2), label: "countries to visit" },
		{ emoji: "🗣️", value: Math.floor(totalFreeHoursWithRetirement / 1100), label: "languages to learn" },
		{ emoji: "🎸", value: Math.floor(totalFreeHoursWithRetirement / 2000), label: "instruments to play" },
		{ emoji: "💼", value: Math.floor(remainingYears / 6), label: "careers to explore" },
		{ emoji: "🎨", value: Math.floor(remainingYears / 2), label: "hobbies to master" },
		{ emoji: "👨‍🍳", value: remainingWeeks, label: "recipes to try" },
		{ emoji: "🛣️", value: Math.floor(remainingYears * 2), label: "road trips" },
		{ emoji: "👋", value: Math.floor(remainingYears * 3), label: "friendships to form" },
		{ emoji: "🌅", value: remainingWeeks * 7, label: "sunsets to watch" },
		{ emoji: "🤗", value: remainingWeeks * 7 * 3, label: "hugs to give" },
		{ emoji: "☕", value: remainingWeeks, label: "chill Sundays" },
	];

	return (
		<div className="flex flex-col items-center gap-0.5">
			{/* Activity breakdown + free time — single compact row */}
			<div className="flex items-center gap-2 flex-wrap justify-center text-[10px] text-muted-foreground">
				<span>{ACTIVITY_EMOJIS.sleep} <span style={{ color: ACTIVITY_COLORS.sleep }}>{activityBreakdown.sleep.toLocaleString()}</span> wks sleeping</span>
				<span>·</span>
				<span>{ACTIVITY_EMOJIS.commute} <span style={{ color: ACTIVITY_COLORS.commute }}>{activityBreakdown.commute.toLocaleString()}</span> wks commute</span>
				<span>·</span>
				<span>{ACTIVITY_EMOJIS.admin} <span style={{ color: ACTIVITY_COLORS.admin }}>{activityBreakdown.admin.toLocaleString()}</span> wks admin</span>
				<span>·</span>
				<span className="text-white font-semibold text-sm">{activityBreakdown.free.toLocaleString()}</span> free weeks
				<span>·</span>
				<span className="text-white/80 font-medium">{totalFreeHoursWithRetirement.toLocaleString()}</span> hours
			</div>

			{/* Fun context stats — compact wrapped grid */}
			<div className="flex items-center gap-x-2.5 gap-y-0 flex-wrap justify-center leading-tight">
				{funStats.map(({ emoji, value, label }) => (
					<span key={label} className="text-[10px]">
						{emoji} <span className="text-white font-medium">{value.toLocaleString()}</span>{" "}
						<span className="text-muted-foreground">{label}</span>
					</span>
				))}
			</div>
		</div>
	);
};

export default SummaryStats;
