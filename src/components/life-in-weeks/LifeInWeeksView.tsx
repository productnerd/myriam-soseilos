import React, { useMemo } from "react";
import { useLifeInWeeks } from "@/hooks/life-in-weeks/useLifeInWeeks";
import WeeksGrid from "./WeeksGrid";
import Legend from "./Legend";
import BentoStats from "./BentoStats";
import WeightAllocator from "./WeightAllocator";

interface LifeInWeeksViewProps {
	dob: Date;
	showPhases: boolean;
	showUsefulTime: boolean;
	weights: Record<string, number>;
	onWeightsChange: (weights: Record<string, number>) => void;
}

const ROWS = 90;
const COLS = 52;
const GAP = 1;
const HEADER_HEIGHT = 80;
const LEGEND_HEIGHT = 32;
const AGE_LABEL_WIDTH = 20;
const BENTO_WIDTH = 260;
const PADDING = 32;
const GAPS = 24;

const LifeInWeeksView: React.FC<LifeInWeeksViewProps> = ({
	dob,
	showPhases,
	showUsefulTime,
	weights,
	onWeightsChange,
}) => {
	const data = useLifeInWeeks(dob, showPhases, showUsefulTime);

	const { boxSize, gridHeight, gridWidth } = useMemo(() => {
		const vh = window.innerHeight;
		const vw = window.innerWidth;
		const availH = vh - HEADER_HEIGHT - LEGEND_HEIGHT - PADDING - GAPS;
		const availW = vw - AGE_LABEL_WIDTH - BENTO_WIDTH - PADDING - GAPS;
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
			{/* Grid + Bento row */}
			<div className="flex gap-3 justify-center items-start flex-1 min-h-0">
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

				{/* Bento stats panel */}
				<div className="shrink-0 flex flex-col gap-1" style={{ width: BENTO_WIDTH, maxHeight: gridHeight }}>
					<div className="flex items-center justify-between">
						<span className="text-[9px] uppercase tracking-wider text-muted-foreground/40 font-semibold">
							What you can still do
						</span>
						<WeightAllocator weights={weights} onChange={onWeightsChange} />
					</div>
					<BentoStats
						remainingWeeks={data.remainingWeeks}
						activityBreakdown={data.activityBreakdown}
						freeRemainingDays={data.freeRemainingDays}
						totalFreeHoursWithRetirement={data.totalFreeHoursWithRetirement}
						remainingYears={data.remainingYears}
						weights={weights}
					/>
				</div>
			</div>

			{/* Legend — horizontal, below grid */}
			<div className="shrink-0">
				<Legend showPhases={showPhases} showUsefulTime={showUsefulTime} />
			</div>
		</div>
	);
};

export default LifeInWeeksView;
