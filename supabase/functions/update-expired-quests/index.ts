// This function runs on a schedule to update quests that have expired

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
	// Handle CORS preflight requests
	if (req.method === "OPTIONS") {
		return new Response("ok", { headers: corsHeaders });
	}

	try {
		// Get the authorization header
		const authHeader = req.headers.get("Authorization");
		if (!authHeader) {
			return new Response(JSON.stringify({ error: "No authorization header" }), {
				status: 401,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		// Connect to Supabase
		const supabaseClient = await createClient(
			Deno.env.get("SUPABASE_URL") ?? "",
			Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
			{ global: { headers: { Authorization: authHeader } } }
		);

		// Update expired quests
		const { data, error } = await supabaseClient.rpc("update_expired_sidequests");

		if (error) {
			return new Response(JSON.stringify({ error: error.message }), {
				status: 400,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		return new Response(JSON.stringify({ success: true, data }), {
			status: 200,
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 400,
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		});
	}
});

// Helper to create Supabase client
async function createClient(supabaseUrl: string, supabaseKey: string, options: any) {
	const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.5.0");
	return createClient(supabaseUrl, supabaseKey, options);
}
