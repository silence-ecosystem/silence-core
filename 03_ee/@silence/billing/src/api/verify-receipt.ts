/**
 * [PATH]: 03_ee/@silence/billing/src/api/verify-receipt.ts
 *
 * IAP receipt verification — Apple App Store + Google Play.
 * EE endpoint.
 */

export interface VerifyReceiptRequest {
  readonly userId: string;
  readonly platform: 'ios' | 'android';
  readonly receipt: string;
  readonly transactionId: string;
}

export interface VerifyReceiptResponse {
  readonly valid: boolean;
  readonly plan: 'pro' | 'enterprise' | null;
  readonly expiresAt: string | null;
  readonly transactionId: string;
}

export async function verifyReceipt(
  _req: VerifyReceiptRequest
): Promise<VerifyReceiptResponse> {
  // MVP: stub — integrate with Apple/Google verification APIs in production
  return {
    valid: false,
    plan: null,
    expiresAt: null,
    transactionId: _req.transactionId,
  };
}
