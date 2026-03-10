import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/interactive/Button";
import { motion } from "framer-motion";

const ALL_SKILLS = [
	"Run your life smoothly", // COMING_SOON
	"Use tech like a pro", // ACTIVE
	"Write like the 1%", // COMING_SOON
	"Master your finances", // ACTIVE
	"Eat like an adult", // COMING_SOON
	"Build a strong, capable body", // ACTIVE
	"Ai fluency for everyday life",
	"Invest your money",
	"Financial independence",
	"Smart & good consumerism",
	"Meditate & breathe",
	"Sleep better",
	"Psychology",
	"Sickness & medicine",
	"Make & grow friendships",
	"Get lean / lose fat",
	"Surviving in the wild",
	"Looking good",
	"Find, build & maintain a relationship",
	"Grow a business from 0",
	"Sell & market anything",
	"Manage projects effectively",
	"Organise your life",
	"How to think (better)",
	"Charisma",
	"Speak eloquently",
	"Be great at conversations",
	"English accent & vocabulary",
	"Rhetoric & debate",
	"Advance your career",
	"Personal branding",
	"Bbq & grill",
	"Baking",
	"Travel well",
	"Gardening, flowers, terrariums",
	"Growing herbs, veggies and fruit",
	"Philosophy",
	"Natural world",
	"Law & government",
	"Religion & spirituality",
	"Raise a child",
	"Be a great collaborator & colleague",
	"Buy your first property",
];

interface SkillSelectionPillsProps {
	onSubmit: (selectedSkills: string[]) => void;
}

const SkillSelectionPills: React.FC<SkillSelectionPillsProps> = ({ onSubmit }) => {
	const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

	// Randomize skills order once on component mount
	const randomizedSkills = useMemo(() => {
		const shuffled = [...ALL_SKILLS];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	}, []);

	const handleSkillToggle = (skill: string) => {
		setSelectedSkills((prev) =>
			prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
		);
	};

	const handleSubmit = () => {
		onSubmit(selectedSkills);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex flex-col h-full space-y-6"
		>
			<div className="text-center space-y-2">
				<h3 className="text-lg font-medium text-white">What do you want to learn?</h3>
			</div>

			{/* Skills grid - made scrollable with 2 columns */}
			<div className="flex-1 overflow-y-auto max-h-80">
				<div className="grid grid-cols-2 gap-2 pr-2">
					{randomizedSkills.map((skill) => (
						<button
							key={skill}
							onClick={() => handleSkillToggle(skill)}
							className={`
                px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 text-left
                ${
					selectedSkills.includes(skill)
						? "bg-blue-600 text-white border-2 border-blue-400"
						: "bg-white/10 text-white border-2 border-white/20 hover:bg-white/20"
				}
              `}
						>
							{skill}
						</button>
					))}
				</div>
			</div>

			<Button
				onClick={handleSubmit}
				className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
				disabled={selectedSkills.length === 0}
			>
				Continue
			</Button>
		</motion.div>
	);
};

export default SkillSelectionPills;
