import { useState, useEffect } from "react";
import { ActivityType, Activity } from "@/types/activity";
import { normalizeExplanation, normalizeActivityType } from "@/utils/activities/activityOperations";

interface SampleActivity {
	type: ActivityType;
	main_text: string;
	correct_answer: string;
	options?: string[];
	explanation?: string;
}

export function useSampleActivities(selectedType?: string) {
	const [activities, setActivities] = useState<Activity[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchSampleActivities = async () => {
			setIsLoading(true);
			setError(null);

			try {
				// Define sample activities based on the selected type
				let sampleActivities: SampleActivity[] = [];

				switch (selectedType?.toLowerCase()) {
					case "multiple_choice":
						sampleActivities = [
							{
								type: "multiple_choice",
								main_text: "What is the capital of France?",
								correct_answer: "Paris",
								options: ["London", "Paris", "Berlin", "Madrid"],
								explanation: "Paris is the capital and largest city of France.",
							},
						];
						break;
					case "true_false":
						sampleActivities = [
							{
								type: "true_false",
								main_text: "The Earth is flat.",
								correct_answer: "false",
								explanation: "The Earth is an oblate spheroid.",
							},
						];
						break;
					case "text_input":
						sampleActivities = [
							{
								type: "text_input",
								main_text: "What is 2 + 2?",
								correct_answer: "4",
								explanation: "2 + 2 equals 4.",
							},
						];
						break;
					case "sorting":
						sampleActivities = [
							{
								type: "sorting",
								main_text: "Sort these numbers in ascending order:",
								correct_answer: "1, 2, 3, 4",
								options: ["4", "2", "3", "1"],
								explanation: "The correct order is 1, 2, 3, 4.",
							},
						];
						break;
					case "image_multiple_choice":
						sampleActivities = [
							{
								type: "image_multiple_choice",
								main_text: "Which of these is a cat?",
								correct_answer: "cat_image.jpg",
								options: ["cat_image.jpg", "dog_image.jpg", "bird_image.jpg"],
								explanation: "The image of the cat is the correct answer.",
							},
						];
						break;
					case "poll":
						sampleActivities = [
							{
								type: "poll",
								main_text: "Do you prefer cats or dogs?",
								correct_answer: "cats",
								options: ["cats", "dogs"],
								explanation:
									"This is a poll, so there is no right or wrong answer.",
							},
						];
						break;
					case "image_poll":
						sampleActivities = [
							{
								type: "image_poll",
								main_text: "Which image do you like more?",
								correct_answer: "image1.jpg",
								options: ["image1.jpg", "image2.jpg"],
								explanation:
									"This is an image poll, so there is no right or wrong answer.",
							},
						];
						break;
					case "text_poll":
						sampleActivities = [
							{
								type: "text_poll",
								main_text: "What is your favorite color?",
								correct_answer: "blue",
								options: ["red", "blue", "green"],
								explanation:
									"This is a text poll, so there is no right or wrong answer.",
							},
						];
						break;
					case "myth_or_reality":
						sampleActivities = [
							{
								type: "myth_or_reality",
								main_text: "Vitamin C prevents colds.",
								correct_answer: "Myth",
								options: ["Myth", "Reality"],
								explanation:
									"While Vitamin C is good for your immune system, it doesn't prevent colds.",
							},
						];
						break;
					case "eduntainment":
						sampleActivities = [
							{
								type: "eduntainment",
								main_text:
									"<p><b>Eduntainment Content:</b></p><p>The Amazon rainforest is the world's largest tropical rainforest, famous for its biodiversity.</p>",
								correct_answer: "N/A",
								explanation:
									"<p><b>Explanation:</b></p><p>It covers an area of 8 million square kilometers and includes territory from nine nations.</p>",
							},
						];
						break;
					default:
						sampleActivities = [
							{
								type: "multiple_choice",
								main_text: "Default Sample: What is the result of 1 + 1?",
								correct_answer: "2",
								options: ["1", "2", "3", "4"],
								explanation: "1 + 1 equals 2.",
							},
						];
						break;
				}

				// Normalize sample activities to ensure they match the Activity type
				const normalizedActivities = sampleActivities.map((activity) => ({
					id: Math.random().toString(), // Generate a random ID
					main_text: activity.main_text,
					type: normalizeActivityType(activity.type),
					correct_answer: activity.correct_answer,
					options: activity.options,
					// Convert any explanation format to the expected type
					explanation: normalizeExplanation(activity.explanation || null) || {
						default: "No explanation provided.",
					},
					order_number: 1,
				})) as Activity[];

				setActivities(normalizedActivities);
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error("Failed to fetch sample activities")
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchSampleActivities();
	}, [selectedType]);

	return { activities, isLoading, error };
}
