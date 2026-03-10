// TODO: This component is not used anywhere

import React, { useState, useEffect } from "react";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/Card";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/interactive/Button";
import { toast } from "sonner";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/layout/Accordion";

interface TestDiagnosticsProps {
	testId: string;
	isLevelTest?: boolean;
}

const TestDiagnostics: React.FC<TestDiagnosticsProps> = ({ testId, isLevelTest = false }) => {
	const [diagnosticData, setDiagnosticData] = useState<any>(null); // TODO: Replace 'any' with test diagnostics type
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// TODO: If this component is planned to be used and will not be rendered from a protected route, need to have a '!user' check.
	const { user } = useUserContext();

	// Load diagnostics automatically when component mounts
	useEffect(() => {
		const loadData = async () => {
			setIsLoading(true);
			try {
				// Fetch basic test information
				const { data: testInfo, error: testError } = await supabase
					.from("tests")
					.select("*")
					.eq("id", testId)
					.single();

				if (testError) {
					console.error("Error fetching test info:", testError);
					throw testError;
				}

				// Fetch user test scores
				const { data: userTestScores, error: scoresError } = await supabase
					.from("user_test_scores")
					.select("*")
					.eq("test_id", testId)
					.eq("user_id", user.id)
					.order("completed_at", { ascending: false })
					.limit(5);

				if (scoresError) {
					console.error("Error fetching user test scores:", scoresError);
				}

				// Combine all diagnostic information
				const diagnostics = {
					testInfo: testInfo || null,
					userTestScores: userTestScores || [],
				};

				setDiagnosticData(diagnostics);
			} catch (error) {
				console.error("Error loading diagnostics:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (testId) {
			loadData();
		}
	}, [testId, user.id]);

	const copyDiagnostics = () => {
		if (!diagnosticData) return;

		const text = JSON.stringify(diagnosticData, null, 2);
		navigator.clipboard.writeText(text);
		toast.success("Diagnostics copied to clipboard");
	};

	return (
		<Card className="mt-4 bg-muted/30">
			<CardHeader className="pb-2">
				<CardTitle className="text-sm flex justify-between">
					<span>Test Diagnostics (Debug Only)</span>
					<div className="flex space-x-2">
						<Button
							variant="ghost"
							size="icon"
							className="h-6 w-6"
							onClick={copyDiagnostics}
							disabled={!diagnosticData || isLoading}
						>
							<Copy className="h-4 w-4" />
							<span className="sr-only">Copy</span>
						</Button>
					</div>
				</CardTitle>
			</CardHeader>
			{isLoading ? (
				<CardContent className="text-center py-4">
					<p className="text-xs text-muted-foreground">Loading diagnostics...</p>
				</CardContent>
			) : diagnosticData ? (
				<CardContent className="text-xs">
					<Accordion type="single" collapsible defaultValue="item-1">
						<AccordionItem value="item-1">
							<AccordionTrigger className="text-xs py-1">
								Test Information
							</AccordionTrigger>
							<AccordionContent>
								<pre className="overflow-auto max-h-32 p-2 bg-muted rounded-md">
									{JSON.stringify(diagnosticData.testInfo, null, 2)}
								</pre>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="item-3">
							<AccordionTrigger className="text-xs py-1">
								User Test Scores
							</AccordionTrigger>
							<AccordionContent>
								<pre className="overflow-auto max-h-48 p-2 bg-muted rounded-md">
									{JSON.stringify(diagnosticData.userTestScores, null, 2)}
								</pre>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</CardContent>
			) : (
				<CardContent className="text-center py-4">
					<p className="text-xs text-muted-foreground">No diagnostics available</p>
				</CardContent>
			)}
		</Card>
	);
};

export default TestDiagnostics;
