import { useMemo } from "react";
import { differenceInWeeks } from "date-fns";

export type LifeStage = "early-years" | "education" | "retirement";

export type BoxStatus = "past" | "current" | "future";

export type ActivityType = "sleep" | "commute" | "admin" | "free";

export interface BoxData {
	index: number;
	row: number;
	col: number;
	status: BoxStatus;
	lifeStage: LifeStage | null;
	activity?: ActivityType;
	color: string;
}

export interface ActivityBreakdown {
	sleep: number;
	commute: number;
	admin: number;
	free: number;
}

export interface LifeInWeeksData {
	totalWeeks: number;
	weeksLived: number;
	currentWeekIndex: number;
	remainingWeeks: number;
	activityBreakdown: ActivityBreakdown;
	freeRemainingDays: number;
	freeRemainingHours: number;
	boxes: BoxData[];
}

const TOTAL_YEARS = 90;
const WEEKS_PER_YEAR = 52;
const TOTAL_WEEKS = TOTAL_YEARS * WEEKS_PER_YEAR;
const ADULTHOOD_AGE = 18;
const RETIREMENT_AGE = 70;

const HOURS_PER_DAY = {
	sleep: 7,
	commute: 1.5,
	admin: 0.5,
};

function getLifeStage(age: number): LifeStage | null {
	if (age < 5) return "early-years";
	if (age < ADULTHOOD_AGE) return "education";
	if (age >= RETIREMENT_AGE) return "retirement";
	return null;
}

export const LIFE_STAGE_COLORS: Record<LifeStage, string> = {
	"early-years": "#7DD3E1",
	education: "#6BBF6B",
	retirement: "#B39DDB",
};

export const ACTIVITY_COLORS: Record<ActivityType, string> = {
	sleep: "#4338CA",
	commute: "#DC2626",
	admin: "#D97706",
	free: "#FFFFFF",
};

export const ACTIVITY_EMOJIS: Record<ActivityType, string> = {
	sleep: "\u{1F634}",
	commute: "\u{1F697}",
	admin: "\u{1F4CB}",
	free: "\u2728",
};

export const PAST_COLOR = "#4A4A4A";

/** Mix a hex color toward #1E1A15 (the dark background) by a factor (0=original, 1=background) */
function dimColor(hex: string, factor: number): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	const br = 30, bg = 26, bb = 21;
	const mr = Math.round(r + (br - r) * factor);
	const mg = Math.round(g + (bg - g) * factor);
	const mb = Math.round(b + (bb - b) * factor);
	return `#${mr.toString(16).padStart(2, "0")}${mg.toString(16).padStart(2, "0")}${mb.toString(16).padStart(2, "0")}`;
}

export function useLifeInWeeks(
	dob: Date,
	showPhases: boolean,
	showUsefulTime: boolean,
): LifeInWeeksData {
	return useMemo(() => {
		const now = new Date();
		const weeksLived = Math.min(differenceInWeeks(now, dob), TOTAL_WEEKS);
		const currentWeekIndex = Math.max(0, Math.min(weeksLived, TOTAL_WEEKS - 1));
		const remainingWeeks = Math.max(0, TOTAL_WEEKS - weeksLived - 1);

		// Step 1: Build base box data
		const boxes: BoxData[] = [];
		for (let i = 0; i < TOTAL_WEEKS; i++) {
			const row = Math.floor(i / WEEKS_PER_YEAR);
			const col = i % WEEKS_PER_YEAR;
			let status: BoxStatus;
			if (i < currentWeekIndex) status = "past";
			else if (i === currentWeekIndex) status = "current";
			else status = "future";

			boxes.push({
				index: i,
				row,
				col,
				status,
				lifeStage: getLifeStage(row),
				color: "",
			});
		}

		// Step 2: Assign activities sequentially to future adult (18-70) boxes
		// Activities go right after current week: sleep → commute → admin → free
		// Early years, education, and retirement get NO activities
		const adultFutureIndices: number[] = [];
		for (const box of boxes) {
			if (box.status === "future" && box.lifeStage === null) {
				adultFutureIndices.push(box.index);
			}
		}

		const n = adultFutureIndices.length;
		const sleepCount = Math.round((n * HOURS_PER_DAY.sleep) / 24);
		const commuteCount = Math.round((n * HOURS_PER_DAY.commute) / 24);
		const adminCount = Math.round((n * HOURS_PER_DAY.admin) / 24);

		const activityMap = new Map<number, ActivityType>();
		if (showUsefulTime) {
			for (let j = 0; j < n; j++) {
				const idx = adultFutureIndices[j];
				if (j < sleepCount) {
					activityMap.set(idx, "sleep");
				} else if (j < sleepCount + commuteCount) {
					activityMap.set(idx, "commute");
				} else if (j < sleepCount + commuteCount + adminCount) {
					activityMap.set(idx, "admin");
				} else {
					activityMap.set(idx, "free");
				}
			}
		}

		// Step 3: Assign colors
		let totalSleep = 0, totalCommute = 0, totalAdmin = 0, totalFree = 0;

		for (const box of boxes) {
			const activity = activityMap.get(box.index);
			if (activity) box.activity = activity;

			if (box.status === "current") {
				box.color = "#FFFFFF";
			} else if (box.status === "past") {
				if (showPhases && box.lifeStage) {
					box.color = dimColor(LIFE_STAGE_COLORS[box.lifeStage], 0.3);
				} else {
					box.color = PAST_COLOR;
				}
			} else {
				// Future box
				const hasPhaseColor = box.lifeStage !== null;

				if (showPhases && showUsefulTime) {
					if (hasPhaseColor) {
						box.color = LIFE_STAGE_COLORS[box.lifeStage!];
					} else if (activity && activity !== "free") {
						box.color = ACTIVITY_COLORS[activity];
					} else {
						box.color = "#FFFFFF";
					}
				} else if (showPhases) {
					if (hasPhaseColor) {
						box.color = LIFE_STAGE_COLORS[box.lifeStage!];
					} else {
						box.color = "#FFFFFF";
					}
				} else if (showUsefulTime) {
					if (hasPhaseColor) {
						// Childhood / retirement greyed out in useful-time-only mode
						box.color = PAST_COLOR;
					} else if (activity && activity !== "free") {
						box.color = ACTIVITY_COLORS[activity];
					} else {
						box.color = "#FFFFFF";
					}
				} else {
					box.color = dimColor("#FFFFFF", 0.7);
				}
			}

			if (activity === "sleep") totalSleep++;
			else if (activity === "commute") totalCommute++;
			else if (activity === "admin") totalAdmin++;
			else if (activity === "free") totalFree++;
		}

		// Free time calculation for adult period (18-70)
		const freeHoursPerDay = 24 - HOURS_PER_DAY.sleep - HOURS_PER_DAY.commute - HOURS_PER_DAY.admin;
		const adultFutureDays = n * 7;
		const freeRemainingDays = adultFutureDays;
		const freeRemainingHours = Math.round(adultFutureDays * freeHoursPerDay);

		return {
			totalWeeks: TOTAL_WEEKS,
			weeksLived,
			currentWeekIndex,
			remainingWeeks,
			activityBreakdown: {
				sleep: totalSleep,
				commute: totalCommute,
				admin: totalAdmin,
				free: totalFree,
			},
			freeRemainingDays,
			freeRemainingHours,
			boxes,
		};
	}, [dob, showPhases, showUsefulTime]);
}
