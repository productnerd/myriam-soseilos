import React, { useState } from "react";
import { useSubmissionCount } from "@/hooks/contributor/useSubmissionCount";
import { Alert, AlertDescription } from "@/components/ui/feedback/Alert";
import { AlertCircle } from "lucide-react";
import { useCourses } from "@/hooks/courses";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/form/Select";
import { TopicSelector } from "@/components/contributor/activity-form/TopicSelector";
import { ActivityForm } from "@/components/contributor/activity-form/ActivityForm";
import { ActivityFormData } from "@/types/activity";
import { Button } from "@/components/ui/interactive/Button";
import { Plus } from "lucide-react";
import { useActivityCreation } from "@/hooks/contributor/useActivityCreation";
import { toast } from "sonner";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/overlay/Tooltip";

export const CreateActivityTab = () => {
	const [selectedCourse, setSelectedCourse] = useState("");
	const [selectedTopic, setSelectedTopic] = useState("");
	const [activities, setActivities] = useState<ActivityFormData[]>([]);
	const { submitActivities, isSubmitting } = useActivityCreation();
	const { data: courses } = useCourses();
	const { count, remainingSubmissions, hasReachedLimit, isLoading } = useSubmissionCount();
	const handleAddActivity = () => {
		if (!selectedCourse || !selectedTopic) {
			toast.error("Please select a course and topic first");
			return;
		}
		setActivities((prev) => [
			...prev,
			{
				course_id: selectedCourse,
				topic_id: selectedTopic,
				type: "multiple_choice",
				main_text: "",
				correct_answer: "",
			},
		]);
	};
	const handleRemoveActivity = (index: number) => {
		setActivities((prev) => prev.filter((_, i) => i !== index));
	};
	const handleActivitySubmit = (data: ActivityFormData, index: number) => {
		const updatedActivities = [...activities];
		updatedActivities[index] = data;
		setActivities(updatedActivities);
		submitActivities([data]).then((success) => {
			if (success) {
				const newActivities = [...activities];
				newActivities.splice(index, 1);
				setActivities(newActivities);
			}
		});
	};
	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div className="text-sm font-medium">
					{isLoading ? (
						<span>Loading submission count...</span>
					) : (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<span className={hasReachedLimit ? "text-destructive" : ""}>
										{remainingSubmissions} / 20 left
									</span>
								</TooltipTrigger>
								<TooltipContent>
									<p>Renews tomorrow</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
				</div>
			</div>

			{hasReachedLimit && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						You've reached your daily limit of 20 activity submissions. Please come back
						tomorrow!
					</AlertDescription>
				</Alert>
			)}

			<div className="grid gap-6 mb-6">
				<div className="space-y-2">
					<label className="text-sm font-medium">Select Course</label>
					<Select value={selectedCourse} onValueChange={setSelectedCourse}>
						<SelectTrigger>
							<SelectValue placeholder="Select a course" />
						</SelectTrigger>
						<SelectContent>
							{courses?.map((course) => (
								<SelectItem
									key={course.id}
									value={course.id || "default-course-id"}
								>
									{course.title || "Unnamed Course"}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{selectedCourse && (
					<div className="space-y-2">
						<label className="text-sm font-medium">Select Topic</label>
						<TopicSelector
							courseId={selectedCourse}
							value={selectedTopic}
							onChange={setSelectedTopic}
						/>
					</div>
				)}
			</div>

			{activities.map((activity, index) => (
				<ActivityForm
					key={index}
					index={index}
					onSubmit={(data) => handleActivitySubmit(data, index)}
					onRemove={() => handleRemoveActivity(index)}
					topicId={selectedTopic}
					courseId={selectedCourse}
				/>
			))}

			<div className="flex gap-4 mt-6">
				<Button
					onClick={handleAddActivity}
					disabled={!selectedCourse || !selectedTopic || hasReachedLimit}
				>
					<Plus className="w-4 h-4 mr-2" />
					Add Activity
				</Button>
			</div>
		</div>
	);
};
