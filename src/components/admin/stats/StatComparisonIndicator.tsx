import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatComparisonIndicatorProps {
	currentValue: number;
	previousValue?: number | null;
	percentageChange?: number | null;
	isPercentage?: boolean;
	invertColors?: boolean;
}

export default function StatComparisonIndicator({
	currentValue,
	previousValue,
	percentageChange,
	isPercentage = false,
	invertColors = false,
}: StatComparisonIndicatorProps) {
	if (
		previousValue === undefined ||
		previousValue === null ||
		percentageChange === undefined ||
		percentageChange === null
	) {
		return <div className="text-xs text-muted-foreground">-%</div>;
	}

	const isPositive = percentageChange > 0;
	// For metrics like churn rate, lower is better, so we invert the color logic
	const isGood = invertColors ? !isPositive : isPositive;
	const textColorClass = isGood ? "text-green-500" : "text-red-500";

	return (
		<div className={cn("text-xs flex items-center mt-1", textColorClass)}>
			{isPositive ? (
				<ArrowUpIcon className="h-3 w-3 mr-1" />
			) : (
				<ArrowDownIcon className="h-3 w-3 mr-1" />
			)}
			<span>
				{Math.abs(percentageChange).toFixed(1)}% vs last week (
				{isPercentage ? previousValue.toFixed(1) + "%" : previousValue})
			</span>
		</div>
	);
}
