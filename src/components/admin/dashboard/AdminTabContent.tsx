import React from "react";
import { TabsContent } from "@/components/ui/navigation/Tabs";
import StatisticsTab from "../StatisticsTab";
import QuestApprovalTab from "../QuestApprovalTab";
import AwardDarkTab from "../AwardDarkTab";
import MessageBroadcastTab from "../MessageBroadcastTab";
import UserStrikesTab from "../UserStrikesTab";
import ContributorApplicationsTab from "../ContributorApplicationsTab";
import ActivitySubmissionsTab from "../ActivitySubmissionsTab";
import UserFeedbackTab from "../UserFeedbackTab";
import CommunityNotesTab from "../CommunityNotesTab";
import { MessageTemplatesTab } from "../MessageTemplatesTab";
import CourseCreationTab from "../course-creation/CourseCreationTab";
import ActivityGeneratorTab from "../activity-generator/ActivityGeneratorTab";
import QuestMaintenanceSection from "../QuestMaintenanceSection";

interface AdminTabContentProps {
	activeTab: string;
}

export const AdminTabContent: React.FC<AdminTabContentProps> = ({ activeTab }) => {
	return (
		<>
			<TabsContent value="stats" className="mt-6">
				<StatisticsTab />
			</TabsContent>

			<TabsContent value="quests" className="mt-6">
				<QuestApprovalTab />
			</TabsContent>

			<TabsContent value="activity-submissions" className="mt-6">
				<ActivitySubmissionsTab />
			</TabsContent>

			<TabsContent value="contributors" className="mt-6">
				<ContributorApplicationsTab />
			</TabsContent>

			<TabsContent value="user-feedback" className="mt-6">
				<UserFeedbackTab />
			</TabsContent>

			<TabsContent value="community-notes" className="mt-6">
				<CommunityNotesTab />
			</TabsContent>

			<TabsContent value="award-dark" className="mt-6">
				<AwardDarkTab />
			</TabsContent>

			<TabsContent value="broadcast" className="mt-6">
				<MessageBroadcastTab />
			</TabsContent>

			<TabsContent value="strikes" className="mt-6">
				<UserStrikesTab />
			</TabsContent>

			<TabsContent value="message-templates" className="mt-6">
				<MessageTemplatesTab />
			</TabsContent>

			<TabsContent value="course-creation" className="mt-6">
				<CourseCreationTab />
			</TabsContent>

			<TabsContent value="activity-generator" className="mt-6">
				<ActivityGeneratorTab />
			</TabsContent>

			<TabsContent value="quest-maintenance" className="mt-6">
				<QuestMaintenanceSection />
			</TabsContent>
		</>
	);
};
