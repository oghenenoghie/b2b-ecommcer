"use client";

// Cart is per buyer-org, grouped by vendor at checkout time (Build order
// step 6, references/commerce.md — "Two checkout paths").
export function CartSheet() {
  return (
    <div className="border border-line bg-paper p-6">
      <p className="label mb-2">Cart</p>
      <p className="text-sm text-smoke">Empty — items will group by vendor at checkout.</p>
    </div>
  );
}
