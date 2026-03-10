import React, { useState, useEffect } from "react";
import { Activity } from "@/types/activity";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/layout/AspectRatio";

interface ImageMultipleChoiceAnswerProps {
	activity: Activity;
	selectedAnswer: string;
	isCorrect: boolean;
	showFeedback: boolean;
	onAnswer: (answer: string) => void;
}

const ImageMultipleChoiceAnswer: React.FC<ImageMultipleChoiceAnswerProps> = ({
	activity,
	selectedAnswer,
	isCorrect,
	showFeedback,
	onAnswer,
}) => {
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const options = Array.isArray(activity.options) ? activity.options : [];

	// The number of expected correct answers
	const expectedCorrectCount =
		activity.correct_answer_count ||
		(activity.correct_answer?.includes(",") ? activity.correct_answer.split(",").length : 1);

	useEffect(() => {
		// Initialize selectedOptions from selectedAnswer
		if (selectedAnswer) {
			setSelectedOptions(selectedAnswer.split(","));
		} else {
			setSelectedOptions([]);
		}
	}, [selectedAnswer]);

	const handleImageSelect = (option: string) => {
		if (showFeedback) return;

		let newSelectedOptions: string[];

		if (activity.correct_answer?.includes(",")) {
			// Toggle the selected option for multi-select
			if (selectedOptions.includes(option)) {
				newSelectedOptions = selectedOptions.filter((item) => item !== option);
			} else {
				newSelectedOptions = [...selectedOptions, option];
			}
			setSelectedOptions(newSelectedOptions);

			// Only trigger the answer selection when the right number of options are selected
			if (newSelectedOptions.length === expectedCorrectCount) {
				onAnswer(newSelectedOptions.join(","));
			}
		} else {
			// For single-select, directly select the option
			onAnswer(option);
		}
	};

	// Define classes for image options
	const getImageClasses = (option: string) => {
		const correctAnswers = activity.correct_answer?.split(",") || [];
		const isSelected = selectedOptions.includes(option);
		const isCorrectOption = correctAnswers.includes(option);

		return cn(
			"relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200",
			{
				// Base state (not showing feedback)
				"border-input hover:border-primary": !showFeedback && !isSelected,
				"border-primary": !showFeedback && isSelected,

				// Showing feedback states
				"border-green-500": showFeedback && isCorrectOption,
				"border-red-500": showFeedback && isSelected && !isCorrect,
				"opacity-50": showFeedback && !isSelected && !isCorrectOption,
			}
		);
	};

	const isMultiSelect = activity.correct_answer?.includes(",") || false;

	return (
		<div className="mt-6">
			{isMultiSelect && (
				<p className="text-sm italic text-amber-600 mb-4">
					Select {expectedCorrectCount} correct{" "}
					{expectedCorrectCount === 1 ? "image" : "images"}
				</p>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{options.map((option, index) => {
					const optionValue = typeof option === "string" ? option : String(option);
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

							{/* Overlay for selected items */}
							{selectedOptions.includes(optionValue) && !showFeedback && (
								<div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
									<div className="h-8 w-8 rounded-full bg-primary/90 text-white flex items-center justify-center">
										{selectedOptions.indexOf(optionValue) + 1}
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ImageMultipleChoiceAnswer;
