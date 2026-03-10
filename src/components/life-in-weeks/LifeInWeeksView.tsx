import React, { useMemo } from "react";
import { useLifeInWeeks } from "@/hooks/life-in-weeks/useLifeInWeeks";
import WeeksGrid from "./WeeksGrid";
import Legend from "./Legend";
import SummaryStats from "./SummaryStats";

interface LifeInWeeksViewProps {
	dob: Date;
	showPhases: boolean;
	showUsefulTime: boolean;
}

const ROWS = 90;
const COLS = 52;
const GAP = 1;
const HEADER_HEIGHT = 80;
const STATS_HEIGHT = 80;
const AGE_LABEL_WIDTH = 20;
const LEGEND_WIDTH = 140;
const PADDING = 32;
const GAPS = 24;

const LifeInWeeksView: React.FC<LifeInWeeksViewProps> = ({ dob, showPhases, showUsefulTime }) => {
	const data = useLifeInWeeks(dob, showPhases, showUsefulTime);

	const { boxSize, gridHeight, gridWidth } = useMemo(() => {
		const vh = window.innerHeight;
		const vw = window.innerWidth;
		const availH = vh - HEADER_HEIGHT - STATS_HEIGHT - PADDING - GAPS;
		const availW = vw - AGE_LABEL_WIDTH - LEGEND_WIDTH - PADDING - GAPS;
		const fromHeight = (availH - (ROWS - 1) * GAP) / ROWS;
		const fromWidth = (availW - (COLS - 1) * GAP) / COLS;
		const bs = Math.max(2, Math.floor(Math.min(fromHeight, fromWidth)));
		return {
			boxSize: bs,
			gridHeight: bs * ROWS + (ROWS - 1) * GAP,
			gridWidth: bs * COLS + (COLS - 1) * GAP,
		};
	}, []);

	return (
		<div className="flex flex-col flex-1 min-h-0 gap-1">
			{/* Grid + Legend row */}
			<div className="flex gap-4 justify-center items-start">
				{/* Age labels */}
				<div
					className="flex flex-col justify-between text-[7px] text-muted-foreground/50 shrink-0 select-none"
					style={{ width: "16px", height: gridHeight }}
				>
					{[0, 10, 20, 30, 40, 50, 60, 70, 80, 90].map((age) => (
						<span key={age} className="leading-none text-right">
							{age}
						</span>
					))}
				</div>

				{/* Grid */}
				<WeeksGrid
					boxes={data.boxes}
					currentWeekIndex={data.currentWeekIndex}
					boxSize={boxSize}
				/>

				{/* Legend */}
				<div className="shrink-0" style={{ width: LEGEND_WIDTH }}>
					<Legend showPhases={showPhases} showUsefulTime={showUsefulTime} />
				</div>
			</div>

			{/* Summary Stats */}
			{showUsefulTime && (
				<div className="shrink-0">
					<SummaryStats
						remainingWeeks={data.remainingWeeks}
						activityBreakdown={data.activityBreakdown}
						freeRemainingDays={data.freeRemainingDays}
						freeRemainingHours={data.freeRemainingHours}
					/>
				</div>
			)}
		</div>
	);
};

export default LifeInWeeksView;
