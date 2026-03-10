import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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
		// Parse request body
		const { productId } = await req.json();

		if (!productId) {
			throw new Error("Product ID is required");
		}

		// Initialize Stripe with your secret key
		const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
			apiVersion: "2023-10-16",
		});

		// Create a Supabase client using the anon key
		const supabaseClient = createClient(
			Deno.env.get("SUPABASE_URL") ?? "",
			Deno.env.get("SUPABASE_ANON_KEY") ?? ""
		);

		// Get user information if authenticated
		let userEmail = "guest@example.com"; // Default for guest checkout
		const authHeader = req.headers.get("Authorization");

		if (authHeader) {
			const token = authHeader.replace("Bearer ", "");
			const { data } = await supabaseClient.auth.getUser(token);
			userEmail = data.user?.email || userEmail;
		}

		// Create checkout session
		const session = await stripe.checkout.sessions.create({
			customer_email: userEmail,
			line_items: [
				{
					price_data: {
						currency: "usd",
						product: productId,
						unit_amount: 4999, // $49.99 in cents - you can make this dynamic based on product
					},
					quantity: 1,
				},
			],
			mode: "payment",
			success_url: `${req.headers.get("origin")}/payment-success`,
			cancel_url: `${req.headers.get("origin")}/payment-canceled`,
		});

		return new Response(JSON.stringify({ url: session.url }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
			status: 200,
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		return new Response(JSON.stringify({ error: errorMessage }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
			status: 500,
		});
	}
});
