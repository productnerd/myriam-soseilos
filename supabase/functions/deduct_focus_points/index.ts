// supabase/functions/deduct_focus_points/index.ts
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
		const { user_id, is_correct } = await req.json();

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

		// Call the deduct_focus_points function
		const { data, error } = await supabaseClient.rpc("deduct_focus_points", {
			p_user_id: user_id,
			p_is_correct: is_correct,
		});

		if (error) throw error;

		return new Response(
			JSON.stringify({
				success: true,
				current_focus: data,
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
