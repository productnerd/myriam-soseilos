import React from "react";
import { UserFeedback } from "@/types/user";
import { TableBody, TableCell, TableRow } from "@/components/ui/data/Table";
import { Trophy, Award } from "lucide-react";

interface FeedbackListProps {
	feedback: UserFeedback[];
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedback }) => {
	if (!feedback || feedback.length === 0) {
		return (
			<TableBody>
				<TableRow>
					<TableCell colSpan={6} className="text-center py-6">
						<div className="p-4">
							<p className="text-lg font-medium mb-2">No feedback submissions yet</p>
							<p className="text-muted-foreground">
								Feedback from users will appear here
							</p>
						</div>
					</TableCell>
				</TableRow>
			</TableBody>
		);
	}

	return (
		<TableBody>
			{feedback.map((item) => (
				<TableRow
					key={item.id}
					data-state="" // Remove hover and selection states
					className="hover:bg-transparent" // Disable hover effect
				>
					<TableCell>
						<div className="flex items-center gap-1">
							<span>{item.user?.name || "Unknown User"}</span>
							{item.user?.flag && <span>{item.user.flag}</span>}
						</div>
					</TableCell>
					<TableCell>{item.user?.email || "No email"}</TableCell>
					<TableCell>
						<div className="flex flex-col gap-1">
							<div className="flex items-center gap-1">
								<Trophy size={16} className="text-amber-400" />
								<span>{item.user?.grey_points || 0}</span>
							</div>
							<div className="flex items-center gap-1">
								<Award size={16} className="text-purple-500" />
								<span>{item.user?.dark_points || 0}</span>
							</div>
						</div>
					</TableCell>
					<TableCell>
						<div className="flex flex-wrap gap-1">
							{item.user?.tags &&
								item.user.tags
									.filter((tag) => tag !== "CONTRIBUTOR")
									.map((tag) => tag)
									.join(", ")}
						</div>
					</TableCell>
					<TableCell className="max-w-md whitespace-pre-wrap break-words">
						{item.comment}
					</TableCell>
					<TableCell>
						<span className="text-sm text-muted-foreground">{item.formattedDate}</span>
					</TableCell>
				</TableRow>
			))}
		</TableBody>
	);
};

export default FeedbackList;
