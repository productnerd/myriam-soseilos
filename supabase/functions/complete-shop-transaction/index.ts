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
		// Parse body and validate input
		const { sessionId } = await req.json();
		if (!sessionId) {
			return new Response(
				JSON.stringify({ error: "Missing required parameter: sessionId" }),
				{ status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
			);
		}

		// Get user ID from auth header
		const authHeader = req.headers.get("Authorization");
		if (!authHeader) {
			return new Response(JSON.stringify({ error: "No authorization header" }), {
				status: 401,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		// Extract token without 'Bearer ' prefix
		const token = authHeader.replace("Bearer ", "");
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser(token);

		if (userError || !user) {
			return new Response(JSON.stringify({ error: "Invalid user token" }), {
				status: 401,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		// Retrieve session from Stripe
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status !== "paid") {
			return new Response(JSON.stringify({ error: "Payment has not been completed" }), {
				status: 400,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		// Get transaction from database
		const { data: transaction, error: transactionError } = await supabase
			.from("store_orders") // Updated from shop_transactions to store_orders
			.select("*")
			.eq("stripe_session_id", sessionId)
			.eq("user_id", user.id)
			.single();

		if (transactionError || !transaction) {
			return new Response(JSON.stringify({ error: "Transaction not found" }), {
				status: 404,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		// Check if transaction is already completed
		if (transaction.status === "completed") {
			return new Response(
				JSON.stringify({ message: "Transaction already completed", success: true }),
				{ status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
			);
		}

		// Get store item details
		const { data: storeItem, error: storeItemError } = await supabase
			.from("store_items")
			.select("*")
			.eq("id", transaction.store_item_id)
			.single();

		if (storeItemError || !storeItem) {
			return new Response(JSON.stringify({ error: "Store item not found" }), {
				status: 404,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		// Begin a transaction in Supabase to ensure all operations succeed or fail together
		// Unfortunately, Supabase JS client doesn't support transactions directly, so we'll use separate queries with error handling

		// 1. Update transaction status
		const { error: updateTransactionError } = await supabase
			.from("store_orders") // Updated from shop_transactions to store_orders
			.update({
				status: "completed",
				completed_at: new Date().toISOString(),
			})
			.eq("id", transaction.id);

		if (updateTransactionError) {
			return new Response(JSON.stringify({ error: "Failed to update transaction status" }), {
				status: 500,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		// 2. Deduct dark points if needed
		if (storeItem.dark_price && storeItem.dark_price > 0) {
			const { error: darkPointsError } = await supabase.rpc("increment_dark_points", {
				p_user_id: user.id,
				p_dark_points: -storeItem.dark_price,
			});

			if (darkPointsError) {
				// If this fails, we need to revert the transaction status update
				await supabase
					.from("store_orders") // Updated from shop_transactions to store_orders
					.update({ status: "pending", completed_at: null })
					.eq("id", transaction.id);

				return new Response(JSON.stringify({ error: "Failed to deduct dark points" }), {
					status: 500,
					headers: { ...corsHeaders, "Content-Type": "application/json" },
				});
			}
		}

		// 3. Add item to user inventory
		const { error: inventoryError } = await supabase.from("user_inventory").insert([
			{
				user_id: user.id,
				store_item_id: storeItem.id,
				transaction_id: transaction.id,
			},
		]);

		if (inventoryError) {
			// If this fails, we would need to revert the points deduction and transaction update
			// For simplicity, we'll just log the error and inform the user to contact support
			console.error("Failed to add item to inventory:", inventoryError);

			return new Response(
				JSON.stringify({
					warning:
						"Transaction completed but failed to add item to inventory. Please contact support.",
					success: true,
				}),
				{ status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: "Transaction completed successfully",
				item: {
					id: storeItem.id,
					name: storeItem.name,
				},
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
		console.error("Error processing transaction completion:", error);

		return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
			status: 500,
			headers: {
				...corsHeaders,
				"Content-Type": "application/json",
			},
		});
	}
});
