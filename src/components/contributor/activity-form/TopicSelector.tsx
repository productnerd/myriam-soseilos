import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/form/Select";
import { useTopicsByCourse } from "@/hooks/contributor/useTopicsByCourse";

interface TopicSelectorProps {
	courseId: string;
	value: string;
	onChange: (value: string) => void;
}

export function TopicSelector({ courseId, value, onChange }: TopicSelectorProps) {
	const { data: topics, isLoading } = useTopicsByCourse(courseId);

	if (isLoading) {
		return <div>Loading topics...</div>;
	}

	if (!topics || topics.length === 0) {
		return <div className="text-muted-foreground">No topics found for this course</div>;
	}

	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger>
				<SelectValue placeholder="Select a topic" />
			</SelectTrigger>
			<SelectContent>
				{topics.map((topic) => (
					<SelectItem key={topic.id} value={topic.id || "default-topic-id"}>
						{topic.title || "Unnamed Topic"}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
