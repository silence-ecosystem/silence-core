import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, STRIPE_CONFIG, getPriceId, getCurrencyFromLocale, getStripeLocale, type SupportedCurrency } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Nie jesteś zalogowany" },
        { status: 401 }
      );
    }

    // Check if user already has PRO
    const { data: profile } = await supabase
      .from("profiles")
      .select("tier, stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (profile?.tier === "PRO") {
      return NextResponse.json(
        { error: "Masz już plan PRO" },
        { status: 400 }
      );
    }

    // Detect currency from request
    let currency: SupportedCurrency = "PLN";

    try {
      const body = await request.json().catch(() => ({}));
      if (body.currency && ["USD", "GBP", "PLN", "EUR"].includes(body.currency)) {
        currency = body.currency as SupportedCurrency;
      } else if (body.locale) {
        currency = getCurrencyFromLocale(body.locale);
      }
    } catch {
      // Use Accept-Language header as fallback
      const acceptLanguage = request.headers.get("accept-language") || "";
      const primaryLocale = acceptLanguage.split(",")[0]?.trim() || "pl";
      currency = getCurrencyFromLocale(primaryLocale);
    }

    // Get or create Stripe customer
    let customerId = profile?.stripe_customer_id;

    const stripeClient = getStripe();

    if (!customerId) {
      const customer = await stripeClient.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      // Save customer ID to profile
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // Get appropriate price ID for currency
    const priceId = getPriceId(currency);

    if (!priceId) {
      return NextResponse.json(
        { error: "Cena nie jest skonfigurowana" },
        { status: 500 }
      );
    }

    // Payment methods based on currency
    const paymentMethods: ("card" | "blik" | "p24")[] = currency === "PLN"
      ? ["card", "blik", "p24"]
      : ["card"];

    // Create checkout session
    const session = await stripeClient.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: paymentMethods,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: STRIPE_CONFIG.successUrl,
      cancel_url: STRIPE_CONFIG.cancelUrl,
      metadata: {
        supabase_user_id: user.id,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
        },
      },
      locale: getStripeLocale(currency) as "en" | "pl" | "de",
      allow_promotion_codes: true,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Nie udało się utworzyć sesji płatności" },
      { status: 500 }
    );
  }
}
