
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import Stripe from "https://esm.sh/stripe@14.22.0";

// Setup Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Setup Stripe client
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
const stripe = new Stripe(stripeSecretKey);

// Set CORS headers
const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
	// Handle CORS preflight requests
	if (req.method === "OPTIONS") {
		return new Response(null, { headers: corsHeaders, status: 204 });
	}

	try {
		console.log("🚀 Starting checkout process");
		
		// Parse body and validate input
		let requestBody;
		try {
			requestBody = await req.json();
		} catch (parseError) {
			console.error("❌ Failed to parse request body:", parseError);
			return new Response(
				JSON.stringify({ error: "Invalid JSON in request body" }),
				{ status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
			);
		}

		const { storeItemId } = requestBody;
		if (!storeItemId) {
			console.error("❌ Missing storeItemId");
			return new Response(
				JSON.stringify({ error: "Missing required parameter: storeItemId" }),
				{ status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
			);
		}

		console.log("📦 Processing item:", storeItemId);

		// Get user ID from auth header
		const authHeader = req.headers.get("Authorization");
		if (!authHeader) {
			console.error("❌ No authorization header");
			return new Response(JSON.stringify({ error: "No authorization header" }), {
				status: 401,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		// Extract token without 'Bearer ' prefix
		const token = authHeader.replace("Bearer ", "");
		let user;
		try {
			const {
				data: { user: authUser },
				error: userError,
			} = await supabase.auth.getUser(token);

			if (userError || !authUser) {
				console.error("❌ Invalid user token:", userError);
				return new Response(JSON.stringify({ error: "Invalid user token" }), {
					status: 401,
					headers: { ...corsHeaders, "Content-Type": "application/json" },
				});
			}
			user = authUser;
		} catch (authError) {
			console.error("❌ Authentication error:", authError);
			return new Response(JSON.stringify({ error: "Authentication failed" }), {
				status: 401,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		console.log("👤 User authenticated:", user.id);

		// Get item details
		let storeItem;
		try {
			const { data, error: storeItemError } = await supabase
				.from("store_items")
				.select("*")
				.eq("id", storeItemId)
				.single();

			if (storeItemError || !data) {
				console.error("❌ Item not found:", storeItemError);
				return new Response(JSON.stringify({ error: "Item not found" }), {
					status: 404,
					headers: { ...corsHeaders, "Content-Type": "application/json" },
				});
			}
			storeItem = data;
		} catch (itemError) {
			console.error("❌ Error fetching item:", itemError);
			return new Response(JSON.stringify({ error: "Failed to fetch item" }), {
				status: 500,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		console.log("🏪 Item found:", storeItem.name);

		// Check if item is available
		if (storeItem.state !== "AVAILABLE") {
			console.error("❌ Item not available, state:", storeItem.state);
			return new Response(
				JSON.stringify({ error: "This item is not available for purchase" }),
				{ status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
			);
		}

		// Get user profile
		let profile;
		try {
			const { data, error: profileError } = await supabase
				.from("profiles")
				.select("grey_points, dark_points")
				.eq("id", user.id)
				.single();

			if (profileError || !data) {
				console.error("❌ User profile not found:", profileError);
				return new Response(JSON.stringify({ error: "User profile not found" }), {
					status: 404,
					headers: { ...corsHeaders, "Content-Type": "application/json" },
				});
			}
			profile = data;
		} catch (profileError) {
			console.error("❌ Error fetching profile:", profileError);
			return new Response(JSON.stringify({ error: "Failed to fetch user profile" }), {
				status: 500,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		console.log("👤 User profile:", { 
			grey_points: profile.grey_points, 
			dark_points: profile.dark_points 
		});

		// Check if user has enough grey points to unlock
		if (storeItem.grey_to_unlock && profile.grey_points < storeItem.grey_to_unlock) {
			console.error("❌ Not enough grey points:", {
				required: storeItem.grey_to_unlock,
				available: profile.grey_points
			});
			return new Response(
				JSON.stringify({
					error: "Not enough Grey Points",
					required: storeItem.grey_to_unlock,
					available: profile.grey_points,
				}),
				{ status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
			);
		}

		// Check if user has enough dark points
		if (storeItem.dark_price && profile.dark_points < storeItem.dark_price) {
			console.error("❌ Not enough dark points:", {
				required: storeItem.dark_price,
				available: profile.dark_points
			});
			return new Response(
				JSON.stringify({
					error: "Not enough Dark Points",
					required: storeItem.dark_price,
					available: profile.dark_points,
				}),
				{ status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
			);
		}

		console.log("✅ User has sufficient points");

		// Create Stripe checkout session FIRST
		let session;
		try {
			session = await stripe.checkout.sessions.create({
				payment_method_types: ["card"],
				line_items: [
					{
						price_data: {
							currency: "usd",
							product_data: {
								name: storeItem.name,
								description: storeItem.description,
								images: storeItem.images || [],
							},
							unit_amount: Math.round((storeItem.usd_price || 0) * 100), // Convert to cents
						},
						quantity: 1,
					},
				],
				mode: "payment",
				success_url: `${req.headers.get(
					"origin"
				)}/store?transaction=success&session={CHECKOUT_SESSION_ID}`,
				cancel_url: `${req.headers.get(
					"origin"
				)}/store?transaction=canceled&session={CHECKOUT_SESSION_ID}`,
				client_reference_id: user.id,
				metadata: {
					store_item_id: storeItem.id,
					user_id: user.id,
				},
			});
		} catch (stripeError) {
			console.error("❌ Stripe session creation error:", stripeError);
			return new Response(JSON.stringify({ 
				error: "Failed to create checkout session",
				details: stripeError.message
			}), {
				status: 500,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		console.log("💳 Stripe session created:", session.id);

		// Now create transaction record with the Stripe session ID
		let transaction;
		try {
			const { data, error: transactionError } = await supabase
				.from("store_orders")
				.insert([
					{
						user_id: user.id,
						store_item_id: storeItem.id,
						dark_points_spent: storeItem.dark_price || 0,
						usd_amount: storeItem.usd_price || 0,
						stripe_session_id: session.id, // Now we have the session ID
						status: "pending",
					},
				])
				.select()
				.single();

			if (transactionError) {
				console.error("❌ Failed to create transaction:", transactionError);
				return new Response(JSON.stringify({ 
					error: "Failed to create transaction", 
					details: transactionError.message 
				}), {
					status: 500,
					headers: { ...corsHeaders, "Content-Type": "application/json" },
				});
			}
			transaction = data;
		} catch (transactionError) {
			console.error("❌ Transaction creation error:", transactionError);
			return new Response(JSON.stringify({ error: "Failed to create transaction" }), {
				status: 500,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		console.log("📝 Transaction created:", transaction.id);
		console.log("✅ Checkout process completed successfully");

		return new Response(
			JSON.stringify({
				success: true,
				url: session.url,
				session_id: session.id,
			}),
			{
				status: 200,
				headers: {
					...corsHeaders,
					"Content-Type": "application/json",
				},
			}
		);
	} catch (error) {
		console.error("💥 Unexpected error in checkout:", error);

		return new Response(JSON.stringify({ 
			error: "Internal server error", 
			details: error.message,
			stack: error.stack
		}), {
			status: 500,
			headers: {
				...corsHeaders,
				"Content-Type": "application/json",
			},
		});
	}
});
