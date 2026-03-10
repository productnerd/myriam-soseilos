import React from "react";
import type { BoxData } from "@/hooks/life-in-weeks/useLifeInWeeks";

const ROWS = 90;
const COLS = 52;
const GAP = 1;

interface WeeksGridProps {
	boxes: BoxData[];
	currentWeekIndex: number;
	boxSize: number;
}

const WeeksGrid: React.FC<WeeksGridProps> = React.memo(({ boxes, currentWeekIndex, boxSize }) => {
	const gridWidth = boxSize * COLS + (COLS - 1) * GAP;
	const gridHeight = boxSize * ROWS + (ROWS - 1) * GAP;

	return (
		<div
			className="weeks-grid"
			style={{
				display: "grid",
				gridTemplateColumns: `repeat(${COLS}, ${boxSize}px)`,
				gridTemplateRows: `repeat(${ROWS}, ${boxSize}px)`,
				gap: `${GAP}px`,
				width: gridWidth,
				height: gridHeight,
			}}
		>
			{boxes.map((box) => (
				<div
					key={box.index}
					className={`week-box${box.index === currentWeekIndex ? " week-current" : ""}`}
					style={{
						backgroundColor: box.color,
						animationDelay: `${box.index * 0.0004}s`,
						borderRadius: "1px",
					}}
				/>
			))}
		</div>
	);
});

WeeksGrid.displayName = "WeeksGrid";

export default WeeksGrid;
