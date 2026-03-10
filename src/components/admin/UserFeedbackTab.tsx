import React from "react";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/data/Table";
import { useUserFeedback } from "@/hooks/admin/useUserFeedback";
import FeedbackList from "./feedback/FeedbackList";

const UserFeedbackTab: React.FC = () => {
	const { feedback = [], isLoading } = useUserFeedback();

	if (isLoading) {
		return <div className="p-6 text-center">Loading feedback...</div>;
	}

	return (
		<div className="space-y-6">
			<div className="border rounded-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>User</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Points</TableHead>
							<TableHead>Tags</TableHead>
							<TableHead className="max-w-md">Feedback</TableHead>
							<TableHead>Submitted</TableHead>
						</TableRow>
					</TableHeader>
					<FeedbackList feedback={feedback} />
				</Table>
			</div>
		</div>
	);
};

export default UserFeedbackTab;
