import React, { useState } from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Input } from "@/components/ui/form/Input";
import { UserPlus } from "lucide-react";

interface AddFriendFormProps {
	onAddFriend: (email: string) => void;
}

const AddFriendForm: React.FC<AddFriendFormProps> = ({ onAddFriend }) => {
	const [email, setEmail] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (email.trim()) {
			onAddFriend(email.trim());
			setEmail("");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex gap-2 mb-4">
			<Input
				type="email"
				placeholder="Friend's email address"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className="flex-1"
			/>
			<Button type="submit" className="bg-app-blue">
				<UserPlus className="h-4 w-4 mr-2" />
				Add
			</Button>
		</form>
	);
};

export default AddFriendForm;
