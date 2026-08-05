import type { Metadata } from "next";

import { CheckoutSummary } from "@/components/commerce/CheckoutSummary";
import { Button } from "@/components/ui/button";
import { getCurrentCart } from "@/lib/data/cart";
import { placeOrder } from "@/lib/actions/checkout";
import { format } from "@/lib/money";

export const metadata: Metadata = {
  title: "Checkout",
};

// Instant path only — per-vendor order split, then pay now or (approved
// buyers) place on Net terms. Payment capture itself (Tap/MyFatoorah/
// Stripe) is Build order step 6's external-provider work; this creates the
// split orders + invoices.
export default async function CheckoutPage() {
  const groups = await getCurrentCart();

  if (!groups) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="label mb-2">Checkout</p>
        <h1 className="font-display text-display-lg text-ink">Checkout</h1>
        <p className="mt-4 text-sm text-smoke">
          Sign in to a buyer org to check out — no auth UI exists in this scaffold yet.
        </p>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="label mb-2">Checkout</p>
        <h1 className="font-display text-display-lg text-ink">Checkout</h1>
        <p className="mt-4 text-sm text-smoke">Your cart is empty.</p>
      </div>
    );
  }

  const currency = groups[0].subtotal.currency;
  const subtotal = groups.reduce((sum, g) => sum + g.subtotal.amount, 0);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="label mb-2">Checkout</p>
      <h1 className="font-display text-display-lg text-ink">Checkout</h1>

      <div className="mt-8 space-y-6">
        {groups.map((group) => (
          <div key={group.vendorId} className="border border-line bg-paper">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="label">{group.vendorName}</span>
              <span className="data">{format(group.subtotal)}</span>
            </div>
            <ul>
              {group.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between px-4 py-2 text-sm">
                  <span className="text-ink">
                    {item.productTitle} <span className="text-smoke">&times; {item.qty}</span>
                  </span>
                  <span className="data">{format({ amount: item.unitPrice.amount * item.qty, currency: item.unitPrice.currency })}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <CheckoutSummary
          subtotal={{ amount: subtotal, currency }}
          tax={{ amount: 0, currency }}
          total={{ amount: subtotal, currency }}
        />
      </div>

      <form action={placeOrder} className="mt-8 space-y-4">
        <div>
          <p className="label mb-3">Payment terms</p>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" name="terms" value="prepaid" defaultChecked /> Pay now
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="terms" value="net_15" /> Net 15 (approved buyers)
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="terms" value="net_30" /> Net 30 (approved buyers)
            </label>
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full">
          Place order{groups.length > 1 ? `s (${groups.length})` : ""}
        </Button>
      </form>
    </div>
  );
}
