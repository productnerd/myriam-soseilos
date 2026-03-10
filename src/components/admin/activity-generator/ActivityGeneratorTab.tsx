import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/Card";
import { Button } from "@/components/ui/interactive/Button";
import { Plus } from "lucide-react";
import ActivityGeneratorCard from "./ActivityGeneratorCard";
import { ActivityType } from "@/types/activity";
import { CourseTopicSelector } from "./components/CourseTopicSelector";
import { PromptEditor } from "./components/PromptEditor";

interface GeneratedActivity {
	id: string;
	type: ActivityType;
	optionsCount?: number;
	customContext: string;
	isGenerating: boolean;
	generatedContent?: {
		question: string;
		options?: string[];
		correctAnswerIndex?: number;
		optionExplanations?: string[];
		explanation?: string;
	};
}

const ActivityGeneratorTab: React.FC = () => {
	const [activities, setActivities] = useState<GeneratedActivity[]>([]);
	const [selectedCourse, setSelectedCourse] = useState<string>("");
	const [selectedTopic, setSelectedTopic] = useState<string>("");
	const [basePrompt, setBasePrompt] = useState<string>("");

	const addNewActivity = () => {
		if (!selectedCourse || !selectedTopic) {
			return;
		}

		const newActivity: GeneratedActivity = {
			id: Date.now().toString(),
			type: "multiple_choice",
			optionsCount: 4,
			customContext: "",
			isGenerating: false,
		};
		setActivities([...activities, newActivity]);
	};

	const updateActivity = (id: string, updates: Partial<GeneratedActivity>) => {
		setActivities(
			activities.map((activity) =>
				activity.id === id ? { ...activity, ...updates } : activity
			)
		);
	};

	const removeActivity = (id: string) => {
		setActivities(activities.filter((activity) => activity.id !== id));
	};

	const canAddActivity = selectedCourse && selectedTopic;

	return (
		<div className="space-y-6">
			<PromptEditor onPromptChange={setBasePrompt} />

			<Card>
				<CardHeader>
					<CardTitle>Activity Generator</CardTitle>
					<p className="text-sm text-muted-foreground">
						Generate activities using AI with custom prompts and context. Perfect for
						creating engaging, practical content for your courses.
					</p>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<h4 className="font-semibold text-lg mb-4">Select Course & Topic</h4>
						<CourseTopicSelector
							selectedCourse={selectedCourse}
							selectedLevel=""
							selectedTopic={selectedTopic}
							onCourseChange={(courseId) => {
								setSelectedCourse(courseId);
								setSelectedTopic("");
							}}
							onLevelChange={() => {}} // Not used anymore
							onTopicChange={(topicId) => {
								setSelectedTopic(topicId);
							}}
						/>
					</div>

					<Button
						onClick={addNewActivity}
						className="flex items-center gap-2"
						disabled={!canAddActivity}
					>
						<Plus className="h-4 w-4" />
						Add New Activity
					</Button>

					{!canAddActivity && (
						<p className="text-sm text-muted-foreground">
							Please select a course and topic before adding activities.
						</p>
					)}
				</CardContent>
			</Card>

			<div className="space-y-4">
				{activities.map((activity) => (
					<ActivityGeneratorCard
						key={activity.id}
						activity={activity}
						selectedTopic={selectedTopic}
						basePrompt={basePrompt}
						onUpdate={(updates) => updateActivity(activity.id, updates)}
						onRemove={() => removeActivity(activity.id)}
					/>
				))}
			</div>

			{activities.length === 0 && canAddActivity && (
				<Card>
					<CardContent className="py-8 text-center text-muted-foreground">
						<p>No activities yet. Click "Add New Activity" to get started.</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default ActivityGeneratorTab;
