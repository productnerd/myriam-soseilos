import React, { useState } from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Plus } from "lucide-react";
import { ActivityForm } from "@/components/contributor/activity-form/ActivityForm";
import { useSubmissionCount } from "@/hooks/contributor/useSubmissionCount";
import { ActivityFormData } from "@/types/activity";
import Layout from "@/components/layout/Layout";
import { useCourses } from "@/hooks/courses";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/form/Select";
import { TopicSelector } from "@/components/contributor/activity-form/TopicSelector";
import { useActivityCreation } from "@/hooks/contributor/useActivityCreation";
import { useTopicsByCourse } from "@/hooks/contributor/useTopicsByCourse";
import { ContributorActivities } from "@/components/contributor/activities/ContributorActivities";

export default function ContributorActivitiesPage() {
	const [selectedCourse, setSelectedCourse] = useState("");
	const [selectedTopic, setSelectedTopic] = useState("");
	const [activities, setActivities] = useState<ActivityFormData[]>([]);

	const { count, remainingSubmissions, hasReachedLimit } = useSubmissionCount();
	const { data: courses } = useCourses();
	const { data: topics } = useTopicsByCourse(selectedCourse);
	const { submitActivities, isSubmitting } = useActivityCreation();

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
	};

	const handleSubmitAll = async () => {
		if (activities.length === 0) {
			toast.error("Please add at least one activity");
			return;
		}

		const success = await submitActivities(activities);
		if (success) {
			setActivities([]);
			setSelectedCourse("");
			setSelectedTopic("");
		}
	};

	return (
		<Layout>
			<div className="container mx-auto py-8">
				<div className="max-w-2xl mx-auto space-y-6">
					<h1 className="text-3xl font-bold mb-6">Create New Activities</h1>

					<div className="grid gap-6 mb-6">
						<div className="space-y-2">
							<label className="text-sm font-medium">Select Course</label>
							<Select value={selectedCourse} onValueChange={setSelectedCourse}>
								<SelectTrigger>
									<SelectValue placeholder="Select a course" />
								</SelectTrigger>
								<SelectContent>
									{courses?.map((course) => (
										<SelectItem key={course.id} value={course.id}>
											{course.title}
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
							disabled={!selectedCourse || !selectedTopic}
						>
							<Plus className="w-4 h-4 mr-2" />
							Add Activity
						</Button>

						<Button
							onClick={handleSubmitAll}
							disabled={activities.length === 0 || isSubmitting}
						>
							Submit All Activities
						</Button>
					</div>
				</div>
			</div>
		</Layout>
	);
}
