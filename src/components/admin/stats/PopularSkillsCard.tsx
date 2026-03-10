import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/layout/Card";
import { PopularSkill } from "@/hooks/admin/statistics/types";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	LabelList,
} from "recharts";

interface PopularSkillsCardProps {
	skills: PopularSkill[];
}

export default function PopularSkillsCard({ skills }: PopularSkillsCardProps) {
	console.log("Popular skills in card:", skills); // Debug logging

	// Ensure skills is an array and has items
	const validSkills = Array.isArray(skills) ? skills : [];

	// Sort skills by count in descending order and take top 10
	const sortedSkills = [...validSkills].sort((a, b) => b.count - a.count).slice(0, 10);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Popular Skills</CardTitle>
				<CardDescription>Most popular skills selected during onboarding</CardDescription>
			</CardHeader>
			<CardContent>
				{sortedSkills.length === 0 ? (
					<div className="flex items-center justify-center h-48">
						<p className="text-muted-foreground italic">No skills data available</p>
					</div>
				) : (
					<div className="h-72">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={sortedSkills}
								layout="vertical"
								margin={{ top: 20, right: 50, left: 70, bottom: 5 }}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis type="number" name="Votes" />
								<YAxis
									type="category"
									dataKey="skill"
									tick={{ fontSize: 12 }}
									width={70}
								/>
								<Tooltip formatter={(value) => [`${value} votes`, "Votes"]} />
								<Bar dataKey="count" fill="#8884d8" name="Votes">
									<LabelList dataKey="count" position="right" />
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
