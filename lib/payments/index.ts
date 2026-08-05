import type { PaymentProvider } from "@/types";

// Payment provider adapters (Build order step 6, references/commerce.md).
// Truth is webhook-driven — never mark an invoice paid from the client.
// Each adapter implements the same shape so /api/webhooks/payments can stay
// provider-agnostic.
export type ChargeResult = {
  provider: PaymentProvider;
  providerRef: string;
  redirectUrl?: string;
};

export interface PaymentAdapter {
  provider: PaymentProvider;
  createCharge(input: { amountMinor: number; currency: string; invoiceId: string }): Promise<ChargeResult>;
  verifyWebhook(payload: unknown, signature: string | null): boolean;
}

// TODO(build order step 6): implement Tap/MyFatoorah (KNET, Kuwait/GCC) and
// Stripe (international) adapters here, plus invoice/Net-terms as a
// no-charge path for approved buyers.
