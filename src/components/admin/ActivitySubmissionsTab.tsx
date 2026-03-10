import React, { useState, useEffect } from "react";
import { ActivitySubmission } from "@/types/activity";
import { useActivitySubmissions } from "@/hooks/admin/useActivitySubmissions";
import SubmissionsList from "./activity-submissions/SubmissionsList";
import SubmissionDetails from "./activity-submissions/SubmissionDetails";

const ActivitySubmissionsTab: React.FC = () => {
	const [selectedSubmission, setSelectedSubmission] = useState<ActivitySubmission | null>(null);
	

	const {
		submissions = [],
		isLoading,
		error,
		approve,
		reject,
		isApproving,
		isRejecting,
	} = useActivitySubmissions();

	useEffect(() => {
		if (submissions?.length > 0 && !selectedSubmission) {
			setSelectedSubmission(submissions[0]);
		}
	}, [submissions, selectedSubmission]);

	const handleApprove = (submission: ActivitySubmission, darkPoints = 1) => {
		approve(
			{
				id: submission.id,
				darkPoints,
			},
			{
				onSuccess: () => {
					moveToNextSubmission();
				},
			}
		);
	};

	const handleReject = (submission: ActivitySubmission) => {
		reject(
			{
				id: submission.id,
				comment: submission.admin_comment,
			},
			{
				onSuccess: () => {
					moveToNextSubmission();
				},
			}
		);
	};

	const moveToNextSubmission = () => {
		if (!selectedSubmission || !submissions) return;

		const currentIndex = submissions.findIndex((s) => s.id === selectedSubmission.id);
		if (currentIndex === -1) return;

		const nextSubmission = submissions[currentIndex + 1] || submissions[0];
		if (nextSubmission) {
			setSelectedSubmission(nextSubmission);
		} else {
			setSelectedSubmission(null);
		}
	};

	if (isLoading) {
		return <div className="p-6 text-center">Loading submissions...</div>;
	}

	if (error) {
		return (
			<div className="p-6 text-center text-red-500">
				Error loading submissions: {String(error)}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div className="md:col-span-1 border rounded-md p-4 max-h-[80vh] overflow-auto">
				<SubmissionsList
					submissions={submissions}
					selectedSubmission={selectedSubmission}
					onSelectSubmission={setSelectedSubmission}
				/>
			</div>

			<div className="md:col-span-2">
				{selectedSubmission ? (
					<SubmissionDetails
						submission={selectedSubmission}
						onSubmissionChange={setSelectedSubmission}
						onApprove={handleApprove}
						onReject={handleReject}
						isApproving={isApproving}
						isRejecting={isRejecting}
					/>
				) : (
					<div className="flex h-full items-center justify-center border rounded-md p-6">
						<div className="text-center text-muted-foreground">
							{submissions.length > 0 ? (
								<p>Select a submission to review</p>
							) : (
								<div className="p-8">
									<p className="text-lg font-medium mb-2">All caught up!</p>
									<p>No pending submissions to review</p>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ActivitySubmissionsTab;
