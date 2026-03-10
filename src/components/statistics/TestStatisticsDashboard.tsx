import React from "react";
import { useAllTestStatistics } from "@/hooks/test/useTestStatistics";
import TestScoreDistribution from "./TestScoreDistribution";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/Tabs";
import { Skeleton } from "@/components/ui/data/Skeleton";

const TestStatisticsDashboard: React.FC = () => {
	const { data: allTestStats, isLoading, error } = useAllTestStatistics();
	const [selectedTestId, setSelectedTestId] = React.useState<string | undefined>(undefined);

	React.useEffect(() => {
		if (allTestStats && allTestStats.length > 0 && !selectedTestId) {
			setSelectedTestId(allTestStats[0].id);
		}
	}, [allTestStats, selectedTestId]);

	if (isLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-10 w-full max-w-md" />
				<Skeleton className="h-[400px] w-full" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-4 border border-red-300 bg-red-50 rounded-md">
				<h2 className="text-lg font-semibold text-red-700">
					Error Loading Test Statistics
				</h2>
				<p className="text-red-600">
					There was a problem loading the test statistics. Please try again later.
				</p>
			</div>
		);
	}

	if (!allTestStats || allTestStats.length === 0) {
		return (
			<div className="p-4 border border-gray-200 bg-gray-50 rounded-md">
				<h2 className="text-lg font-semibold">No Test Statistics Available</h2>
				<p className="text-muted-foreground">
					There are no test statistics available yet. This could be because no tests have
					been taken or the statistics have not been calculated.
				</p>
			</div>
		);
	}

	const selectedTest = allTestStats.find((test) => test.id === selectedTestId) || null;

	return (
		<div className="space-y-6">
			<Tabs
				defaultValue={selectedTestId}
				value={selectedTestId}
				onValueChange={setSelectedTestId}
				className="w-full"
			>
				<TabsList className="w-full max-w-md mb-4 overflow-x-auto flex-wrap">
					{allTestStats.map((test) => (
						<TabsTrigger key={test.id} value={test.id} className="flex-shrink-0">
							{test.title}
							{test.score_average && ` (${test.score_average}%)`}
						</TabsTrigger>
					))}
				</TabsList>

				{allTestStats.map((test) => (
					<TabsContent key={test.id} value={test.id}>
						<TestScoreDistribution statistics={test} isLoading={false} error={null} />
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
};

export default TestStatisticsDashboard;
