import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
};

// Instant path only — per-vendor order split, then pay now or (approved
// buyers) place on Net terms. Build order step 6.
export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="label mb-2">Checkout</p>
      <h1 className="font-display text-display-lg text-ink">Checkout</h1>
      <p className="mt-4 text-sm text-smoke">
        Per-vendor order split + payment (Tap/MyFatoorah/Stripe/terms) lands in
        Build order step 6.
      </p>
    </div>
  );
}
