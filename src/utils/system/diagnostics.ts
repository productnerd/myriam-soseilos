import { supabase } from "@/integrations/supabase/client";

// Check database schema health
export async function checkDatabaseSchemaHealth() {
	const diagnostics: string[] = [];
	let isHealthy = true;

	// Check required tables
	const requiredTables = [
		"profiles",
		"activities",
		"submissions",
		"quests",
		"user_progress",
		"courses",
		"levels",
		"topics",
	];

	for (const table of requiredTables) {
		const { data, error } = await supabase.from(table).select("count", { count: "exact" });

		if (error) {
			diagnostics.push(`Error accessing ${table} table: ${error.message}`);
			isHealthy = false;
		} else {
			diagnostics.push(`Table ${table} exists and has ${data[0].count} rows`);
		}
	}

	// Check foreign key relationships
	const relationships = [
		{ table: "activities", foreign_key: "topic_id", referenced_table: "topics" },
		{ table: "submissions", foreign_key: "user_id", referenced_table: "profiles" },
		{ table: "quests", foreign_key: "topic_id", referenced_table: "topics" },
		{ table: "user_progress", foreign_key: "user_id", referenced_table: "profiles" },
		{ table: "topics", foreign_key: "level_id", referenced_table: "levels" },
		{ table: "levels", foreign_key: "course_id", referenced_table: "courses" },
	];

	for (const rel of relationships) {
		const { data, error } = await supabase
			.from(rel.table)
			.select(`${rel.foreign_key}, ${rel.referenced_table}!inner(*)`)
			.limit(1);

		if (error) {
			diagnostics.push(
				`Error checking relationship ${rel.table}.${rel.foreign_key} -> ${rel.referenced_table}: ${error.message}`
			);
			isHealthy = false;
		} else {
			diagnostics.push(
				`Relationship ${rel.table}.${rel.foreign_key} -> ${rel.referenced_table} is valid`
			);
		}
	}

	// Check required columns
	const columnChecks = [
		{ table: "profiles", columns: ["id", "name", "email", "avatar_url"] },
		{ table: "activities", columns: ["id", "topic_id", "type", "main_text", "correct_answer"] },
		{ table: "submissions", columns: ["id", "user_id", "activity_id", "answer", "is_correct"] },
		{ table: "quests", columns: ["id", "title", "description", "topic_id"] },
	];

	for (const check of columnChecks) {
		const { data, error } = await supabase
			.from(check.table)
			.select(check.columns.join(","))
			.limit(1);

		if (error) {
			diagnostics.push(`Error checking columns in ${check.table}: ${error.message}`);
			isHealthy = false;
		} else {
			diagnostics.push(
				`Table ${check.table} has all required columns: ${check.columns.join(", ")}`
			);
		}
	}

	return {
		isHealthy,
		diagnostics,
	};
}

// Check system configuration
export async function checkSystemConfiguration() {
	const diagnostics: string[] = [];
	let isHealthy = true;

	// Check environment variables
	const requiredEnvVars = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];

	for (const envVar of requiredEnvVars) {
		if (!import.meta.env[envVar]) {
			diagnostics.push(`Missing required environment variable: ${envVar}`);
			isHealthy = false;
		} else {
			diagnostics.push(`Environment variable ${envVar} is set`);
		}
	}

	// Check Supabase connection
	try {
		const { data, error } = await supabase.from("profiles").select("count", { count: "exact" });
		if (error) throw error;
		diagnostics.push("Supabase connection is working");
	} catch (error) {
		diagnostics.push(`Error connecting to Supabase: ${error}`);
		isHealthy = false;
	}

	return {
		isHealthy,
		diagnostics,
	};
}
