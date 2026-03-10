import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import { useReviewFlow } from "@/hooks/review/useReviewFlow";
import { hasReviewActivities } from "@/utils/review/reviewUtils";
import { Loader2, CheckCircle, XCircle, Play } from "lucide-react";
import { Badge } from "@/components/ui/data/Badge";
import { Button } from "@/components/ui/interactive/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/Card";
import ReviewFlow from "@/components/review/flow/ReviewFlow";

/**
 * Review Test Page
 * This is a standalone test page to debug the review flow functionality.
 * It allows you to:
 * 1. Check if review activities are available
 * 2. Fetch and display review activities
 * 3. Test the review flow independently
 * 4. See detailed logging of what's happening
 */
const ReviewTestPage: React.FC = () => {
	const { user } = useUserContext();
	const [isCheckingReview, setIsCheckingReview] = useState<boolean>(false);
	const [hasReview, setHasReview] = useState<boolean | null>(null);
	const [showReviewFlow, setShowReviewFlow] = useState<boolean>(false);
	const [logs, setLogs] = useState<string[]>([]);
	const navigate = useNavigate();

	// Add a log entry
	const addLog = (message: string) => {
		const timestamp = new Date().toLocaleTimeString();
		setLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)]); // Keep last 20 logs
		console.log(`[ReviewTestPage] ${message}`);
	};

	// Check if review activities are available
	const checkReviewAvailability = async () => {
		setIsCheckingReview(true);
		addLog(`🔍 Checking review availability for user: ${user!.id}`);

		try {
			const available = await hasReviewActivities(user!.id);
			setHasReview(available);
			addLog(`✅ Review available: ${available}`);
		} catch (error) {
			addLog(`❌ Error checking review: ${error}`);
			setHasReview(false);
		} finally {
			setIsCheckingReview(false);
		}
	};

	// Start the review flow
	const startReviewFlow = () => {
		addLog("🎬 Starting review flow");
		setShowReviewFlow(true);
	};

	// Handle review completion
	const handleReviewComplete = () => {
		addLog("✅ Review flow completed");
		setShowReviewFlow(false);
		navigate("/learn");
	};

	// Handle moving to the next activity when the user clicks anywhere on the screen
	const handleScreenClick = (e: React.MouseEvent) => {
		if (reviewFlow.showFeedback) {
			e.preventDefault();
			e.stopPropagation();
			reviewFlow.handleAdvanceActivity();
		}
	};

	// Reset everything
	const reset = () => {
		addLog("🔄 Resetting test state");
		setHasReview(null);
		setShowReviewFlow(false);
		setLogs([]);
	};

	const reviewFlow = useReviewFlow(user?.id || null);

	// Add review flow logs only when review flow is active
	useEffect(() => {
		if (!showReviewFlow) return;

		if (reviewFlow.isLoading) {
			addLog("⏳ Review flow is loading...");
		}
		if (reviewFlow.error) {
			addLog(`❌ Review flow error: ${reviewFlow.error}`);
		}
		if (reviewFlow.reviewActivities.length > 0) {
			addLog(`📚 Review flow loaded ${reviewFlow.reviewActivities.length} activities`);
		}
		if (reviewFlow.reviewCompleted) {
			addLog("✅ Review flow completed");
		}
	}, [
		showReviewFlow,
		reviewFlow.isLoading,
		reviewFlow.error,
		reviewFlow.reviewActivities.length,
		reviewFlow.reviewCompleted,
	]);

	// If review flow is active, show the actual review content
	if (showReviewFlow) {
		return (
			<div
				className="min-h-screen bg-background"
				onClick={handleScreenClick}
				style={{ cursor: reviewFlow.showFeedback ? "pointer" : "default" }}
			>
				<div className="container mx-auto p-4">
					<div className="mb-4">
						<Button
							onClick={() => setShowReviewFlow(false)}
							variant="outline"
							size="sm"
						>
							← Back to Test Page
						</Button>
					</div>
					<ReviewFlow onComplete={handleReviewComplete} />
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 max-w-4xl">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">Review Flow Test Page</h1>
				<p className="text-muted-foreground">
					Test the review functionality independently from the main learning flow
				</p>
			</div>

			{/* User Info */}
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>User Information</CardTitle>
				</CardHeader>
				<CardContent>
					{user ? (
						<div className="space-y-2">
							<p>
								<strong>User ID:</strong> {user.id}
							</p>
							<p>
								<strong>Email:</strong> {user.email}
							</p>
						</div>
					) : (
						<p className="text-muted-foreground">No user logged in</p>
					)}
				</CardContent>
			</Card>

			{/* Test Controls */}
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Test Controls</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-4">
						<Button
							onClick={checkReviewAvailability}
							disabled={isCheckingReview || !user}
							className="flex items-center gap-2"
						>
							{isCheckingReview ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<CheckCircle className="h-4 w-4" />
							)}
							Check Review Availability
						</Button>

						<Button
							onClick={startReviewFlow}
							disabled={!hasReview || reviewFlow.reviewActivities.length === 0}
							variant="default"
							className="flex items-center gap-2"
						>
							<Play className="h-4 w-4" />
							Start Review Flow
						</Button>

						<Button
							onClick={reset}
							variant="destructive"
							className="flex items-center gap-2"
						>
							Reset Test
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Review Status */}
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Review Status</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<strong>Review Available:</strong>
							{hasReview === null ? (
								<span className="text-muted-foreground">Not checked</span>
							) : hasReview ? (
								<Badge variant="default" className="flex items-center gap-1">
									<CheckCircle className="h-3 w-3" />
									Yes
								</Badge>
							) : (
								<Badge variant="secondary" className="flex items-center gap-1">
									<XCircle className="h-3 w-3" />
									No
								</Badge>
							)}
						</div>

						<div className="flex items-center gap-2">
							<strong>Activities Fetched:</strong>
							<Badge variant="outline">{reviewFlow.reviewActivities.length}</Badge>
						</div>

						<div className="flex items-center gap-2">
							<strong>Review Flow Active:</strong>
							{showReviewFlow ? (
								<Badge variant="default">Active</Badge>
							) : (
								<Badge variant="secondary">Inactive</Badge>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Review Activities List */}
			{reviewFlow.reviewActivities.length > 0 && (
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>
							Review Activities ({reviewFlow.reviewActivities.length})
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{reviewFlow.reviewActivities.map((activity, index) => (
								<div key={activity.id} className="border rounded-lg p-4">
									<div className="flex items-start justify-between mb-2">
										<h4 className="font-medium">Activity {index + 1}</h4>
										<Badge variant="outline">{activity.type}</Badge>
									</div>
									<p className="text-sm text-muted-foreground mb-2">
										{activity.main_text}
									</p>
									<div className="text-xs text-muted-foreground">
										<strong>ID:</strong> {activity.id} |
										<strong>Next Review:</strong>{" "}
										{activity.reviewData?.next_review
											? new Date(
													activity.reviewData.next_review
											  ).toLocaleString()
											: "N/A"}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Review Flow Display */}
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Review Flow Status</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<strong>Loading:</strong>
							{reviewFlow.isLoading ? (
								<Badge variant="default">Yes</Badge>
							) : (
								<Badge variant="secondary">No</Badge>
							)}
						</div>

						<div className="flex items-center gap-2">
							<strong>Activities in Flow:</strong>
							<Badge variant="outline">{reviewFlow.reviewActivities.length}</Badge>
						</div>

						<div className="flex items-center gap-2">
							<strong>Current Index:</strong>
							<Badge variant="outline">{reviewFlow.currentActivityIndex}</Badge>
						</div>

						<div className="flex items-center gap-2">
							<strong>Review Completed:</strong>
							{reviewFlow.reviewCompleted ? (
								<Badge variant="default">Yes</Badge>
							) : (
								<Badge variant="secondary">No</Badge>
							)}
						</div>

						{reviewFlow.error && (
							<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
								<strong className="text-red-800">Error:</strong>
								<p className="text-red-700 text-sm mt-1">{reviewFlow.error}</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Logs */}
			<Card>
				<CardHeader>
					<CardTitle>Debug Logs</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
						{logs.length === 0 ? (
							<p className="text-muted-foreground">
								No logs yet. Start testing to see activity.
							</p>
						) : (
							<div className="space-y-1">
								{logs.map((log, index) => (
									<div key={index} className="text-sm font-mono">
										{log}
									</div>
								))}
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Review Flow Section */}
			{showReviewFlow && (
				<div className="mt-8 p-6 bg-blue-50 rounded-lg border">
					<h3 className="text-lg font-semibold text-blue-900 mb-4">Review Flow Active</h3>
					<ReviewFlow onComplete={handleReviewComplete} />
				</div>
			)}
		</div>
	);
};

export default ReviewTestPage;
