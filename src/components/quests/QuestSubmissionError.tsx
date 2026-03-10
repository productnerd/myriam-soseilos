import React from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/interactive/Button";

interface QuestSubmissionErrorProps {
	message: string;
	onRetry: () => void;
}

const QuestSubmissionError: React.FC<QuestSubmissionErrorProps> = ({ message, onRetry }) => {
	return (
		<div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
			<div className="flex items-center">
				<AlertCircle className="h-5 w-5 text-red-500 mr-2" />
				<p className="text-red-700 font-medium">Submission Error</p>
			</div>
			<p className="text-red-600 mt-2 text-sm">{message}</p>
			<div className="mt-3">
				<Button
					variant="outline"
					size="sm"
					className="flex items-center text-red-600 hover:text-red-700 border-red-300"
					onClick={onRetry}
				>
					<RefreshCcw className="h-4 w-4 mr-1" />
					<span>Retry Submission</span>
				</Button>
			</div>
		</div>
	);
};

export default QuestSubmissionError;
