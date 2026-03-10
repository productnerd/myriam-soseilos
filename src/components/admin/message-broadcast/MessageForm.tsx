import React from "react";
import { Input } from "@/components/ui/form/Input";
import { Textarea } from "@/components/ui/form/Textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/form/Select";

interface MessageFormProps {
	title: string;
	setTitle: (value: string) => void;
	message: string;
	setMessage: (value: string) => void;
	tag: string;
	setTag: (value: string) => void;
}

const MessageForm: React.FC<MessageFormProps> = ({
	title,
	setTitle,
	message,
	setMessage,
	tag,
	setTag,
}) => {
	return (
		<>
			<div>
				<label className="text-sm font-medium">Message Title</label>
				<Input
					placeholder="Enter message title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</div>

			<div>
				<label className="text-sm font-medium">Message Content</label>
				<Textarea
					placeholder="Enter message content"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					className="min-h-[100px]"
				/>
			</div>

			<div>
				<label className="text-sm font-medium">Message Type</label>
				<Select value={tag} onValueChange={setTag}>
					<SelectTrigger>
						<SelectValue placeholder="Select message type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="Announcement">Announcement</SelectItem>
						<SelectItem value="Update">Update</SelectItem>
						<SelectItem value="Alert">Alert</SelectItem>
						<SelectItem value="Promotion">Promotion</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</>
	);
};

export default MessageForm;
