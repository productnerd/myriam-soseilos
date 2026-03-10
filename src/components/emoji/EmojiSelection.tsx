import React, { useState } from "react";
import { Button } from "@/components/ui/interactive/Button";
import { motion } from "framer-motion";
import EmojiSelector from "./EmojiSelector";

interface EmojiSelectionProps {
	onSubmit: (emoji: string | null) => void;
}

const EmojiSelection: React.FC<EmojiSelectionProps> = ({ onSubmit }) => {
	const [selectedEmoji, setSelectedEmoji] = useState<string>("");

	const handleSubmit = () => {
		if (selectedEmoji) {
			onSubmit(selectedEmoji);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex flex-col space-y-6 h-full"
		>
			<div className="text-center space-y-2">
				<h3 className="text-lg font-medium text-white">What emoji best represents you?</h3>
				<p className="text-white/70 text-sm">
					Select just one emoji that represents your personality.
				</p>
			</div>

			<div className="flex-1 min-h-0">
				<div className="h-80 overflow-y-auto">
					<EmojiSelector selectedEmoji={selectedEmoji} onSelectEmoji={setSelectedEmoji} />
				</div>
			</div>

			<div className="space-y-3">
				<Button
					onClick={handleSubmit}
					className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
					disabled={!selectedEmoji}
				>
					Continue
				</Button>
			</div>
		</motion.div>
	);
};

export default EmojiSelection;
