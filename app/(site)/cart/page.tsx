import type { Metadata } from "next";

import { CartSheet } from "@/components/commerce/CartSheet";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="label mb-2">Cart</p>
      <h1 className="font-display text-display-lg text-ink">Your cart</h1>
      <p className="mt-4 text-sm text-smoke">
        Grouped by vendor — checkout splits into one order per vendor.
      </p>
      <div className="mt-8">
        <CartSheet />
      </div>
    </div>
  );
}
