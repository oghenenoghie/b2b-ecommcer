import Link from "next/link";

import { format } from "@/lib/money";
import { updateCartItemQty, removeCartItem } from "@/lib/actions/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CartByVendor } from "@/lib/data/cart";

// Cart is per buyer-org, grouped by vendor — checkout splits into one order
// per vendor (references/commerce.md "Two checkout paths").
export function CartSheet({ groups }: { groups: CartByVendor[] }) {
  if (groups.length === 0) {
    return (
      <div className="border border-line bg-paper p-6">
        <p className="label mb-2">Cart</p>
        <p className="text-sm text-smoke">Empty — items will group by vendor at checkout.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.vendorId} className="border border-line bg-paper">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <Link href={`/v/${group.vendorSlug}`} className="label hover:text-ink">
              {group.vendorName}
            </Link>
            <span className="data">{format(group.subtotal)}</span>
          </div>
          <ul>
            {group.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 last:border-0">
                <div className="min-w-0 flex-1">
                  <Link href={`/p/${item.productSlug}`} className="truncate text-sm text-ink hover:underline">
                    {item.productTitle}
                  </Link>
                  <p className="font-mono text-xs tabular-nums text-smoke">{format(item.unitPrice)} / unit</p>
                </div>
                <form action={updateCartItemQty} className="flex items-center gap-2">
                  <input type="hidden" name="itemId" value={item.id} />
                  <Input
                    name="qty"
                    type="number"
                    min={1}
                    defaultValue={item.qty}
                    className="h-8 w-16 text-center"
                  />
                  <Button type="submit" variant="ghost" size="sm">
                    Update
                  </Button>
                </form>
                <form action={removeCartItem}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <Button type="submit" variant="ghost" size="sm">
                    Remove
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
