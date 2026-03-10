import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/layout/Card";
import MessageForm from "./message-broadcast/MessageForm";
import FilterSection from "./message-broadcast/FilterSection";
import ActionButtons from "./message-broadcast/ActionButtons";
import { useMessageBroadcast } from "@/hooks/admin/useMessageBroadcast";
import NotificationTemplates from "./message-broadcast/NotificationTemplates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/Tabs";

const MessageBroadcastTab = () => {
	const [activeTab, setActiveTab] = useState<string>("broadcast");
	const {
		title,
		setTitle,
		message,
		setMessage,
		tag,
		setTag,
		minGreyPoints,
		setMinGreyPoints,
		minDarkPoints,
		setMinDarkPoints,
		minStreak,
		setMinStreak,
		country,
		setCountry,
		recipientCount,
		isSending,
		isCalculating,
		handleCalculateRecipients,
		handleSendMessage,
	} = useMessageBroadcast();

	return (
		<div className="space-y-6">
			<Tabs defaultValue="broadcast" value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="mb-4">
					<TabsTrigger value="broadcast">Broadcast Messages</TabsTrigger>
					<TabsTrigger value="templates">Store Notifications</TabsTrigger>
				</TabsList>

				<TabsContent value="broadcast">
					<Card>
						<CardHeader>
							<CardTitle>Broadcast Message</CardTitle>
							<CardDescription>
								Send messages to users based on specific criteria.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<MessageForm
									title={title}
									setTitle={setTitle}
									message={message}
									setMessage={setMessage}
									tag={tag}
									setTag={setTag}
								/>

								<FilterSection
									minGreyPoints={minGreyPoints}
									setMinGreyPoints={setMinGreyPoints}
									minDarkPoints={minDarkPoints}
									setMinDarkPoints={setMinDarkPoints}
									minStreak={minStreak}
									setMinStreak={setMinStreak}
									country={country}
									setCountry={setCountry}
								/>

								<ActionButtons
									isCalculating={isCalculating}
									isSending={isSending}
									recipientCount={recipientCount}
									onCalculate={handleCalculateRecipients}
									onSend={handleSendMessage}
									disabled={!title || !message}
								/>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="templates">
					<NotificationTemplates />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default MessageBroadcastTab;
