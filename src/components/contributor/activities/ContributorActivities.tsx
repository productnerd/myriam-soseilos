import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/Tabs";
import { CreateActivityTab } from "./CreateActivityTab";
import { PastSubmissionsTab } from "./PastSubmissionsTab";
import { FeedbackTab } from "./FeedbackTab";

export const ContributorActivities: React.FC = () => {
	const [activeTab, setActiveTab] = useState<string>("create");

	return (
		<div className="max-w-4xl mx-auto">
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="mb-8">
					<TabsTrigger value="create">Submit Activity</TabsTrigger>
					<TabsTrigger value="submissions">Past Submissions</TabsTrigger>
					<TabsTrigger value="feedback">Feedback</TabsTrigger>
				</TabsList>

				<TabsContent value="create" className="space-y-6">
					<CreateActivityTab />
				</TabsContent>

				<TabsContent value="submissions">
					<PastSubmissionsTab />
				</TabsContent>

				<TabsContent value="feedback">
					<FeedbackTab />
				</TabsContent>
			</Tabs>
		</div>
	);
};
