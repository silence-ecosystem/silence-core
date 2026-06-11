/**
 * [PATH]: 03_ee/@silence/billing/src/api/create-checkout.ts
 *
 * Stripe checkout session creation — EE endpoint.
 * Returns checkout URL for upgrade flow.
 */

export interface CheckoutRequest {
  readonly userId: string;
  readonly plan: 'pro' | 'enterprise';
  readonly successUrl: string;
  readonly cancelUrl: string;
}

export interface CheckoutResponse {
  readonly sessionId: string;
  readonly url: string;
}

export async function createCheckoutSession(
  _req: CheckoutRequest
): Promise<CheckoutResponse> {
  // MVP: stub — production integrates with Stripe SDK
  const sessionId = `cs_test_${Date.now()}`;
  return {
    sessionId,
    url: `/checkout/redirect?session=${sessionId}`,
  };
}
