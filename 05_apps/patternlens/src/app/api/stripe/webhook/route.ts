import { NextRequest, NextResponse } from "next/server";
import { getStripe, STRIPE_CONFIG } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Lazy initialization for Supabase admin client
function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase environment variables not set");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      STRIPE_CONFIG.webhookSecret
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;

        if (userId && session.subscription) {
          await getSupabaseAdmin()
            .from("profiles")
            .update({
              tier: "PRO",
              stripe_subscription_id: session.subscription as string,
              pro_since: new Date().toISOString(),
            })
            .eq("id", userId);

          console.log(`User ${userId} upgraded to PRO`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;

        if (userId) {
          const isActive = subscription.status === "active" || subscription.status === "trialing";

          await getSupabaseAdmin()
            .from("profiles")
            .update({
              tier: isActive ? "PRO" : "FREE",
              stripe_subscription_status: subscription.status,
            })
            .eq("id", userId);

          console.log(`User ${userId} subscription status: ${subscription.status}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;

        if (userId) {
          await getSupabaseAdmin()
            .from("profiles")
            .update({
              tier: "FREE",
              stripe_subscription_id: null,
              stripe_subscription_status: "canceled",
            })
            .eq("id", userId);

          console.log(`User ${userId} subscription canceled`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Find user by customer ID
        const { data: profile } = await getSupabaseAdmin()
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (profile) {
          console.log(`Payment failed for user ${profile.id}`);
          // Could send email notification here
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

// Note: In Next.js App Router, body parsing is handled differently
// The request.text() method is used to get the raw body for signature verification
