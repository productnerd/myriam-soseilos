import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/layout/Card";
import { useTestStatistics } from "@/hooks/test/useTestStatistics";
import { Skeleton } from "@/components/ui/data/Skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedScoreDistributionChartProps {
	testId: string;
	finalScore: number;
	courseColor?: string;
}

const AnimatedScoreDistributionChart: React.FC<AnimatedScoreDistributionChartProps> = ({
	testId,
	finalScore,
	courseColor = "blue",
}) => {
	const { data: testStats, isLoading } = useTestStatistics(testId);
	const [animationComplete, setAnimationComplete] = useState(false);

	useEffect(() => {
		// After a delay, show the animation completed state
		const timer = setTimeout(() => {
			setAnimationComplete(true);
		}, 1500);

		return () => clearTimeout(timer);
	}, []);

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>
						<Skeleton className="h-6 w-40" />
					</CardTitle>
					<CardDescription>
						<Skeleton className="h-4 w-60" />
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Skeleton className="h-[200px] w-full" />
				</CardContent>
			</Card>
		);
	}

	if (!testStats || !testStats.score_distribution) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Score Distribution</CardTitle>
					<CardDescription>No data available for this test yet.</CardDescription>
				</CardHeader>
				<CardContent className="h-[200px] flex items-center justify-center text-muted-foreground">
					<p>Not enough data to show distribution.</p>
				</CardContent>
			</Card>
		);
	}

	// Format distribution data for the chart
	const formatDistributionData = (distribution: Record<string, number>) => {
		const ranges = [
			"0-10",
			"11-20",
			"21-30",
			"31-40",
			"41-50",
			"51-60",
			"61-70",
			"71-80",
			"81-90",
			"91-100",
		];

		return ranges.map((range) => {
			// Find which range the user's score falls into
			const rangeStart = parseInt(range.split("-")[0]);
			const rangeEnd = parseInt(range.split("-")[1]);
			const isUserScoreRange = finalScore >= rangeStart && finalScore <= rangeEnd;

			return {
				name: range,
				count: distribution[range] || 0,
				isUserScore: isUserScoreRange,
			};
		});
	};

	const data = formatDistributionData(testStats.score_distribution);
	const barColor = courseColor?.startsWith("#")
		? courseColor
		: `var(--${courseColor || "primary"}-500, var(--primary))`;

	const highlightedBarColor = "#FF9500"; // Orange highlight color

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-base">Score Distribution</CardTitle>
					<CardDescription className="text-xs">
						Your score: {finalScore}% | Average:{" "}
						{testStats.score_average
							? Math.round(testStats.score_average) + "%"
							: "N/A"}
					</CardDescription>
				</CardHeader>
				<CardContent className="pt-2">
					<div className="h-[200px]">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={data}
								margin={{
									top: 5,
									right: 5,
									left: 0,
									bottom: 20,
								}}
							>
								<XAxis
									dataKey="name"
									tick={{ fontSize: 10 }}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis hide={true} />
								<Bar
									dataKey="count"
									radius={[4, 4, 0, 0]}
									maxBarSize={30}
									animationBegin={300}
									animationDuration={1000}
									isAnimationActive={true}
									className="opacity-70"
									fill={barColor}
								>
									{data.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={
												entry.isUserScore ? highlightedBarColor : barColor
											}
											className={cn(
												entry.isUserScore && animationComplete
													? "animate-pulse"
													: ""
											)}
										/>
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default AnimatedScoreDistributionChart;
