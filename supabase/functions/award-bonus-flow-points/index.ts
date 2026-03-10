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
		const { bonusPoints, streak } = await req.json();

		// Create Supabase client
		const supabaseClient = createClient(
			Deno.env.get("SUPABASE_URL") ?? "",
			Deno.env.get("SUPABASE_ANON_KEY") ?? "",
			{
				global: {
					headers: { Authorization: req.headers.get("Authorization")! },
				},
			}
		);

		// Get the user from the auth token
		const {
			data: { user },
			error: userError,
		} = await supabaseClient.auth.getUser();

		if (userError || !user) {
			throw new Error("Unauthorized");
		}

		// Add bonus flow points to user's balance
		const { data, error } = await supabaseClient
			.from("profiles")
			.select("flow_balance")
			.eq("id", user.id)
			.single();

		if (error) throw error;

		const currentBalance = data.flow_balance || 0;
		const maxFlow = 120;
		const newBalance = Math.min(currentBalance + bonusPoints, maxFlow);

		// Update the user's flow balance
		const { error: updateError } = await supabaseClient
			.from("profiles")
			.update({
				flow_balance: newBalance,
				flow_last_updated_at: new Date().toISOString(),
			})
			.eq("id", user.id);

		if (updateError) throw updateError;

		return new Response(
			JSON.stringify({
				success: true,
				newBalance,
				bonusPoints,
				streak,
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
