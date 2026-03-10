import React, { useState, useEffect, useMemo } from "react";
import { useUserMessages } from "@/hooks/messages/useUserMessages";
import PageTransition from "@/components/ui/PageTransition";
import MessageCard from "@/components/inbox/MessageCard";
import LoadingInbox from "@/components/inbox/LoadingInbox";
import EmptyInbox from "@/components/inbox/EmptyInbox";
import { toast } from "sonner";

const InboxPage = () => {
	const { messages, isLoading, markAsRead, markAllAsRead } = useUserMessages();
	const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);
	const [allMessagesRead, setAllMessagesRead] = useState(false);
	const [messagesMarkedAsRead, setMessagesMarkedAsRead] = useState(false);

	// Sort messages by creation date (newest first) and memoize to prevent re-sorting
	const sortedMessages = useMemo(() => {
		return [...messages].sort(
			(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		);
	}, [messages]);

	// Mark all messages as read when inbox is opened, but only once
	useEffect(() => {
		if (sortedMessages.length > 0 && !isLoading && !messagesMarkedAsRead) {
			// Check if there are any unread messages
			const unreadMessages = sortedMessages.filter((msg) => !msg.is_read);

			if (unreadMessages.length > 0) {
				// Add a small delay to give a visual indication of unread messages before marking them as read
				const timer = setTimeout(() => {
					markAllAsRead().then(() => {
						setAllMessagesRead(true);
						setMessagesMarkedAsRead(true);

						// Show toast only once after successful marking
						toast.info(
							`Marked ${unreadMessages.length} message${
								unreadMessages.length !== 1 ? "s" : ""
							} as read`
						);
					});
				}, 2000);

				return () => clearTimeout(timer);
			} else {
				// If all messages are already read, just set the state
				setAllMessagesRead(true);
				setMessagesMarkedAsRead(true);
			}
		}
	}, [sortedMessages, isLoading, markAllAsRead, messagesMarkedAsRead]);

	const handleMessageClick = (messageId: string) => {
		if (expandedMessageId === messageId) {
			setExpandedMessageId(null);
		} else {
			setExpandedMessageId(messageId);
			// Mark message as read when expanded
			markAsRead(messageId);
		}
	};

	// Show loading state first
	if (isLoading) {
		return (
			<PageTransition>
				<div className="container max-w-screen-md mx-auto px-4 pb-24 pt-6 text-left">
					<LoadingInbox />
				</div>
			</PageTransition>
		);
	}

	return (
		<PageTransition>
			<div className="container max-w-screen-md mx-auto px-4 pb-24 pt-6 text-left">
				<div className="mt-6 space-y-6 text-left">
					{sortedMessages.length === 0 ? (
						<EmptyInbox />
					) : (
						<div className="space-y-4 text-left">
							{sortedMessages.map((message) => (
								<MessageCard
									key={message.id}
									message={message}
									isExpanded={expandedMessageId === message.id}
									onMessageClick={() => handleMessageClick(message.id)}
									forceRead={allMessagesRead}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</PageTransition>
	);
};

export default InboxPage;
