// TODO: This component is not used anywhere

import React from "react";
import StatisticsTab from "./StatisticsTab";
import QuestApprovalTab from "./QuestApprovalTab";
import AwardDarkTab from "./AwardDarkTab";
import LeaderboardsTab from "./LeaderboardsTab";
import MessageBroadcastTab from "./MessageBroadcastTab";
import UserStrikesTab from "./UserStrikesTab";
import LogsTab from "./LogsTab";
import QuestMaintenanceSection from "./QuestMaintenanceSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard: React.FC = () => {
	return (
		<div className="container py-6 space-y-6">
			<h1 className="text-3xl font-bold">Admin Dashboard</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-2">
					<Tabs defaultValue="statistics" className="w-full">
						<TabsList className="grid grid-cols-3 md:grid-cols-7">
							<TabsTrigger value="statistics">Statistics</TabsTrigger>
							<TabsTrigger value="quests">Quests</TabsTrigger>
							<TabsTrigger value="awards">Awards</TabsTrigger>
							<TabsTrigger value="leaderboards">Leaderboards</TabsTrigger>
							<TabsTrigger value="messages">Messages</TabsTrigger>
							<TabsTrigger value="strikes">Strikes</TabsTrigger>
							<TabsTrigger value="logs">Logs</TabsTrigger>
						</TabsList>

						<TabsContent value="statistics" className="mt-6">
							<StatisticsTab />
						</TabsContent>

						<TabsContent value="quests" className="mt-6">
							<QuestApprovalTab />
						</TabsContent>

						<TabsContent value="awards" className="mt-6">
							<AwardDarkTab />
						</TabsContent>

						<TabsContent value="leaderboards" className="mt-6">
							<LeaderboardsTab />
						</TabsContent>

						<TabsContent value="messages" className="mt-6">
							<MessageBroadcastTab />
						</TabsContent>

						<TabsContent value="strikes" className="mt-6">
							<UserStrikesTab />
						</TabsContent>

						<TabsContent value="logs" className="mt-6">
							<LogsTab />
						</TabsContent>
					</Tabs>
				</div>

				<div className="md:col-span-1 space-y-6">
					<QuestMaintenanceSection />
					{/* Other admin side controls can be added here */}
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
