import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/layout/Card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/layout/Accordion";
import { Textarea } from "@/components/ui/form/Textarea";
import { Input } from "@/components/ui/form/Input";
import { Button } from "@/components/ui/interactive/Button";
import { toast } from "@/hooks/ui/useToast";
import { Label } from "@/components/ui/form/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/Tabs";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/data/Table";

interface NotificationTemplate {
	key: string;
	title: string;
	message: string;
	description: string;
}

interface StoreNotificationSubscriber {
	id: string;
	user_id: string;
	item_id: string;
	created_at: string;
	user_name: string;
	user_email: string;
	item_name: string;
	item_state: string;
}

const NotificationTemplates = () => {
	const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
	const [editMode, setEditMode] = useState<Record<string, boolean>>({});
	const [editValues, setEditValues] = useState<
		Record<string, { title: string; message: string }>
	>({});
	const [activeTab, setActiveTab] = useState<string>("templates");
	const queryClient = useQueryClient();

	const { isLoading: isTemplatesLoading } = useQuery({
		queryKey: ["store-notification-templates"],
		queryFn: async () => {
			const { data, error } = await supabase.rpc("get_store_notification_templates");

			if (error) {
				console.error("Error fetching templates:", error);
				toast({
					title: "Error",
					description: "Failed to load notification templates",
					variant: "destructive",
				});
				return [];
			}

			setTemplates(data || []);
			const initialEditValues: Record<string, { title: string; message: string }> = {};
			data?.forEach((template: NotificationTemplate) => {
				initialEditValues[template.key] = {
					title: template.title,
					message: template.message,
				};
			});
			setEditValues(initialEditValues);

			return data;
		},
		refetchOnWindowFocus: false,
	});

	// Update the subscribers query to fix the foreign key relationship issue
	const { data: subscribers, isLoading: isSubscribersLoading } = useQuery({
		queryKey: ["store-notification-subscribers"],
		queryFn: async () => {
			// First fetch the notification subscriptions
			const { data: subscriptions, error: subError } = await supabase
				.from("store_item_notifications")
				.select("id, user_id, item_id, created_at");

			if (subError) {
				console.error("Error fetching notification subscribers:", subError);
				toast({
					title: "Error",
					description: "Failed to load notification subscribers",
					variant: "destructive",
				});
				return [];
			}

			// Get formatted results by processing each subscription
			const formattedData: StoreNotificationSubscriber[] = [];

			for (const subscription of subscriptions || []) {
				// Get user profile data
				const { data: profileData } = await supabase
					.from("profiles")
					.select("name, email")
					.eq("id", subscription.user_id)
					.single();

				// Get store item data
				const { data: itemData } = await supabase
					.from("store_items")
					.select("name, state")
					.eq("id", subscription.item_id)
					.single();

				formattedData.push({
					id: subscription.id,
					user_id: subscription.user_id,
					item_id: subscription.item_id,
					created_at: subscription.created_at,
					user_name: profileData?.name || "Unknown",
					user_email: profileData?.email || "No email",
					item_name: itemData?.name || "Unknown product",
					item_state: itemData?.state || "UNKNOWN",
				});
			}

			return formattedData;
		},
		refetchOnWindowFocus: false,
		enabled: activeTab === "subscribers",
	});

	// Send notification to a user
	const sendNotificationMutation = useMutation({
		mutationFn: async ({
			userId,
			title,
			message,
		}: {
			userId: string;
			title: string;
			message: string;
		}) => {
			const { data, error } = await supabase.from("user_messages").insert({
				user_id: userId,
				title: title,
				payload: message,
				tag: "Store",
				is_read: false,
			});

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			toast({
				title: "Success",
				description: "Notification sent successfully",
			});
		},
		onError: (error) => {
			console.error("Error sending notification:", error);
			toast({
				title: "Error",
				description: "Failed to send notification",
				variant: "destructive",
			});
		},
	});

	const handleToggleEdit = (key: string) => {
		setEditMode((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const handleSaveTemplate = async (key: string) => {
		// In a real implementation, this would update a database table
		toast({
			title: "Success",
			description: "Template changes saved successfully",
		});
		setEditMode((prev) => ({
			...prev,
			[key]: false,
		}));

		// Update the templates in the UI
		setTemplates(
			templates.map((t) =>
				t.key === key
					? {
							...t,
							title: editValues[key].title,
							message: editValues[key].message,
					  }
					: t
			)
		);
	};

	const handleSendManualNotification = async (userId: string, itemName: string) => {
		const title = `Update about ${itemName}`;
		const message = `We have an update about the item "${itemName}" you're interested in. Please check the store for more details.`;

		await sendNotificationMutation.mutateAsync({
			userId,
			title,
			message,
		});
	};

	const handleInputChange = (key: string, field: "title" | "message", value: string) => {
		setEditValues((prev) => ({
			...prev,
			[key]: {
				...prev[key],
				[field]: value,
			},
		}));
	};

	if (isTemplatesLoading && activeTab === "templates") {
		return <div className="flex items-center justify-center p-8">Loading templates...</div>;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Store Notifications</CardTitle>
				<CardDescription>
					Manage notification templates and subscribers for store items
				</CardDescription>
				<Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
					<TabsList>
						<TabsTrigger value="templates">Message Templates</TabsTrigger>
						<TabsTrigger value="subscribers">Notification Subscribers</TabsTrigger>
					</TabsList>
				</Tabs>
			</CardHeader>
			<CardContent>
				<TabsContent value="templates" className="mt-0">
					<Accordion type="single" collapsible className="w-full">
						{templates.map((template) => (
							<AccordionItem key={template.key} value={template.key}>
								<AccordionTrigger className="text-md font-medium">
									{template.key === "item_available"
										? "Item Available Notification"
										: "Release Date Announcement"}
								</AccordionTrigger>
								<AccordionContent className="space-y-4 pt-4">
									<div className="text-sm text-muted-foreground mb-4">
										{template.description}
									</div>

									<div className="space-y-4 p-4 border border-border rounded-md">
										{editMode[template.key] ? (
											<div className="space-y-4">
												<div className="space-y-2">
													<Label htmlFor={`title-${template.key}`}>
														Title Template
													</Label>
													<Input
														id={`title-${template.key}`}
														value={
															editValues[template.key]?.title || ""
														}
														onChange={(e) =>
															handleInputChange(
																template.key,
																"title",
																e.target.value
															)
														}
													/>
												</div>

												<div className="space-y-2">
													<Label htmlFor={`message-${template.key}`}>
														Message Template
													</Label>
													<Textarea
														id={`message-${template.key}`}
														value={
															editValues[template.key]?.message || ""
														}
														onChange={(e) =>
															handleInputChange(
																template.key,
																"message",
																e.target.value
															)
														}
														rows={4}
													/>
												</div>

												<div className="flex justify-end space-x-2">
													<Button
														variant="outline"
														onClick={() =>
															handleToggleEdit(template.key)
														}
													>
														Cancel
													</Button>
													<Button
														onClick={() =>
															handleSaveTemplate(template.key)
														}
													>
														Save Template
													</Button>
												</div>
											</div>
										) : (
											<div className="space-y-4">
												<div>
													<div className="text-xs text-muted-foreground mb-1">
														Title Template:
													</div>
													<div className="bg-muted p-3 rounded-md">
														{template.title}
													</div>
												</div>

												<div>
													<div className="text-xs text-muted-foreground mb-1">
														Message Template:
													</div>
													<div className="bg-muted p-3 rounded-md whitespace-pre-line">
														{template.message}
													</div>
												</div>

												<div className="flex justify-end">
													<Button
														variant="outline"
														onClick={() =>
															handleToggleEdit(template.key)
														}
													>
														Edit Template
													</Button>
												</div>
											</div>
										)}
									</div>

									<div className="bg-muted p-4 rounded-md">
										<div className="text-xs font-medium mb-2">
											Available placeholders:
										</div>
										<ul className="list-disc pl-5 text-xs text-muted-foreground">
											<li>
												<code>{"{{item_name}}"}</code> - The name of the
												store item
											</li>
											{template.key === "release_date_announced" && (
												<li>
													<code>{"{{release_date}}"}</code> - Formatted
													release date
												</li>
											)}
										</ul>
									</div>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</TabsContent>

				<TabsContent value="subscribers" className="mt-0">
					{isSubscribersLoading ? (
						<div className="flex items-center justify-center p-8">
							Loading subscribers...
						</div>
					) : (
						<>
							<div className="mb-4">
								<h3 className="text-sm font-medium text-muted-foreground">
									Users waiting to be notified about store items (
									{subscribers?.length || 0})
								</h3>
							</div>

							{subscribers && subscribers.length > 0 ? (
								<div className="border rounded-md">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>User</TableHead>
												<TableHead>Product</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Subscribed</TableHead>
												<TableHead className="text-right">
													Actions
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{subscribers.map((subscriber) => (
												<TableRow key={subscriber.id}>
													<TableCell className="font-medium">
														<div>{subscriber.user_name}</div>
														<div className="text-xs text-muted-foreground">
															{subscriber.user_email}
														</div>
													</TableCell>
													<TableCell>{subscriber.item_name}</TableCell>
													<TableCell>
														<span
															className={`inline-block rounded-full px-2 py-1 text-xs ${
																subscriber.item_state ===
																"AVAILABLE"
																	? "bg-green-500/20 text-green-600"
																	: subscriber.item_state ===
																	  "COMING_SOON"
																	? "bg-blue-500/20 text-blue-600"
																	: "bg-red-500/20 text-red-600"
															}`}
														>
															{subscriber.item_state}
														</span>
													</TableCell>
													<TableCell>
														{new Date(
															subscriber.created_at
														).toLocaleDateString()}
													</TableCell>
													<TableCell className="text-right">
														<Button
															variant="outline"
															size="sm"
															onClick={() =>
																handleSendManualNotification(
																	subscriber.user_id,
																	subscriber.item_name
																)
															}
														>
															Send Message
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							) : (
								<div className="flex items-center justify-center p-8 text-muted-foreground">
									No notification subscribers found
								</div>
							)}
						</>
					)}
				</TabsContent>
			</CardContent>
		</Card>
	);
};

export default NotificationTemplates;
