"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Buyer submits products + quantities + target price + notes; vendor
// responds with a Quote (Build order step 6, references/commerce.md).
export function RfqForm() {
  return (
    <form className="space-y-4 border border-line bg-paper p-6">
      <div className="space-y-1.5">
        <Label htmlFor="qty">Quantity</Label>
        <Input id="qty" type="number" min={1} placeholder="50" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="target-price">Target price (optional)</Label>
        <Input id="target-price" type="number" min={0} placeholder="0.00" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" placeholder="Delivery timeline, specs, etc." />
      </div>
      <Button type="submit">Submit RFQ</Button>
    </form>
  );
}
