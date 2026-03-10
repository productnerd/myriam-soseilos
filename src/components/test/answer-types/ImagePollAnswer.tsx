import React, { useState, useEffect } from "react";
import { Activity } from "@/types/activity";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/layout/AspectRatio";

interface ImagePollAnswerProps {
	activity: Activity;
	selectedAnswer: string;
	showFeedback: boolean;
	onAnswer: (answer: string) => void;
}

const ImagePollAnswer: React.FC<ImagePollAnswerProps> = ({
	activity,
	selectedAnswer,
	showFeedback,
	onAnswer,
}) => {
	const [selectedOption, setSelectedOption] = useState<string>("");
	const options = Array.isArray(activity.options) ? activity.options : [];

	// Create a statistics object if one doesn't exist
	const statistics = activity.statistics || {};

	// Get total votes - ensure we're working with numbers
	const totalVotes = Object.values(statistics).reduce(
		(acc, count) => acc + (Number(count) || 0),
		0
	);

	useEffect(() => {
		if (selectedAnswer) {
			setSelectedOption(selectedAnswer);
		}
	}, [selectedAnswer]);

	const handleImageSelect = (option: string) => {
		if (showFeedback) return;
		setSelectedOption(option);
		onAnswer(option);
	};

	// Define classes for image options
	const getImageClasses = (option: string) => {
		const isSelected = option === selectedOption;

		return cn(
			"relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200",
			{
				// Base state (not showing feedback)
				"border-input hover:border-primary": !isSelected && !showFeedback,
				"border-primary": isSelected && !showFeedback,
			}
		);
	};

	if (!options || !options.length) {
		return <div className="text-muted-foreground">No poll options available</div>;
	}

	return (
		<div className="mt-6">
			{showFeedback && (
				<p className="text-sm text-muted-foreground mb-4">
					{totalVotes > 0
						? `${totalVotes} ${
								totalVotes === 1 ? "person has" : "people have"
						  } answered this poll.`
						: "Be the first to answer this poll!"}
				</p>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{options.map((option, index) => {
					const optionValue = typeof option === "string" ? option : String(option);
					const votes = Number(statistics[optionValue] || 0);
					const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

					return (
						<div
							key={index}
							className={getImageClasses(optionValue)}
							onClick={() => handleImageSelect(optionValue)}
						>
							<AspectRatio ratio={16 / 9}>
								<img
									src={optionValue}
									alt={`Option ${index + 1}`}
									className="w-full h-full object-cover"
								/>
							</AspectRatio>

							{/* Show overlay for selected option */}
							{selectedOption === optionValue && !showFeedback && (
								<div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
									<div className="h-8 w-8 rounded-full bg-primary/90 text-white flex items-center justify-center">
										✓
									</div>
								</div>
							)}

							{/* Show voting results when feedback is visible */}
							{showFeedback && (
								<div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-sm">
									<div className="flex justify-between items-center">
										<div>{percentage}%</div>
										<div>
											({votes} {votes === 1 ? "vote" : "votes"})
										</div>
									</div>
									<div className="w-full h-1 bg-gray-600 mt-1">
										<div
											className="h-full bg-white"
											style={{ width: `${percentage}%` }}
										/>
									</div>
								</div>
							)}

							{/* Highlight selected answer */}
							{showFeedback && selectedOption === optionValue && (
								<div className="absolute top-2 right-2 bg-primary/80 text-white text-xs px-1.5 py-0.5 rounded">
									Your choice
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ImagePollAnswer;
