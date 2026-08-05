import { format, type Money } from "@/lib/money";

export function CheckoutSummary({
  subtotal,
  tax,
  total,
}: {
  subtotal: Money;
  tax: Money;
  total: Money;
}) {
  const row = (label: string, value: Money) => (
    <div className="flex items-baseline justify-between py-2">
      <span className="label">{label}</span>
      <span className="data">{format(value)}</span>
    </div>
  );

  return (
    <div className="border border-line bg-paper p-6">
      {row("Subtotal", subtotal)}
      {row("Tax", tax)}
      <div className="border-t border-ink pt-2">{row("Total", total)}</div>
    </div>
  );
}
