
import React from "react";
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { CountryStatistic } from "@/hooks/admin/statistics/types";

// Updated GeoJSON URL that works
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapChartProps {
	countries: CountryStatistic[];
	isLoading?: boolean;
}

const WorldMapChart: React.FC<WorldMapChartProps> = ({ countries, isLoading }) => {
	// Find the highest count to normalize the colors
	const maxCount = Math.max(...countries.map((c) => c.count), 1);

	// Create color scale for countries based on user count
	const colorScale = scaleLinear<string>().domain([0, maxCount]).range(["#f1f0fb", "#9b87f5"]);

	// Map country names to ISO codes for highlighting
	const countryData = countries.reduce((acc, country) => {
		const isoCode = getCountryCode(country.country);
		if (isoCode) {
			acc[isoCode] = country.count;
		}
		return acc;
	}, {} as Record<string, number>);

	if (isLoading) {
		return (
			<div className="w-full h-[300px] bg-muted animate-pulse rounded-md flex items-center justify-center">
				<span className="text-muted-foreground">Loading map...</span>
			</div>
		);
	}

	return (
		<div className="w-full h-[300px] rounded-md overflow-hidden">
			<ComposableMap
				projectionConfig={{
					rotate: [-10, 0, 0],
					scale: 147,
				}}
				width={800}
				height={400}
				style={{
					width: "100%",
					height: "100%",
				}}
			>
				<Sphere stroke="#E4E5E6" strokeWidth={0.5} />
				<Graticule stroke="#E4E5E6" strokeWidth={0.5} />
				<Geographies geography={geoUrl}>
					{({ geographies }) =>
						geographies.map((geo) => {
							const code = geo.properties.ISO_A2;
							const isHighlighted = countryData[code];
							return (
								<Geography
									key={geo.rsmKey}
									geography={geo}
									fill={isHighlighted ? colorScale(countryData[code]) : "#F1F0FB"}
									stroke="#D6D6DA"
									strokeWidth={0.5}
									style={{
										default: { outline: "none" },
										hover: {
											outline: "none",
											fill: isHighlighted ? "#7E69AB" : "#F1F0FB",
										},
										pressed: { outline: "none" },
									}}
								/>
							);
						})
					}
				</Geographies>
			</ComposableMap>
			<div className="absolute bottom-2 right-2 bg-background/80 p-1 rounded text-xs text-muted-foreground">
				Top {countries.length} countries highlighted
			</div>
		</div>
	);
};

// Function to map country names to ISO codes
function getCountryCode(countryName: string): string | null {
	const countryMapping: Record<string, string> = {
		"United States": "US",
		USA: "US",
		"United States of America": "US",
		Canada: "CA",
		Mexico: "MX",
		Brazil: "BR",
		Argentina: "AR",
		"United Kingdom": "GB",
		UK: "GB",
		"Great Britain": "GB",
		France: "FR",
		Germany: "DE",
		Italy: "IT",
		Spain: "ES",
		Russia: "RU",
		China: "CN",
		India: "IN",
		Japan: "JP",
		Australia: "AU",
		"South Africa": "ZA",
		Nigeria: "NG",
		Egypt: "EG",
		Kenya: "KE",
		Ghana: "GH",
		Ethiopia: "ET",
		Morocco: "MA",
		Algeria: "DZ",
		Tunisia: "TN",
		Libya: "LY",
		Thailand: "TH",
		Vietnam: "VN",
		Indonesia: "ID",
		Malaysia: "MY",
		Philippines: "PH",
		Singapore: "SG",
		"South Korea": "KR",
		"North Korea": "KP",
		"New Zealand": "NZ",
		Afghanistan: "AF",
		Pakistan: "PK",
		Iran: "IR",
		Iraq: "IQ",
		"Saudi Arabia": "SA",
		Israel: "IL",
		Turkey: "TR",
		Greece: "GR",
		Sweden: "SE",
		Norway: "NO",
		Finland: "FI",
		Denmark: "DK",
		Ireland: "IE",
		Iceland: "IS",
		Belgium: "BE",
		Netherlands: "NL",
		Switzerland: "CH",
		Austria: "AT",
		Poland: "PL",
		Ukraine: "UA",
		"Côte d'Ivoire": "CI",
		"Ivory Coast": "CI",
		"Czech Republic": "CZ",
		Czechia: "CZ",
		Portugal: "PT",
	};

	if (!countryName) return null;

	// Try direct mapping
	if (countryMapping[countryName]) {
		return countryMapping[countryName];
	}

	// Try case-insensitive matching
	const lowerName = countryName.toLowerCase();
	for (const [key, value] of Object.entries(countryMapping)) {
		if (key.toLowerCase() === lowerName) {
			return value;
		}
	}

	return null;
}

export default WorldMapChart;
