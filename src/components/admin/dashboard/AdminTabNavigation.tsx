import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/navigation/Tabs";

export const AdminTabNavigation: React.FC = () => {
	return (
		<TabsList className="grid w-full grid-cols-6 lg:grid-cols-8 gap-0.5">
			<TabsTrigger value="stats" className="text-xs px-2">
				Statistics
			</TabsTrigger>
			<TabsTrigger value="quests" className="text-xs px-2">
				Quest Approval
			</TabsTrigger>
			<TabsTrigger value="activity-submissions" className="text-xs px-2">
				Activities
			</TabsTrigger>
			<TabsTrigger value="contributors" className="text-xs px-2">
				Contributors
			</TabsTrigger>
			<TabsTrigger value="user-feedback" className="text-xs px-2">
				Feedback
			</TabsTrigger>
			<TabsTrigger value="community-notes" className="text-xs px-2">
				Notes
			</TabsTrigger>
			<TabsTrigger value="award-dark" className="text-xs px-2">
				Award Dark
			</TabsTrigger>
			<TabsTrigger value="broadcast" className="text-xs px-2">
				Broadcast
			</TabsTrigger>
			<TabsTrigger value="strikes" className="text-xs px-2">
				Strikes
			</TabsTrigger>
			<TabsTrigger value="message-templates" className="text-xs px-2">
				Templates
			</TabsTrigger>
			<TabsTrigger value="course-creation" className="text-xs px-2">
				Courses
			</TabsTrigger>
			<TabsTrigger value="activity-generator" className="text-xs px-2">
				Generator
			</TabsTrigger>
			<TabsTrigger value="quest-maintenance" className="text-xs px-2">
				Quest Maintenance
			</TabsTrigger>
		</TabsList>
	);
};
