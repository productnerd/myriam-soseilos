import { useEffect, useState } from "react";
import { Button } from "@/components/ui/interactive/Button";
import { toast } from "@/hooks/ui/useToast";
import { populateAllMissingTestActivities } from "@/utils/test-population";
import { fixAllTestActivities } from "@/utils/test-population/test-fix";
import type { PopulationResult } from "@/utils/test-population";
import type { TestFixResult } from "@/utils/test-population/test-fix/types";

const PopulateDatabasePage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isFixingTests, setIsFixingTests] = useState(false);
	const [message, setMessage] = useState("");
	const [results, setResults] = useState<PopulationResult[]>([]);
	const [fixResults, setFixResults] = useState<TestFixResult>(null);

	useEffect(() => {
		handlePopulate();
	}, []);

	const handlePopulate = async () => {
		setIsLoading(true);
		setMessage("Populating database...");
		setResults([]);

		try {
			const populationResults = await populateAllMissingTestActivities();
			setResults(populationResults);

			const successCount = populationResults.filter((r) => r.success).length;
			if (successCount === populationResults.length) {
				setMessage("Database populated successfully!");
				toast({
					title: "Success",
					description: `Successfully populated test activities for ${successCount} courses.`,
				});
			} else {
				setMessage(
					`Populated ${successCount} out of ${populationResults.length} courses. Check details below.`
				);
				toast({
					title: "Partial Success",
					description: `Populated ${successCount} out of ${populationResults.length} courses.`,
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error populating database:", error);
			setMessage("Error populating database. Check console for details.");
			toast({
				title: "Error",
				description: "Failed to populate database. See console for details.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleFixTests = async () => {
		setIsFixingTests(true);
		setMessage("Fixing tests to ensure each has exactly 5 activities...");
		setFixResults(null);

		try {
			const results = await fixAllTestActivities();
			setFixResults(results);

			if (results.success) {
				setMessage(
					`Tests fixed successfully! Fixed: ${results.fixed}, Already correct: ${results.alreadyCorrect}`
				);
				toast({
					title: "Success",
					description: `Fixed ${results.fixed} tests. ${results.alreadyCorrect} were already correct.`,
				});
			} else {
				setMessage(
					`Partially fixed tests. Fixed: ${results.fixed}, Failed: ${results.failed}, Already correct: ${results.alreadyCorrect}`
				);
				toast({
					title: "Partial Success",
					description: `Fixed ${results.fixed} tests, but failed on ${results.failed}.`,
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error fixing tests:", error);
			setMessage("Error fixing tests. Check console for details.");
			toast({
				title: "Error",
				description: "Failed to fix tests. See console for details.",
				variant: "destructive",
			});
		} finally {
			setIsFixingTests(false);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Database Population Tool</h1>

			<div className="flex flex-wrap gap-4 mb-6">
				<Button onClick={handlePopulate} disabled={isLoading || isFixingTests}>
					{isLoading ? "Populating..." : "Populate Test Activities Again"}
				</Button>

				<Button
					onClick={handleFixTests}
					disabled={isLoading || isFixingTests}
					variant="secondary"
				>
					{isFixingTests ? "Fixing Tests..." : "Fix Existing Tests (Ensure 5 Activities)"}
				</Button>
			</div>

			{message && <div className="p-4 bg-gray-100 rounded mb-4">{message}</div>}

			{results.length > 0 && (
				<div className="mt-4">
					<h2 className="text-xl font-semibold mb-2">Population Results:</h2>
					<ul className="space-y-2">
						{results.map((result, index) => (
							<li
								key={index}
								className={`p-3 rounded ${
									result.success ? "bg-green-100" : "bg-red-100"
								}`}
							>
								<span className="font-medium">{result.course}:</span>{" "}
								{result.success ? "Success" : "Failed"}
							</li>
						))}
					</ul>
				</div>
			)}

			{fixResults && (
				<div className="mt-4">
					<h2 className="text-xl font-semibold mb-2">Test Fixing Results:</h2>
					<div className="grid grid-cols-3 gap-4 mb-4">
						<div className="p-3 bg-green-100 rounded">
							<p className="font-bold text-center text-2xl">{fixResults.fixed}</p>
							<p className="text-center text-sm">Tests Fixed</p>
						</div>
						<div className="p-3 bg-blue-100 rounded">
							<p className="font-bold text-center text-2xl">
								{fixResults.alreadyCorrect}
							</p>
							<p className="text-center text-sm">Already Correct</p>
						</div>
						<div className="p-3 bg-red-100 rounded">
							<p className="font-bold text-center text-2xl">{fixResults.failed}</p>
							<p className="text-center text-sm">Failed to Fix</p>
						</div>
					</div>

					<h3 className="text-lg font-semibold mb-2">Test Details:</h3>
					<div className="max-h-60 overflow-y-auto border rounded p-2">
						<table className="w-full">
							<thead>
								<tr>
									<th className="text-left p-2">Test</th>
									<th className="text-center p-2">Activity Count</th>
									<th className="text-center p-2">Status</th>
								</tr>
							</thead>
							<tbody>
								{fixResults.testDetails.map((test: any, index: number) => (
									<tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
										<td className="p-2">{test.title}</td>
										<td className="text-center p-2">{test.activityCount}</td>
										<td
											className={`text-center p-2 ${
												test.fixed ? "text-green-600" : "text-gray-600"
											}`}
										>
											{test.fixed
												? "Fixed"
												: test.activityCount === 5
												? "Already Correct"
												: "Failed"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			<div className="mt-8">
				<h2 className="text-xl font-semibold mb-2">What this does:</h2>
				<ul className="list-disc ml-6">
					<li>Creates test activities for Career Development course</li>
					<li>Creates test activities for Personal Finance 2 course</li>
					<li>Links activities to the corresponding tests</li>
					<li>Ensures all tests have exactly 5 activities</li>
					<li>Makes sure that all test scores are never null</li>
				</ul>
			</div>
		</div>
	);
};

export default PopulateDatabasePage;
