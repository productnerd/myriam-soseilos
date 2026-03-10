import React from "react";
import { Card, CardContent } from "@/components/ui/layout/Card";
import { pointTypes } from "@/lib/ui";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/layout/Accordion";
import { FeatureTimeline } from "./FeatureTimeline";
import { useUserContext } from "@/contexts/UserContext";
import { useFlowPoints } from "@/hooks/points/useFlowPoints";

interface ProfileStatsProps {
	darkPoints: number;
	greyPoints: number;
	streakPoints: number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ darkPoints, greyPoints, streakPoints }) => {
	const { user } = useUserContext();

	const { flowBalance } = useFlowPoints(user?.id || null);
	const { grey, dark, streak, flow } = pointTypes;

	// Don't render if user details are not available yet
	if (!user) {
		return null;
	}

	return (
		<div className="space-y-6 mb-6 text-left">
			{/* Main Grey Points Card with Accordion */}
			<Card>
				<CardContent className="p-0">
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem value="timeline" className="border-none">
							<AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
								<div className="flex items-center space-x-4 text-left">
									<grey.icon className="h-12 w-12 flex-shrink-0" size={52} />
									<div className="text-left flex-1">
										<div className="flex items-baseline gap-2">
											<span className="text-sm text-muted-foreground">
												Wise Points
											</span>
										</div>
										<p className="text-3xl font-bold text-left">{greyPoints}</p>
									</div>
								</div>
							</AccordionTrigger>
							<AccordionContent className="px-6 pb-6">
								<div className="text-left">
									<FeatureTimeline currentPoints={greyPoints} />
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</CardContent>
			</Card>

			{/* Other Points Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* Flow Points */}
				<Card className={`${flow.bgLight} ${flow.borderLight} border`}>
					<CardContent className="p-6">
						<div className="flex items-center space-x-4 text-left">
							<flow.icon className="h-12 w-12 flex-shrink-0" size={52} />
							<div className="text-left flex-1">
								<p className={`text-sm ${flow.textColor} opacity-80 text-left`}>
									Flow Points
								</p>
								<p className={`text-3xl font-bold ${flow.textColor} text-left`}>
									{flowBalance || 0}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Dark Points */}
				<Card className={`${dark.bgLight} ${dark.borderLight} border`}>
					<CardContent className="p-6">
						<div className="flex items-center space-x-4 text-left">
							<dark.icon className="h-12 w-12 flex-shrink-0" size={52} />
							<div className="text-left flex-1">
								<p className={`text-sm ${dark.textColor} opacity-80 text-left`}>
									Dark Points
								</p>
								<p className={`text-3xl font-bold ${dark.textColor} text-left`}>
									{darkPoints}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Streak Points */}
				<Card className={`${streak.bgLight} ${streak.borderLight} border`}>
					<CardContent className="p-6">
						<div className="flex items-center space-x-4 text-left">
							<streak.icon className="h-12 w-12 flex-shrink-0" size={52} />
							<div className="text-left flex-1">
								<p className={`text-sm ${streak.textColor} opacity-80 text-left`}>
									Streak Points
								</p>
								<p className={`text-3xl font-bold ${streak.textColor} text-left`}>
									{streakPoints}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
export default ProfileStats;
