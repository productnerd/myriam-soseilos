import React from "react";
import { MailOpen } from "lucide-react";

const EmptyInbox: React.FC = () => {
	return (
		<div className="flex flex-col items-center justify-center h-[50vh] text-center p-6">
			<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
				<MailOpen className="h-8 w-8 text-muted-foreground" />
			</div>
			<h3 className="text-xl font-semibold mb-2">Your inbox is empty</h3>
			<p className="text-muted-foreground max-w-md">
				Messages about new quests, courses, items, and features will appear here.
			</p>
		</div>
	);
};

export default EmptyInbox;
