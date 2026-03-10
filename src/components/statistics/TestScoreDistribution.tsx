import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/layout/Card";
import { Skeleton } from "@/components/ui/data/Skeleton";
import { TestStatistics } from "@/hooks/test/useTestStatistics";

interface ScoreRange {
	name: string;
	count: number;
}

interface TestScoreDistributionProps {
	statistics: TestStatistics | null;
	isLoading: boolean;
	error: unknown;
}

const TestScoreDistribution: React.FC<TestScoreDistributionProps> = ({
	statistics,
	isLoading,
	error,
}) => {
	const formatDistributionData = (
		distribution: Record<string, number> | null | undefined
	): ScoreRange[] => {
		if (!distribution) return [];

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

		return ranges.map((range) => ({
			name: range,
			count: distribution[range] || 0,
		}));
	};

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>
						<Skeleton className="h-8 w-40" />
					</CardTitle>
					<CardDescription>
						<Skeleton className="h-4 w-60" />
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Skeleton className="h-[300px] w-full" />
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Error Loading Statistics</CardTitle>
					<CardDescription>
						There was an error loading the test score distribution.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-red-500">Please try again later.</p>
				</CardContent>
			</Card>
		);
	}

	if (!statistics || !statistics.score_distribution) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>No Data Available</CardTitle>
					<CardDescription>
						There is no score distribution data available for this test yet.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						This could be because no one has taken this test or the statistics have not
						been calculated yet.
					</p>
				</CardContent>
			</Card>
		);
	}

	const data = formatDistributionData(statistics.score_distribution);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Score Distribution</CardTitle>
				<CardDescription>
					{statistics.title} - Average Score:{" "}
					{statistics.score_average ? `${statistics.score_average}%` : "N/A"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="h-[300px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={data}
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis allowDecimals={false} />
							{/* Removed Tooltip to disable hover interaction */}
							<Bar dataKey="count" name="Number of Students" fill="#8884d8" />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
};

export default TestScoreDistribution;
