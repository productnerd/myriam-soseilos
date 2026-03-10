import React from "react";
import { Progress } from "@/components/ui/data/Progress";
import { Button } from "@/components/ui/interactive/Button";
import { Badge } from "@/components/ui/data/Badge";
import { motion } from "framer-motion";

export interface SkillStat {
	skill: string;
	percentage: number; // Actually used to store the count
}

interface SkillVoteStatsProps {
	stats: SkillStat[];
	onContinue: () => void;
}

const SkillVoteStats: React.FC<SkillVoteStatsProps> = ({ stats, onContinue }) => {
	// Find the maximum count to calculate relative percentages for the progress bar
	const maxCount = Math.max(...stats.map((stat) => stat.percentage), 1);

	// Available courses that can be taken now
	const availableSkills = [
		"Use tech like a pro",
		"Master your finances",
		"Build a strong, capable body",
	];

	// Coming soon courses
	const comingSoonSkills = ["Run your life smoothly", "Write like the 1%", "Eat like an adult"];

	const getSkillBadge = (skillName: string) => {
		if (availableSkills.some((skill) => skillName.toLowerCase() === skill.toLowerCase())) {
			return (
				<Badge
					variant="default"
					className="bg-green-600 text-white text-xs px-1.5 py-0.5 ml-2"
				>
					AVAILABLE
				</Badge>
			);
		}
		if (comingSoonSkills.some((skill) => skillName.toLowerCase() === skill.toLowerCase())) {
			return (
				<Badge
					variant="secondary"
					className="bg-gray-500 text-white text-xs px-1.5 py-0.5 ml-2"
				>
					COMING SOON
				</Badge>
			);
		}
		return null;
	};

	return (
		<motion.div
			initial={{
				opacity: 0,
				y: 20,
			}}
			animate={{
				opacity: 1,
				y: 0,
			}}
			className="space-y-6 flex flex-col h-full"
		>
			<div className="text-center space-y-2">
				<h3 className="text-lg font-medium text-white">What others want to learn</h3>
			</div>

			<div className="space-y-4 flex-1">
				{stats.length > 0 ? (
					stats.map((stat, index) => (
						<div key={index} className="space-y-1">
							<div className="flex justify-between items-center text-sm">
								<div className="flex items-center">
									<span className="text-white">{stat.skill}</span>
									{getSkillBadge(stat.skill)}
								</div>
								<span className="text-white/70">{stat.percentage} votes</span>
							</div>
							<Progress
								value={(stat.percentage / maxCount) * 100}
								className="h-2 bg-white/20"
							/>
						</div>
					))
				) : (
					<div className="text-center py-8">
						<p className="text-white/70 text-sm">
							No votes yet! You'll be among the first to help us understand what
							people want to learn.
						</p>
					</div>
				)}
			</div>

			<Button
				onClick={onContinue}
				className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
			>
				Continue
			</Button>
		</motion.div>
	);
};

export default SkillVoteStats;
