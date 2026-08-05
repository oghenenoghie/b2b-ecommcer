import type { Metadata } from "next";
import Link from "next/link";

import { CartSheet } from "@/components/commerce/CartSheet";
import { Button } from "@/components/ui/button";
import { getCurrentCart } from "@/lib/data/cart";
import { format } from "@/lib/money";

export const metadata: Metadata = {
  title: "Cart",
};

export default async function CartPage() {
  const groups = await getCurrentCart();

  if (groups === null) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="label mb-2">Cart</p>
        <h1 className="font-display text-display-lg text-ink">Your cart</h1>
        <p className="mt-4 text-sm text-smoke">
          Sign in to a buyer org to see your cart — no auth UI exists in this scaffold yet.
        </p>
      </div>
    );
  }

  const grandTotal = groups.reduce((sum, g) => sum + g.subtotal.amount, 0);
  const currency = groups[0]?.subtotal.currency ?? "KWD";

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="label mb-2">Cart</p>
      <h1 className="font-display text-display-lg text-ink">Your cart</h1>
      <p className="mt-4 text-sm text-smoke">
        Grouped by vendor — checkout splits into one order per vendor.
      </p>
      <div className="mt-8">
        <CartSheet groups={groups} />
      </div>
      {groups.length > 0 ? (
        <div className="mt-8 flex items-center justify-between border-t border-ink pt-6">
          <span className="label">Total ({groups.length} vendor{groups.length > 1 ? "s" : ""})</span>
          <span className="data text-base">{format({ amount: grandTotal, currency })}</span>
        </div>
      ) : null}
      <div className="mt-8 flex justify-between">
        <Link href="/search" className="text-sm text-smoke hover:text-ink">
          Continue shopping
        </Link>
        {groups.length > 0 ? (
          <Button asChild>
            <Link href="/checkout">Checkout</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
