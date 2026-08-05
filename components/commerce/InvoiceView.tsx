import { format, type Money } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import type { InvoiceStatus, InvoiceTerms } from "@/types";

export function InvoiceView({
  number,
  terms,
  status,
  amount,
  dueAt,
}: {
  number: string;
  terms: InvoiceTerms;
  status: InvoiceStatus;
  amount: Money;
  dueAt: string;
}) {
  const badgeVariant = status === "overdue" ? "error" : status === "paid" ? "stock" : "neutral";

  return (
    <div className="border border-line bg-paper p-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-sm tabular-nums text-ink">Invoice {number}</p>
        <Badge variant={badgeVariant}>{status}</Badge>
      </div>
      <div className="mt-4 space-y-1 text-sm text-smoke">
        <p>
          Terms: <span className="text-ink">{terms.replace("_", " ")}</span>
        </p>
        <p>
          Due: <span className="text-ink">{dueAt}</span>
        </p>
      </div>
      <p className="data mt-4 text-base">{format(amount)}</p>
    </div>
  );
}
