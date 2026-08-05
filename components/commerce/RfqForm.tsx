import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitRfq } from "@/lib/actions/rfq";

// Buyer submits a product + quantity + target price + notes; the vendor
// responds with a Quote (Build order step 6, references/commerce.md).
export function RfqForm({
  productId,
  productSlug,
  moq,
}: {
  productId: string;
  productSlug: string;
  moq: number;
}) {
  return (
    <form action={submitRfq} className="space-y-4 border border-line bg-paper p-6">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="productSlug" value={productSlug} />
      <div className="space-y-1.5">
        <Label htmlFor="qty">Quantity</Label>
        <Input id="qty" name="qty" type="number" min={moq} defaultValue={moq} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="targetPrice">Target price (optional)</Label>
        <Input id="targetPrice" name="targetPrice" type="number" min={0} step="0.001" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" name="notes" placeholder="Delivery timeline, specs, etc." />
      </div>
      <Button type="submit">Submit RFQ</Button>
    </form>
  );
}
