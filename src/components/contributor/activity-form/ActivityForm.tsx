import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/layout/Card";
import { Button } from "@/components/ui/interactive/Button";
import { ActivityFormData } from "@/types/activity";
import { ActivityFormHeader } from "./ActivityFormHeader";
import { ActivityTypeField } from "./ActivityTypeField";
import { QuestionTextField } from "./QuestionTextField";
import { CorrectAnswerField } from "./CorrectAnswerField";
import { OptionsField } from "./OptionsField";
import { ExplanationField } from "./ExplanationField";
import { EduntainmentField } from "./EduntainmentField";
import { ImageUploadField } from "./ImageUploadField";
import { SourceLinkField } from "./SourceLinkField";
import { useSubmissionCount } from "@/hooks/contributor/useSubmissionCount";
import { isPollActivityType } from "@/utils/activities/activityOperations";

interface ActivityFormProps {
	index: number;
	onSubmit: (data: ActivityFormData) => void;
	onRemove: () => void;
	topicId: string;
	courseId: string;
}

export function ActivityForm({ index, onSubmit, onRemove, topicId, courseId }: ActivityFormProps) {
	const [showValidationErrors, setShowValidationErrors] = useState(false);
	const { hasReachedLimit } = useSubmissionCount();

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<ActivityFormData>({
		defaultValues: {
			topic_id: topicId,
			course_id: courseId,
			type: "multiple_choice",
			options: [],
		},
		mode: "onChange",
	});

	const activityType = watch("type");
	const correctAnswer = watch("correct_answer") || "";
	const options = watch("options") || [];

	// Determine which fields are required based on activity type
	const isEduntainment = activityType === "eduntainment";
	const isPollType = isPollActivityType(activityType);
	const isCorrectAnswerRequired = !isPollActivityType(activityType) && !isEduntainment;
	const isOptionsRequired =
		["multiple_choice", "image_multiple_choice", "sorting"].includes(activityType) ||
		isPollActivityType(activityType);
	const isImageType =
		["image_multiple_choice"].includes(activityType) ||
		(isPollActivityType(activityType) && ["image_poll"].includes(activityType));
	const isSortingType = activityType === "sorting";
	const isQuestionTextRequired = !isEduntainment;

	// Function to handle type change
	const handleTypeChange = (type: string) => {
		setValue("type", type);

		// Reset fields that depend on type
		setValue("options", []);

		if (!isCorrectAnswerRequired) {
			setValue("correct_answer", "");
		}

		// For sorting, set correct answer automatically from options
		if (type === "sorting") {
			setValue("correct_answer", options.join(","));
		}

		// For eduntainment, default correct answer to N/A
		if (type === "eduntainment") {
			setValue("correct_answer", "N/A");
			setValue("main_text", ""); // Reset main text as it's not required
		}
	};

	// Functions to manage options
	const addOption = () => {
		if (options.length < 6) {
			setValue("options", [...options, ""]);

			// For sorting type, update correct answer when options change
			if (isSortingType) {
				setValue("correct_answer", [...options, ""].join(","));
			}
		}
	};

	const removeOption = (index: number) => {
		const newOptions = options.filter((_, i) => i !== index);
		setValue("options", newOptions);

		// For sorting type, update correct answer when options change
		if (isSortingType) {
			setValue("correct_answer", newOptions.join(","));
		}
	};

	const updateOption = (index: number, value: string) => {
		const newOptions = [...options];
		newOptions[index] = value;
		setValue("options", newOptions);

		// For sorting type, update correct answer when options change
		if (isSortingType) {
			setValue("correct_answer", newOptions.join(","));
		}
	};

	// Handle form submission
	const onFormSubmit = (data: ActivityFormData) => {
		setShowValidationErrors(true);

		// Additional validation
		if (isOptionsRequired && (!options || options.length === 0)) {
			return;
		}

		// If eduntainment, set default main_text if none provided
		if (isEduntainment && !data.main_text) {
			data.main_text = "Educational content";
		}

		// Process option-specific explanations if they exist
		const optionsWithExplanations = options.map((option, idx) => {
			const explanationKey = `options.${idx}.explanation`;
			const explanation = getValues(explanationKey as any);
			return {
				text: option,
				explanation: explanation || "",
			};
		});

		// Build the final explanation object/string
		let finalExplanation = data.explanation || "";

		// Check if any option has an explanation
		const hasOptionExplanations = optionsWithExplanations.some((opt) => opt.explanation);

		// If we have option-specific explanations, convert to a structured format
		if (hasOptionExplanations) {
			const explanationObj: Record<string, string> = {
				default: data.explanation || "",
			};

			optionsWithExplanations.forEach((opt) => {
				if (opt.explanation) {
					explanationObj[opt.text] = opt.explanation;
				}
			});

			// Override the explanation with our constructed object
			finalExplanation = JSON.stringify(explanationObj);
		}

		// Remove image_urls field if it's not needed
		const { image_urls, ...restData } = data;

		// Submit with the processed explanation
		onSubmit({
			...restData,
			explanation: finalExplanation as string,
		});
	};

	return (
		<Card className="mb-6">
			<CardContent className="pt-6">
				<form className="space-y-4" onSubmit={handleSubmit(onFormSubmit)}>
					<ActivityFormHeader index={index} onRemove={onRemove} />

					<ActivityTypeField value={activityType} onChange={handleTypeChange} />

					{isQuestionTextRequired && (
						<QuestionTextField
							register={register}
							error={errors.main_text?.message}
							showValidationErrors={showValidationErrors}
							isRequired={isQuestionTextRequired}
						/>
					)}

					{/* Order matters: options before correct answer for multiple choice */}
					{isOptionsRequired && (
						<OptionsField
							options={options}
							onAddOption={addOption}
							onRemoveOption={removeOption}
							onUpdateOption={updateOption}
							isRequired={isOptionsRequired}
							showValidationErrors={showValidationErrors}
						/>
					)}

					{isCorrectAnswerRequired && (
						<CorrectAnswerField
							register={register}
							activityType={activityType}
							isRequired={isCorrectAnswerRequired}
							error={errors.correct_answer?.message}
							value={correctAnswer}
							onValueChange={(value) => setValue("correct_answer", value)}
							options={options}
						/>
					)}

					{isImageType && (
						<ImageUploadField
							register={register}
							error={errors.image?.message}
							showValidationErrors={showValidationErrors}
						/>
					)}

					{isEduntainment && (
						<EduntainmentField
							register={register}
							error={errors.embed_url?.message}
							showValidationErrors={showValidationErrors}
						/>
					)}

					<ExplanationField
						register={register}
						isHidden={isPollType}
						setValue={setValue}
						getValues={getValues}
						options={options}
					/>

					<SourceLinkField register={register} error={errors.source_link?.message} />

					<Button type="submit" className="w-full" disabled={hasReachedLimit}>
						Submit Activity
					</Button>

					{hasReachedLimit && (
						<p className="text-sm text-destructive text-center">
							You've reached your daily submission limit (20). Please try again
							tomorrow.
						</p>
					)}
				</form>
			</CardContent>
		</Card>
	);
}
