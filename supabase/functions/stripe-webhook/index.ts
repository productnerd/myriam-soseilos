
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StripeEvent {
  id: string
  type: string
  data: {
    object: {
      id: string
      status: string
      client_reference_id?: string
      metadata?: Record<string, string>
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the Stripe signature from headers
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      console.error('No Stripe signature found')
      return new Response('No signature', { status: 400, headers: corsHeaders })
    }

    // Get the webhook secret
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!webhookSecret) {
      console.error('No webhook secret configured')
      return new Response('Webhook secret not configured', { status: 500, headers: corsHeaders })
    }

    // Get the raw body
    const body = await req.text()
    
    // Verify the webhook signature
    const crypto = await import('https://deno.land/std@0.168.0/crypto/mod.ts')
    const encoder = new TextEncoder()
    const key = await crypto.crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const signatureData = signature.split(',')
    const timestamp = signatureData.find(s => s.startsWith('t='))?.split('=')[1]
    const providedSignature = signatureData.find(s => s.startsWith('v1='))?.split('=')[1]

    if (!timestamp || !providedSignature) {
      console.error('Invalid signature format')
      return new Response('Invalid signature', { status: 400, headers: corsHeaders })
    }

    const payload = `${timestamp}.${body}`
    const expectedSignature = await crypto.crypto.subtle.sign('HMAC', key, encoder.encode(payload))
    const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    if (expectedSignatureHex !== providedSignature) {
      console.error('Signature verification failed')
      return new Response('Invalid signature', { status: 400, headers: corsHeaders })
    }

    // Parse the event
    const event: StripeEvent = JSON.parse(body)
    console.log('Received Stripe event:', event.type, 'ID:', event.id)

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(supabaseAdmin, event)
        break
      
      case 'checkout.session.expired':
        await handleCheckoutExpired(supabaseAdmin, event)
        break
      
      default:
        console.log('Unhandled event type:', event.type)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Webhook handler failed' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function handleCheckoutCompleted(supabase: any, event: StripeEvent) {
  const sessionId = event.data.object.id
  console.log('Processing completed checkout:', sessionId)

  try {
    // Update the store order to completed
    const { data: order, error: updateError } = await supabase
      .from('store_orders')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('stripe_session_id', sessionId)
      .select('*')
      .single()

    if (updateError) {
      console.error('Error updating store order:', updateError)
      return
    }

    if (!order) {
      console.log('No order found for session:', sessionId)
      return
    }

    console.log('Order updated successfully:', order.id)

    // Add item to user inventory (store_item_id can be null for other types of rewards)
    const inventoryInsert: any = {
      user_id: order.user_id,
      transaction_id: order.id,
      acquired_at: new Date().toISOString()
    }

    // Only add store_item_id if it exists
    if (order.store_item_id) {
      inventoryInsert.store_item_id = order.store_item_id
    }

    const { error: inventoryError } = await supabase
      .from('user_inventory')
      .insert(inventoryInsert)

    if (inventoryError) {
      console.error('Error adding to inventory:', inventoryError)
      return
    }

    // Send success message to user
    const { error: messageError } = await supabase
      .from('user_messages')
      .insert({
        user_id: order.user_id,
        title: 'Purchase Successful!',
        payload: 'Your store item has been successfully purchased and added to your inventory.',
        tag: 'Store',
        is_read: false
      })

    if (messageError) {
      console.error('Error sending success message:', messageError)
    }

    console.log('Checkout completed processing finished successfully')

  } catch (error) {
    console.error('Error in handleCheckoutCompleted:', error)
  }
}

async function handleCheckoutExpired(supabase: any, event: StripeEvent) {
  const sessionId = event.data.object.id
  console.log('Processing expired checkout:', sessionId)

  try {
    // Update the store order to failed
    const { data: order, error: updateError } = await supabase
      .from('store_orders')
      .update({
        status: 'failed'
      })
      .eq('stripe_session_id', sessionId)
      .select('*')
      .single()

    if (updateError) {
      console.error('Error updating expired order:', updateError)
      return
    }

    if (!order) {
      console.log('No order found for expired session:', sessionId)
      return
    }

    console.log('Expired order updated:', order.id)

    // Send failure message to user
    const { error: messageError } = await supabase
      .from('user_messages')
      .insert({
        user_id: order.user_id,
        title: 'Purchase Expired',
        payload: 'Your checkout session has expired. Please try purchasing the item again.',
        tag: 'Store',
        is_read: false
      })

    if (messageError) {
      console.error('Error sending failure message:', messageError)
    }

    console.log('Checkout expired processing finished successfully')

  } catch (error) {
    console.error('Error in handleCheckoutExpired:', error)
  }
}
