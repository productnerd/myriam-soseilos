import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/layout/Card";
import { Users, BookOpen, ArrowUpRight, BarChart, Gauge, TrendingUp, UserPlus } from "lucide-react";
import StatComparisonIndicator from "./StatComparisonIndicator";

interface UserStatsCardProps {
	dailyUsers: number;
	monthlyUsers: number;
	topicsPerUser: number;
	referralRate: number;
	activationRate: number;
	onboardingCompletionRate: number;
	newSignups: number;
	churnRate: number;
	prevDailyUsers?: number | null;
	prevMonthlyUsers?: number | null;
	prevTopicsPerUser?: number | null;
	prevReferralRate?: number | null;
	prevActivationRate?: number | null;
	prevOnboardingRate?: number | null;
	prevNewSignups?: number | null;
	prevChurnRate?: number | null;
	dailyUsersChange?: number | null;
	monthlyUsersChange?: number | null;
	topicsPerUserChange?: number | null;
	referralRateChange?: number | null;
	activationRateChange?: number | null;
	onboardingRateChange?: number | null;
	newSignupsChange?: number | null;
	churnRateChange?: number | null;
}

export default function UserStatsCard({
	dailyUsers,
	monthlyUsers,
	topicsPerUser,
	referralRate,
	activationRate,
	onboardingCompletionRate,
	newSignups,
	churnRate,
	prevDailyUsers,
	prevMonthlyUsers,
	prevTopicsPerUser,
	prevReferralRate,
	prevActivationRate,
	prevOnboardingRate,
	prevNewSignups,
	prevChurnRate,
	dailyUsersChange,
	monthlyUsersChange,
	topicsPerUserChange,
	referralRateChange,
	activationRateChange,
	onboardingRateChange,
	newSignupsChange,
	churnRateChange,
}: UserStatsCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>User Activity</CardTitle>
				<CardDescription>Daily and monthly active users</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid grid-cols-2 gap-4">
					<div className="flex flex-col space-y-1">
						<div className="flex items-center text-sm text-muted-foreground">
							<Users className="h-4 w-4 mr-1" />
							<span>Daily Active</span>
						</div>
						<span className="text-2xl font-bold">{dailyUsers}</span>
						<StatComparisonIndicator
							currentValue={dailyUsers}
							previousValue={prevDailyUsers}
							percentageChange={dailyUsersChange}
						/>
					</div>

					<div className="flex flex-col space-y-1">
						<div className="flex items-center text-sm text-muted-foreground">
							<Users className="h-4 w-4 mr-1" />
							<span>Monthly Active</span>
						</div>
						<span className="text-2xl font-bold">{monthlyUsers}</span>
						<StatComparisonIndicator
							currentValue={monthlyUsers}
							previousValue={prevMonthlyUsers}
							percentageChange={monthlyUsersChange}
						/>
					</div>

					<div className="flex flex-col space-y-1">
						<div className="flex items-center text-sm text-muted-foreground">
							<UserPlus className="h-4 w-4 mr-1" />
							<span>New Signups</span>
						</div>
						<span className="text-2xl font-bold">{newSignups}</span>
						<StatComparisonIndicator
							currentValue={newSignups}
							previousValue={prevNewSignups}
							percentageChange={newSignupsChange}
						/>
					</div>

					<div className="flex flex-col space-y-1">
						<div className="flex items-center text-sm text-muted-foreground">
							<TrendingUp className="h-4 w-4 mr-1" />
							<span>Churn Rate</span>
						</div>
						<span className="text-2xl font-bold">{churnRate}%</span>
						<StatComparisonIndicator
							currentValue={churnRate}
							previousValue={prevChurnRate}
							percentageChange={churnRateChange}
							isPercentage={true}
							invertColors={true}
						/>
					</div>

					<div className="flex flex-col space-y-1">
						<div className="flex items-center text-sm text-muted-foreground">
							<BookOpen className="h-4 w-4 mr-1" />
							<span>Topics/User</span>
						</div>
						<span className="text-2xl font-bold">{topicsPerUser}</span>
						<StatComparisonIndicator
							currentValue={topicsPerUser}
							previousValue={prevTopicsPerUser}
							percentageChange={topicsPerUserChange}
						/>
					</div>

					<div className="flex flex-col space-y-1">
						<div className="flex items-center text-sm text-muted-foreground">
							<ArrowUpRight className="h-4 w-4 mr-1" />
							<span>Referral Rate</span>
						</div>
						<span className="text-2xl font-bold">{referralRate}%</span>
						<StatComparisonIndicator
							currentValue={referralRate}
							previousValue={prevReferralRate}
							percentageChange={referralRateChange}
							isPercentage={true}
						/>
					</div>

					<div className="flex flex-col space-y-1">
						<div className="flex items-center text-sm text-muted-foreground">
							<Gauge className="h-4 w-4 mr-1" />
							<span>Activation Score</span>
						</div>
						<span className="text-2xl font-bold">{activationRate}%</span>
						<StatComparisonIndicator
							currentValue={activationRate}
							previousValue={prevActivationRate}
							percentageChange={activationRateChange}
							isPercentage={true}
						/>
					</div>

					<div className="flex flex-col space-y-1">
						<div className="flex items-center text-sm text-muted-foreground">
							<BarChart className="h-4 w-4 mr-1" />
							<span>Onboarding Rate</span>
						</div>
						<span className="text-2xl font-bold">{onboardingCompletionRate}%</span>
						<StatComparisonIndicator
							currentValue={onboardingCompletionRate}
							previousValue={prevOnboardingRate}
							percentageChange={onboardingRateChange}
							isPercentage={true}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
