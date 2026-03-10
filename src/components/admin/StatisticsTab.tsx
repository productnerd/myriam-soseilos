import { useEffect } from "react";
import { useAdminStatistics, useManualStatisticsRefresh } from "@/hooks/admin/useAdminStatistics";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/layout/Card";
import { useToast } from "@/hooks/ui/useToast";
import { format } from "date-fns";

// Stats display components
import UserStatsCard from "./stats/UserStatsCard";
import PopularSkillsCard from "./stats/PopularSkillsCard";
import PopularCoursesCard from "./stats/PopularCoursesCard";
import SidequestCompletionCard from "./stats/SidequestCompletionCard";
import GeographyStatsCard from "./stats/GeographyStatsCard";

export default function StatisticsTab() {
	const { data: statistics, isLoading, error, refetch } = useAdminStatistics();
	const { refetch: refreshStatistics, isLoading: isRefreshing } = useManualStatisticsRefresh();
	const { toast } = useToast();

	useEffect(() => {
		const initialRefresh = async () => {
			try {
				await refreshStatistics();
				await refetch();
				console.log("Initial statistics refresh completed");
			} catch (error) {
				console.error("Error during initial statistics refresh:", error);
			}
		};

		initialRefresh();
	}, []);

	console.log("Statistics Tab - Current data:", statistics);

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{[1, 2, 3, 4, 5].map((i) => (
						<Card key={i} className="animate-pulse">
							<CardHeader className="pb-2">
								<div className="h-6 w-24 bg-muted rounded mb-2"></div>
								<div className="h-4 w-32 bg-muted rounded"></div>
							</CardHeader>
							<CardContent>
								<div className="h-40 bg-muted rounded"></div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	if (error || !statistics) {
		return (
			<Card className="p-6">
				<CardTitle className="mb-2">Error Loading Statistics</CardTitle>
				<CardDescription>
					There was a problem loading the platform statistics.
					{error && <p className="mt-2 text-red-500">{(error as Error).message}</p>}
				</CardDescription>
				<Button onClick={() => refetch()} className="mt-4">
					Try Again
				</Button>
			</Card>
		);
	}

	const lastUpdated = statistics?.daily_active_users?.updated
		? format(new Date(statistics.daily_active_users.updated), "PPpp")
		: "Unknown";

	// Access the statistics data
	const dailyActiveStats = statistics.daily_active_users?.value || { count: 0 };
	const monthlyActiveStats = statistics.monthly_active_users?.value || { count: 0 };
	const topicsPerUserStats = statistics.avg_topics_per_user?.value || { average: 0 };
	const referralRateStats = statistics.referral_rate?.value || { percentage: 0 };
	const activationRateStats = statistics.activation_rate?.value || { percentage: 0 };
	const onboardingRateStats = statistics.onboarding_completion_rate?.value || { percentage: 0 };
	const newSignupsStats = statistics.new_user_signups?.value || { count: 0 };
	const churnRateStats = statistics.churn_rate?.value || { percentage: 0 };
	const countryStats = statistics.country_statistics?.value || [];

	return (
		<div className="space-y-6 pb-12">
			<div className="flex flex-col items-end">
				<p className="text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<UserStatsCard
					dailyUsers={dailyActiveStats.count || 0}
					monthlyUsers={monthlyActiveStats.count || 0}
					topicsPerUser={topicsPerUserStats.average || 0}
					referralRate={referralRateStats.percentage || 0}
					activationRate={activationRateStats.percentage || 0}
					onboardingCompletionRate={onboardingRateStats.percentage || 0}
					newSignups={newSignupsStats.count || 0}
					churnRate={churnRateStats.percentage || 0}
					// Week-over-week comparison data
					prevDailyUsers={dailyActiveStats.previous_count}
					prevMonthlyUsers={monthlyActiveStats.previous_count}
					prevTopicsPerUser={topicsPerUserStats.previous_average}
					prevReferralRate={referralRateStats.previous_percentage}
					prevActivationRate={activationRateStats.previous_percentage}
					prevOnboardingRate={onboardingRateStats.previous_percentage}
					prevNewSignups={newSignupsStats.previous_count}
					prevChurnRate={churnRateStats.previous_percentage}
					// Percentage changes
					dailyUsersChange={dailyActiveStats.percentage_change}
					monthlyUsersChange={monthlyActiveStats.percentage_change}
					topicsPerUserChange={topicsPerUserStats.percentage_change}
					referralRateChange={referralRateStats.percentage_change}
					activationRateChange={activationRateStats.percentage_change}
					onboardingRateChange={onboardingRateStats.percentage_change}
					newSignupsChange={newSignupsStats.percentage_change}
					churnRateChange={churnRateStats.percentage_change}
				/>

				<GeographyStatsCard countries={countryStats} isLoading={isLoading} />

				<PopularSkillsCard skills={statistics.popular_skills?.value || []} />

				<PopularCoursesCard courses={statistics.popular_courses?.value || []} />

				<SidequestCompletionCard
					sidequests={statistics.sidequest_completion?.value || []}
				/>
			</div>
		</div>
	);
}

// Add missing imports
import { Button } from "@/components/ui/interactive/Button";
