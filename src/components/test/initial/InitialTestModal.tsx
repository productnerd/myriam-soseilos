// TODO: This is not used anywhere

import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/overlay/Dialog";
import { useNavigate } from "react-router-dom";
import { useInitialTestCompletion } from "@/hooks/test/useInitialTestCompletion";

interface InitialTestModalProps {
	isModalOpen: boolean;
	setIsModalOpen: (open: boolean) => void;
	courseId: string;
	initialTestId: string;
}

const InitialTestModal: React.FC<InitialTestModalProps> = ({
	isModalOpen,
	setIsModalOpen,
	courseId,
	initialTestId,
}) => {
	const navigate = useNavigate();
	const { isNavigating, handleTestComplete, createInitialScoreRecord } = useInitialTestCompletion(
		courseId,
		(initialTestCompleted, skipped) => {
			// When test is completed or skipped, redirect to course page
			setIsModalOpen(false);
			navigate(`/learn`);
		}
	);

	const handleStartTest = () => {
		setIsModalOpen(false);
		navigate(`/test/${initialTestId}?courseId=${courseId}`);
	};

	const handleSkipTest = async () => {
		setIsModalOpen(false);
		// Only create a record when skipping the test
		await createInitialScoreRecord(false, true);
		await handleTestComplete(true);
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Take Initial Test</DialogTitle>
					<DialogDescription>
						To get started, take a quick initial test to assess your current knowledge.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<p>This test will help us tailor the course to your skill level.</p>
				</div>
				<DialogFooter>
					<Button type="submit" onClick={handleStartTest} disabled={isNavigating}>
						Start Test
					</Button>
					<Button
						type="button"
						variant="secondary"
						onClick={handleSkipTest}
						disabled={isNavigating}
					>
						Skip Test
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default InitialTestModal;
