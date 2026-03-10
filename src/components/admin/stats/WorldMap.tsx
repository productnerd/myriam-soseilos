import React, { useEffect, useRef } from "react";
import { CountryStatistic } from "@/hooks/admin/statistics/types";

interface WorldMapProps {
	countries: CountryStatistic[];
	isLoading?: boolean;
}

const WorldMap: React.FC<WorldMapProps> = ({ countries, isLoading }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Draw the world map with highlighted countries
	useEffect(() => {
		if (isLoading || !canvasRef.current || countries.length === 0) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Set canvas dimensions
		const width = canvas.width;
		const height = canvas.height;

		// Draw basic world map outline
		ctx.fillStyle = "#e5e7eb"; // Light gray background
		ctx.fillRect(0, 0, width, height);

		// Draw ocean
		ctx.fillStyle = "#d3e4fd"; // Light blue for water
		ctx.fillRect(0, 0, width, height);

		// Draw default land masses with a light color
		ctx.fillStyle = "#f1f0fb"; // Very light gray for land
		drawWorldMapOutline(ctx, width, height);

		// Find the highest count to normalize the colors
		const maxCount = Math.max(...countries.map((c) => c.count));

		// Highlight the top countries with different color intensities
		countries.forEach((country, index) => {
			const countryCode = getCountryCode(country.country);
			if (countryCode) {
				// Calculate color intensity based on count
				const intensity = 0.2 + 0.8 * (country.count / maxCount);
				ctx.fillStyle = `rgba(155, 135, 245, ${intensity})`; // Purple with varying opacity

				// Draw the country
				drawCountry(ctx, countryCode, width, height);
			}
		});
	}, [countries, isLoading]);

	if (isLoading) {
		return (
			<div className="w-full h-[300px] bg-muted animate-pulse rounded-md flex items-center justify-center">
				<span className="text-muted-foreground">Loading map...</span>
			</div>
		);
	}

	return (
		<div className="relative w-full h-[300px] overflow-hidden rounded-md">
			<canvas
				ref={canvasRef}
				width={600}
				height={300}
				className="w-full h-full object-cover"
			/>
			<div className="absolute bottom-2 right-2 bg-background/80 p-1 rounded text-xs text-muted-foreground">
				Top {countries.length} countries highlighted
			</div>
		</div>
	);
};

// Simple function to draw a basic world map outline
function drawWorldMapOutline(ctx: CanvasRenderingContext2D, width: number, height: number) {
	// This is a simplified version - in a real app you would use GeoJSON or a mapping library
	// Draw major continents as simplified shapes

	// North America
	ctx.beginPath();
	ctx.moveTo(width * 0.1, height * 0.2);
	ctx.lineTo(width * 0.3, height * 0.2);
	ctx.lineTo(width * 0.28, height * 0.5);
	ctx.lineTo(width * 0.16, height * 0.5);
	ctx.fill();

	// South America
	ctx.beginPath();
	ctx.moveTo(width * 0.25, height * 0.5);
	ctx.lineTo(width * 0.3, height * 0.5);
	ctx.lineTo(width * 0.28, height * 0.8);
	ctx.lineTo(width * 0.22, height * 0.8);
	ctx.fill();

	// Europe
	ctx.beginPath();
	ctx.moveTo(width * 0.45, height * 0.2);
	ctx.lineTo(width * 0.52, height * 0.2);
	ctx.lineTo(width * 0.55, height * 0.35);
	ctx.lineTo(width * 0.45, height * 0.4);
	ctx.fill();

	// Africa
	ctx.beginPath();
	ctx.moveTo(width * 0.45, height * 0.4);
	ctx.lineTo(width * 0.55, height * 0.35);
	ctx.lineTo(width * 0.55, height * 0.65);
	ctx.lineTo(width * 0.48, height * 0.7);
	ctx.fill();

	// Asia
	ctx.beginPath();
	ctx.moveTo(width * 0.55, height * 0.2);
	ctx.lineTo(width * 0.8, height * 0.2);
	ctx.lineTo(width * 0.8, height * 0.5);
	ctx.lineTo(width * 0.55, height * 0.5);
	ctx.fill();

	// Australia
	ctx.beginPath();
	ctx.moveTo(width * 0.75, height * 0.55);
	ctx.lineTo(width * 0.85, height * 0.55);
	ctx.lineTo(width * 0.85, height * 0.7);
	ctx.lineTo(width * 0.75, height * 0.7);
	ctx.fill();
}

// Function to draw a specific country based on its code
function drawCountry(
	ctx: CanvasRenderingContext2D,
	countryCode: string,
	width: number,
	height: number
) {
	// In a real app, you would use a mapping library with GeoJSON data
	// This is a simplified version with approximate positions for some countries

	const countryPositions: Record<string, [number, number, number, number]> = {
		US: [0.15, 0.3, 0.15, 0.1], // x, y, width, height
		CA: [0.15, 0.2, 0.15, 0.1],
		MX: [0.15, 0.4, 0.1, 0.05],
		BR: [0.25, 0.6, 0.08, 0.1],
		AR: [0.23, 0.7, 0.06, 0.1],
		GB: [0.45, 0.25, 0.03, 0.03],
		FR: [0.46, 0.28, 0.03, 0.03],
		DE: [0.48, 0.25, 0.03, 0.03],
		IT: [0.48, 0.3, 0.02, 0.04],
		ES: [0.43, 0.3, 0.03, 0.03],
		RU: [0.6, 0.2, 0.2, 0.15],
		CN: [0.7, 0.35, 0.1, 0.08],
		IN: [0.65, 0.4, 0.08, 0.08],
		JP: [0.82, 0.3, 0.03, 0.05],
		AU: [0.8, 0.6, 0.08, 0.08],
		ZA: [0.5, 0.65, 0.05, 0.05],
		NG: [0.47, 0.5, 0.04, 0.03],
		EG: [0.52, 0.4, 0.04, 0.03],
	};

	const position = countryPositions[countryCode];
	if (position) {
		ctx.beginPath();
		ctx.rect(
			position[0] * width,
			position[1] * height,
			position[2] * width,
			position[3] * height
		);
		ctx.fill();
	}
}

// Function to map country names to country codes (simplified)
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
	};

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

export default WorldMap;
