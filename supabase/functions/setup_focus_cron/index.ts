// supabase/functions/setup_focus_cron/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
	// Handle CORS preflight requests
	if (req.method === "OPTIONS") {
		return new Response(null, { headers: corsHeaders });
	}

	try {
		// Create Supabase client with SERVICE ROLE key (needed for cron job setup)
		const supabaseClient = createClient(
			Deno.env.get("SUPABASE_URL") ?? "",
			Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
		);

		// Set up cron job to run replenish_focus_points ONLY at even hours
		// The '0 0,2,4,6,8,10,12,14,16,18,20,22 * * *' cron expression means:
		// "Run at minute 0 of hours 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, and 22 of every day"
		const { error: setupError } = await supabaseClient.rpc("cron.schedule", {
			job_name: "replenish-focus-points-even-hours",
			schedule: "0 0,2,4,6,8,10,12,14,16,18,20,22 * * *", // Run at even hours
			command: `SELECT replenish_focus_points();`,
		});

		if (setupError) throw setupError;

		// Set up cron job to check streaks at midnight
		const { error: streakError } = await supabaseClient.rpc("cron.schedule", {
			job_name: "check-and-reset-streaks-midnight",
			schedule: "0 0 * * *", // Run at midnight (00:00)
			command: `SELECT check_and_reset_streaks();`,
		});

		if (streakError) throw streakError;

		return new Response(
			JSON.stringify({
				success: true,
				message: "Focus point replenishment and streak check cron jobs have been set up",
			}),
			{
				headers: {
					"Content-Type": "application/json",
					...corsHeaders,
				},
			}
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				success: false,
				error: error.message,
			}),
			{
				status: 400,
				headers: {
					"Content-Type": "application/json",
					...corsHeaders,
				},
			}
		);
	}
});
