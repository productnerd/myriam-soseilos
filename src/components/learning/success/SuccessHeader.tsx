import React from "react";
import { Award } from "lucide-react";

interface SuccessHeaderProps {
	title: string;
	subtitle: string;
	pointsEarned?: number | null;
	darkPointsEarned?: number | null;
}

const SuccessHeader: React.FC<SuccessHeaderProps> = ({
	title,
	subtitle,
	pointsEarned,
	darkPointsEarned,
}) => {
	return (
		<div className="text-center mb-4">
			<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
				<Award className="h-8 w-8 text-green-600" />
			</div>
			<h2 className="text-2xl font-bold">{title}</h2>
			<p className="text-muted-foreground mt-1">{subtitle}</p>

			{/* Display points if provided */}
			{pointsEarned !== undefined && pointsEarned !== null && (
				<div className="mt-3 text-lg font-semibold text-primary">
					+{pointsEarned} points earned
				</div>
			)}

			{/* Display dark points if provided */}
			{darkPointsEarned !== undefined &&
				darkPointsEarned !== null &&
				darkPointsEarned > 0 && (
					<div className="mt-1 text-sm font-medium text-purple-600">
						+{darkPointsEarned} dark points earned
					</div>
				)}
		</div>
	);
};

export default SuccessHeader;
