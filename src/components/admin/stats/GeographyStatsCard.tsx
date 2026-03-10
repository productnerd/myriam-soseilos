import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/layout/Card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/data/Table";
import { Globe } from "lucide-react";
import { COUNTRY_FLAGS } from "@/types/countryFlags";
import WorldMapChart from "./WorldMapChart";
import { CountryStatistic } from "@/hooks/admin/statistics/types";

interface GeographyStatsCardProps {
	countries: CountryStatistic[];
	isLoading?: boolean;
}

const GeographyStatsCard: React.FC<GeographyStatsCardProps> = ({ countries, isLoading }) => {
	// Function to get flag emoji based on country name
	const getCountryFlag = (countryName: string): string => {
		if (!countryName) return "🌍";

		const foundFlag = COUNTRY_FLAGS.find(
			(flag) => flag.name.toLowerCase() === countryName.toLowerCase()
		);

		return foundFlag?.emoji || "🌍";
	};

	if (isLoading) {
		return (
			<Card>
				<CardHeader className="pb-2">
					<div className="flex items-center">
						<Globe className="h-5 w-5 mr-2 text-muted-foreground" />
						<CardTitle className="text-xl">Geography</CardTitle>
					</div>
					<CardDescription>Top countries by user count</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="h-[300px] bg-muted animate-pulse rounded-md"></div>
						{[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="flex justify-between animate-pulse">
								<div className="h-6 w-40 bg-muted rounded"></div>
								<div className="h-6 w-10 bg-muted rounded"></div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="pb-2">
				<div className="flex items-center">
					<Globe className="h-5 w-5 mr-2 text-muted-foreground" />
					<CardTitle className="text-xl">Geography</CardTitle>
				</div>
				<CardDescription>Top countries by user count</CardDescription>
			</CardHeader>
			<CardContent>
				{countries.length === 0 ? (
					<div className="text-center py-4 text-muted-foreground">
						No country data available
					</div>
				) : (
					<div className="space-y-4">
						<WorldMapChart countries={countries} />

						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Country</TableHead>
									<TableHead className="text-right">Users</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{countries.map((item, index) => (
									<TableRow key={index}>
										<TableCell>
											<div className="flex items-center gap-2">
												<span className="text-xl">
													{getCountryFlag(item.country)}
												</span>
												<span>{item.country || "Unknown"}</span>
											</div>
										</TableCell>
										<TableCell className="text-right font-medium">
											{item.count}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default GeographyStatsCard;
