import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/layout/Card";
import { Textarea } from "@/components/ui/form/Textarea";
import { Button } from "@/components/ui/interactive/Button";
import { Copy, Upload, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { useActivityImport, ActivityImportData } from "@/hooks/admin/activity-import"; // Updated import path
import { ActivityImportStatus } from "./ActivityImportStatus";
import { jsonExampleStructure, supportedActivityTypes } from "./jsonStructureExample";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/layout/Collapsible";
import { ACTIVITY_TYPE_NAMES } from "@/utils/activities/activityDefinitions";

const CourseCreationTab: React.FC = () => {
	const [jsonInput, setJsonInput] = useState<string>("");
	const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(false);
	const { importActivities, importStatus, isImporting, error, resetStatus } = useActivityImport();

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setJsonInput(e.target.value);
	};

	const handleImport = async () => {
		if (!jsonInput.trim()) {
			toast.error("Please enter JSON data");
			return;
		}

		try {
			// Parse JSON to validate format before sending
			const parsedJson = JSON.parse(jsonInput) as ActivityImportData;

			// Basic validation before sending to the backend
			if (!parsedJson.activities || !Array.isArray(parsedJson.activities)) {
				toast.error('Invalid JSON: must contain an "activities" array');
				return;
			}

			if (parsedJson.activities.length === 0) {
				toast.error("No activities found in the JSON");
				return;
			}

			await importActivities(parsedJson);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Unknown error";
			toast.error(`Invalid JSON format: ${errorMessage}`);
			console.error("JSON parse error:", err);
		}
	};

	const copyJsonStructure = () => {
		navigator.clipboard.writeText(JSON.stringify(jsonExampleStructure, null, 2));
		toast.success("JSON structure copied to clipboard");
	};

	const toggleInstructions = () => {
		setIsInstructionsOpen(!isInstructionsOpen);
	};

	return (
		<div className="container mx-auto">
			<div className="mb-6 flex items-center justify-between flex-wrap gap-4">
				<h1 className="text-3xl font-bold">Course Creation</h1>
				<div className="flex flex-wrap gap-2">
					<Button
						variant="outline"
						onClick={toggleInstructions}
						className="flex items-center gap-2"
					>
						<HelpCircle size={16} />
						{isInstructionsOpen ? "Hide Instructions" : "Show Instructions"}
					</Button>
					<Button
						variant="outline"
						onClick={copyJsonStructure}
						className="flex items-center gap-2"
					>
						<Copy size={16} /> Copy JSON Structure
					</Button>
				</div>
			</div>

			<Collapsible
				open={isInstructionsOpen}
				onOpenChange={setIsInstructionsOpen}
				className="mb-6"
			>
				<CollapsibleContent>
					<Card>
						<CardHeader>
							<CardTitle>Activity Types Reference</CardTitle>
							<CardDescription>
								All supported activity types and their expected JSON structure
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{Object.entries(supportedActivityTypes).map(
									([type, description]) => (
										<div key={type} className="border rounded-md p-3">
											<h3 className="font-medium">
												{ACTIVITY_TYPE_NAMES[type] || type}
											</h3>
											<p className="text-sm text-muted-foreground">
												{description}
											</p>
										</div>
									)
								)}
							</div>
							<div className="mt-4 p-3 bg-muted/50 rounded-md">
								<h3 className="font-medium mb-2">Required Fields:</h3>
								<ul className="list-disc pl-5 space-y-1 text-sm">
									<li>
										<strong>topic_id:</strong> UUID of the topic where the
										activity belongs
									</li>
									<li>
										<strong>type:</strong> Activity type from the list above
									</li>
									<li>
										<strong>main_text:</strong> The main question or content
										text
									</li>
									<li>
										<strong>correct_answer:</strong> The correct answer
										(optional for polls)
									</li>
									<li>
										<strong>explanation:</strong> Explanation shown after
										answering (optional)
									</li>
									<li>
										<strong>options:</strong> Array of options (required for
										choice-based questions)
									</li>
								</ul>
							</div>
						</CardContent>
					</Card>
				</CollapsibleContent>
			</Collapsible>

			<Card>
				<CardHeader>
					<CardTitle>Import Activities from JSON</CardTitle>
					<CardDescription>
						Paste JSON data with activities to import them into the database
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Textarea
						className="min-h-[300px] font-mono text-sm"
						placeholder="Paste JSON data here..."
						value={jsonInput}
						onChange={handleInputChange}
						disabled={isImporting}
					/>

					<div className="mt-4 flex items-center gap-4">
						<Button
							onClick={handleImport}
							disabled={isImporting || !jsonInput.trim()}
							className="flex items-center gap-2"
						>
							<Upload size={16} />
							{isImporting ? "Importing..." : "Import Activities"}
						</Button>

						{importStatus.totalActivities > 0 && (
							<Button variant="outline" onClick={resetStatus}>
								Reset
							</Button>
						)}
					</div>

					<ActivityImportStatus status={importStatus} error={error} />
				</CardContent>
			</Card>
		</div>
	);
};

export default CourseCreationTab;
