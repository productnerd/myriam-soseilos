import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/Card";
import { Button } from "@/components/ui/interactive/Button";
import { Copy, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/ui/useToast";

interface ValidationLogsProps {
	logs: string[];
	error?: string | null;
}

const ValidationLogs: React.FC<ValidationLogsProps> = ({ logs, error }) => {
	const copyLogs = () => {
		const allLogs = logs.join("\n");
		navigator.clipboard.writeText(allLogs);
		toast({ title: "Logs copied to clipboard" });
	};

	if (logs.length === 0 && !error) {
		return null;
	}

	return (
		<Card className="mt-4 border-orange-200 bg-orange-50">
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<CardTitle className="text-sm flex items-center gap-2">
						<AlertTriangle className="h-4 w-4 text-orange-600" />
						AI Validation Debug Logs
					</CardTitle>
					<Button
						variant="outline"
						size="sm"
						onClick={copyLogs}
						className="flex items-center gap-2"
					>
						<Copy className="h-3 w-3" />
						Copy
					</Button>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				{error && (
					<div className="mb-2 p-2 bg-red-100 border border-red-200 rounded text-red-700 text-sm">
						<strong>Error:</strong> {error}
					</div>
				)}
				<div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono max-h-40 overflow-y-auto">
					{logs.map((log, index) => (
						<div key={index} className="mb-1">
							{log}
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default ValidationLogs;
