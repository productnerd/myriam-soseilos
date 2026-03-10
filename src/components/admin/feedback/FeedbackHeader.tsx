import React from "react";
import { Badge } from "@/components/ui/data/Badge";

interface FeedbackHeaderProps {
	totalCount: number;
	pendingCount: number;
}

const FeedbackHeader: React.FC<FeedbackHeaderProps> = ({ totalCount, pendingCount }) => {
	return (
		<div className="flex items-center justify-between mb-6">
			<div className="flex items-center gap-4">
				<h2 className="text-2xl font-bold">User Feedback</h2>
				<div className="flex gap-2">
					<Badge variant="secondary">Total: {totalCount}</Badge>
					<Badge variant="destructive">Pending: {pendingCount}</Badge>
				</div>
			</div>
		</div>
	);
};

export default FeedbackHeader;
