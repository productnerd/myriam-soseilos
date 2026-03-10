// TODO: There is already logic to fetch the OpenAI API key in `src/integrations/openai/client.ts`. Why is this needed?

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
	if (req.method === "OPTIONS") {
		return new Response("ok", { headers: corsHeaders });
	}

	try {
		const apiKey = Deno.env.get("OPENAI_API_KEY");

		if (!apiKey) {
			return new Response(
				JSON.stringify({ error: "OPENAI_API_KEY not found in environment" }),
				{
					status: 404,
					headers: { ...corsHeaders, "Content-Type": "application/json" },
				}
			);
		}

		return new Response(JSON.stringify({ apiKey }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		});
	}
});
